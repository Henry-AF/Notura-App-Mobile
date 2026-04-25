export interface PickedAudioFile {
  uri: string;
  name: string;
  mimeType?: string;
  size?: number;
}

interface DocumentPickerAsset {
  uri: string;
  name: string;
  mimeType?: string;
  size?: number;
}

interface DocumentPickerResult {
  canceled: boolean;
  assets: DocumentPickerAsset[] | null;
}

interface DocumentPickerOptions {
  type: string;
  multiple: boolean;
  copyToCacheDirectory: boolean;
}

export interface AudioFilePickerDependencies {
  getDocumentAsync?: (options: DocumentPickerOptions) => Promise<DocumentPickerResult>;
}

async function defaultGetDocumentAsync(options: DocumentPickerOptions): Promise<DocumentPickerResult> {
  const documentPicker = await import("expo-document-picker");
  return documentPicker.getDocumentAsync(options);
}

export async function pickAudioFile(
  dependencies: AudioFilePickerDependencies = {},
): Promise<PickedAudioFile | null> {
  const getDocumentAsync = dependencies.getDocumentAsync ?? defaultGetDocumentAsync;
  const result = await getDocumentAsync({
    type: "audio/*",
    multiple: false,
    copyToCacheDirectory: true,
  });

  if (result.canceled || !result.assets || result.assets.length === 0) {
    return null;
  }

  const [asset] = result.assets;
  return {
    uri: asset.uri,
    name: asset.name,
    mimeType: asset.mimeType,
    size: asset.size,
  };
}

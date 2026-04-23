type AsyncStorageLike = {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
};

interface AuthStorageDependencies {
  isWeb?: boolean;
  setCookie?: (key: string, value: string) => void;
  removeCookie?: (key: string) => void;
}

function getDefaultWebMode() {
  return typeof document !== "undefined";
}

function defaultSetCookie(key: string, value: string) {
  document.cookie = `${key}=${encodeURIComponent(value)}; Path=/; Max-Age=31536000; SameSite=Lax`;
}

function defaultRemoveCookie(key: string) {
  document.cookie = `${key}=; Path=/; Max-Age=0; SameSite=Lax`;
}

export function createSupabaseAuthStorage(
  baseStorage: AsyncStorageLike,
  dependencies: AuthStorageDependencies = {},
): AsyncStorageLike {
  const isWeb = dependencies.isWeb ?? getDefaultWebMode();
  const setCookie = dependencies.setCookie ?? defaultSetCookie;
  const removeCookie = dependencies.removeCookie ?? defaultRemoveCookie;

  return {
    getItem: (key: string) => baseStorage.getItem(key),
    setItem: async (key: string, value: string) => {
      await baseStorage.setItem(key, value);
      if (isWeb) {
        setCookie(key, value);
      }
    },
    removeItem: async (key: string) => {
      await baseStorage.removeItem(key);
      if (isWeb) {
        removeCookie(key);
      }
    },
  };
}


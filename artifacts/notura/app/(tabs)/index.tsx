import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { CircularProgress } from "@/components/CircularProgress";

// ─── Design Tokens ────────────────────────────────────────────────────────────
// Seguir ao pé da letra — não substituir nenhum hex
const BG_PAGE        = "#F9F3FD";
const PRIMARY        = "#AF52DE";
const CARD_DARK      = "#2A4A52";
const WHITE          = "#FFFFFF";
const TEXT_PRIMARY   = "#1A1A1A";
const TEXT_SECONDARY = "#6B6B6B";
const BORDER         = "#E5D6F5";
const PLACEHOLDER    = "#B0B0B0";
const PROGRESS_TRACK = "#F0E5FA";

// ─── Helper ───────────────────────────────────────────────────────────────────
function saudacao() {
  const h = new Date().getHours();
  if (h < 12) return "Bom dia,";
  if (h < 18) return "Boa tarde,";
  return "Boa noite,";
}

// ─── FilterChip ───────────────────────────────────────────────────────────────
function FilterChip({
  icon,
  label,
}: {
  icon: React.ComponentProps<typeof Feather>["name"];
  label: string;
}) {
  return (
    <View style={styles.chip}>
      <Feather name={icon} size={14} color={PRIMARY} />
      <Text style={styles.chipText}>{label}</Text>
    </View>
  );
}

// ─── ProjectCard ──────────────────────────────────────────────────────────────
function ProjectCard({
  name,
  category,
  date,
  progress,
  icon,
}: {
  name: string;
  category: string;
  date: string;
  progress: number;
  icon: React.ComponentProps<typeof Feather>["name"];
}) {
  return (
    <View style={styles.projectCard}>
      {/* Topo: data + menu */}
      <View style={styles.cardTopRow}>
        <Text style={styles.cardDate}>{date}</Text>
        <Feather name="more-horizontal" size={16} color={PLACEHOLDER} />
      </View>

      {/* Área de ícone */}
      <View style={styles.cardIconArea}>
        <View style={styles.cardIconWrap}>
          <Feather name={icon} size={24} color={PRIMARY} />
        </View>
      </View>

      {/* Rodapé */}
      <Text style={styles.cardName}>{name}</Text>
      <Text style={styles.cardCategory}>{category}</Text>
      <View style={styles.cardProgressRow}>
        <View style={styles.cardProgressBg}>
          <View style={[styles.cardProgressFill, { width: `${progress}%` as any }]} />
        </View>
        <Text style={styles.cardProgressPct}>{progress}%</Text>
      </View>
    </View>
  );
}

// ─── VerMaisCard ──────────────────────────────────────────────────────────────
function VerMaisCard() {
  return (
    <View style={styles.verMaisCard}>
      <Text style={styles.verMaisLabel}>Ver mais</Text>
      <Text style={styles.verMaisCount}>+5 projetos</Text>
      <TouchableOpacity style={styles.verMaisBtn} activeOpacity={0.8}>
        <Feather name="arrow-right" size={18} color={WHITE} />
      </TouchableOpacity>
    </View>
  );
}

// ─── HomeScreen ───────────────────────────────────────────────────────────────
export default function HomeScreen() {
  const insets    = useSafeAreaInsets();
  const router    = useRouter();
  const [search, setSearch] = useState("");

  const topPad    = Platform.OS === "web" ? 16 : insets.top + 16;
  const bottomPad = Platform.OS === "web" ? 120 : insets.bottom + 110;

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={[styles.scroll, { paddingBottom: bottomPad }]}
      showsVerticalScrollIndicator={false}
    >
      {/* 1. Header */}
      <View style={[styles.header, { paddingTop: topPad }]}>
        <TouchableOpacity style={styles.iconBtn} activeOpacity={0.7}>
          <Feather name="menu" size={24} color={TEXT_PRIMARY} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconBtn} activeOpacity={0.7}>
          <Feather name="bell" size={24} color={TEXT_PRIMARY} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {/* 2. Saudação */}
        <View style={styles.greeting}>
          <Text style={styles.greetingSmall}>{saudacao()}</Text>
          <Text style={styles.greetingTitle}>
            {"Vamos gravar suas\n"}
            <Text style={styles.greetingAccent}>{"reuniões"}</Text>
            {" hoje"}
          </Text>
        </View>

        {/* 3. Campo de busca */}
        <View style={styles.searchWrap}>
          <Feather name="search" size={16} color={PRIMARY} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar projetos, reuniões..."
            placeholderTextColor={PLACEHOLDER}
            value={search}
            onChangeText={setSearch}
            returnKeyType="search"
          />
        </View>

        {/* 4. Card de status */}
        <View style={styles.statusCard}>
          <View style={styles.statusLeft}>
            <Text style={styles.statusTitle}>Seus projetos estão indo bem</Text>
            <Text style={styles.statusSub}>3 tarefas pendentes esta semana</Text>
            <TouchableOpacity
              style={styles.statusBtn}
              activeOpacity={0.82}
              onPress={() => router.push("/schedule")}
            >
              <Text style={styles.statusBtnText}>Ver tarefas</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.statusRight}>
            <View style={styles.progressWrap}>
              <CircularProgress
                size={72}
                strokeWidth={7}
                progress={73}
                color={PRIMARY}
                trackColor="rgba(255,255,255,0.15)"
              />
              <View style={styles.progressCenter}>
                <Text style={styles.progressPct}>73%</Text>
                <Text style={styles.progressLabel}>feito</Text>
              </View>
            </View>
          </View>
        </View>

        {/* 5. Filtros */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterScroll}
          contentContainerStyle={styles.filterRow}
        >
          <FilterChip icon="calendar" label="Agenda de hoje" />
          <FilterChip icon="bookmark" label="Destaques" />
          <FilterChip icon="zap" label="IA Insights" />
        </ScrollView>

        {/* 6. Header da seção */}
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Projetos em andamento</Text>
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={styles.seeAll}>Ver tudo</Text>
          </TouchableOpacity>
        </View>

        {/* 7. Grid de projetos */}
        <View style={styles.grid}>
          <View style={styles.gridItem}>
            <ProjectCard
              name="Marketing"
              category="Campanha"
              date="21 mai"
              progress={87}
              icon="radio"
            />
          </View>
          <View style={styles.gridItem}>
            <VerMaisCard />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  // Fundo: #F9F3FD em toda a tela
  scrollView: {
    flex: 1,
    backgroundColor: BG_PAGE,
  },
  scroll: {
    flexGrow: 1,
    backgroundColor: BG_PAGE,
  },

  // 1. Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 4,
  },
  iconBtn: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },

  content: {
    paddingHorizontal: 20,
  },

  // 2. Saudação
  greeting: {
    marginTop: 12,
  },
  greetingSmall: {
    fontSize: 15,
    fontWeight: "400",
    color: TEXT_SECONDARY,
    lineHeight: 22,
  },
  greetingTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: TEXT_PRIMARY,
    lineHeight: 36,
    marginTop: 2,
  },
  greetingAccent: {
    fontSize: 28,
    fontWeight: "700",
    color: PRIMARY,
  },

  // 3. Campo de busca
  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: WHITE,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER,
    height: 46,
    paddingHorizontal: 16,
    marginTop: 20,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: TEXT_PRIMARY,
    height: "100%",
  },

  // 4. Card de status
  statusCard: {
    backgroundColor: CARD_DARK,
    borderRadius: 16,
    padding: 20,
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  statusLeft: {
    flex: 1,
  },
  statusTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: WHITE,
    lineHeight: 21,
  },
  statusSub: {
    fontSize: 13,
    fontWeight: "400",
    color: "rgba(255,255,255,0.65)",
    marginTop: 4,
    lineHeight: 19,
  },
  statusBtn: {
    marginTop: 16,
    alignSelf: "flex-start",
    backgroundColor: PRIMARY,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  statusBtnText: {
    fontSize: 13,
    fontWeight: "600",
    color: WHITE,
  },
  statusRight: {
    paddingLeft: 16,
  },
  progressWrap: {
    position: "relative",
    width: 72,
    height: 72,
    alignItems: "center",
    justifyContent: "center",
  },
  progressCenter: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  progressPct: {
    fontSize: 14,
    fontWeight: "700",
    color: WHITE,
    lineHeight: 18,
  },
  progressLabel: {
    fontSize: 10,
    fontWeight: "400",
    color: "rgba(255,255,255,0.65)",
    lineHeight: 14,
  },

  // 5. Filtros
  filterScroll: {
    marginTop: 20,
  },
  filterRow: {
    flexDirection: "row",
    gap: 8,
    paddingRight: 4,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: WHITE,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  chipText: {
    fontSize: 13,
    fontWeight: "500",
    color: TEXT_PRIMARY,
  },

  // 6. Seção header
  sectionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 28,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: TEXT_PRIMARY,
  },
  seeAll: {
    fontSize: 14,
    fontWeight: "500",
    color: PRIMARY,
  },

  // 7. Grid
  grid: {
    flexDirection: "row",
    gap: 12,
  },
  gridItem: {
    flex: 1,
  },

  // Card normal
  projectCard: {
    backgroundColor: WHITE,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 14,
    minHeight: 160,
  },
  cardTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardDate: {
    fontSize: 12,
    color: TEXT_SECONDARY,
  },
  cardIconArea: {
    height: 56,
    alignItems: "flex-start",
    justifyContent: "center",
    marginTop: 8,
  },
  cardIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: BG_PAGE,
    alignItems: "center",
    justifyContent: "center",
  },
  cardName: {
    fontSize: 14,
    fontWeight: "700",
    color: TEXT_PRIMARY,
    marginTop: 10,
  },
  cardCategory: {
    fontSize: 12,
    color: TEXT_SECONDARY,
    marginTop: 2,
  },
  cardProgressRow: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  cardProgressBg: {
    flex: 1,
    height: 4,
    borderRadius: 4,
    backgroundColor: PROGRESS_TRACK,
    overflow: "hidden",
  },
  cardProgressFill: {
    height: "100%",
    borderRadius: 4,
    backgroundColor: PRIMARY,
  },
  cardProgressPct: {
    fontSize: 12,
    fontWeight: "600",
    color: PRIMARY,
    minWidth: 30,
    textAlign: "right",
  },

  // Card "Ver mais"
  verMaisCard: {
    backgroundColor: CARD_DARK,
    borderRadius: 14,
    padding: 14,
    minHeight: 160,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  verMaisLabel: {
    fontSize: 13,
    fontWeight: "500",
    color: "rgba(255,255,255,0.70)",
    marginBottom: 6,
  },
  verMaisCount: {
    fontSize: 20,
    fontWeight: "700",
    color: PRIMARY,
  },
  verMaisBtn: {
    marginTop: 14,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
});


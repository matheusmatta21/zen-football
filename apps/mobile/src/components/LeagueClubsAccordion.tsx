import type { Club, ClubCatalog } from "@zen/types";
import { Accordion, useThemeColor } from "heroui-native";
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { getClubCatalog } from "../services/footballData";
import ClubOption from "./ClubOption";
import CrestImage from "./CrestImage";
import { getClubLogo, getCompetitionEmblem } from "./tournaments";

type Props = {
  selectedClub: Club | null;
  onSelectClub: (club: Club) => void;
};

function LeagueClubs({ clubs, selectedClub, onSelectClub }: Props & { clubs: Club[] }) {
  if (clubs.length === 0) return <Text className="py-4 text-center text-heading">Nenhum clube disponível nesta liga.</Text>;

  return (
    <View className="flex-row flex-wrap gap-y-5 pb-5 pt-2">
      {clubs.map((club) => (
        <ClubOption key={club.id} clubName={club.name} clubImageSource={getClubLogo(club)}
          columns={4} isSelected={club.id === selectedClub?.id} onSelect={() => onSelectClub(club)} />
      ))}
    </View>
  );
}

export default function LeagueClubsAccordion({ selectedClub, onSelectClub }: Props) {
  const foreground = useThemeColor("default-foreground");
  const muted = useThemeColor("muted");
  const [catalog, setCatalog] = useState<ClubCatalog | null>(null);
  const [hasError, setHasError] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    setHasError(false);
    setCatalog(null);
    getClubCatalog().then((data) => {
      if (active) setCatalog(data);
    }).catch(() => {
      if (active) setHasError(true);
    });
    return () => { active = false; };
  }, [attempt]);

  if (hasError) return (
    <View className="items-center gap-2 py-4">
      <Text className="text-center text-heading">Não foi possível carregar os clubes.</Text>
      <Pressable accessibilityRole="button" onPress={() => setAttempt((value) => value + 1)}
        className="min-h-11 items-center justify-center px-4">
        <Text className="font-bold text-ink">Tentar novamente</Text>
      </Pressable>
    </View>
  );
  if (catalog === null) return <ActivityIndicator accessibilityLabel="Carregando clubes" color={muted} className="py-6" />;
  return (
    <Accordion selectionMode="single" className="w-full"
      classNames={{ separator: "bg-card-border" }}>
      {catalog.leagues.map((league) => (
        <Accordion.Item key={league.id} value={String(league.id)}>
          {({ isExpanded }) => (
            <>
              <Accordion.Trigger className="min-h-14 px-0 py-4" accessibilityLabel={league.name}>
                <View className="flex-1 flex-row items-center gap-3">
                  <CrestImage source={getCompetitionEmblem({ code: league.code,
                    emblem: `https://crests.football-data.org/${league.code}.png` })}
                    size={24} name={league.name} />
                  <Text className="flex-1 text-base font-bold text-ink">{league.name}</Text>
                </View>
                <Accordion.Indicator iconProps={{ color: foreground, size: 18 }} />
              </Accordion.Trigger>
              <Accordion.Content className="px-0">
                {isExpanded && <LeagueClubs clubs={league.clubs} selectedClub={selectedClub} onSelectClub={onSelectClub} />}
              </Accordion.Content>
            </>
          )}
        </Accordion.Item>
      ))}
    </Accordion>
  );
}

import type { FdCompetition } from "@zen/types";
import { useThemeColor } from "heroui-native";
import { ArrowLeftRight } from "lucide-react-native";
import { useState } from "react";
import { Image, Pressable, Text, View } from "react-native";
import type { MatchListMode } from "../utils/selectMatches";

import CompetitionsMenu from "./CompetitionsMenu";
import SelectClubsDialog from "./SelectClubsDialog";
import { Club, ClubId, getClubLogo } from "./tournaments";

type HeaderProps = {
  competitions: FdCompetition[];
  selectedCompetitionIds: number[];
  onToggleCompetition: (competitionId: number) => void;
  selectedClub: Club;
  onSelectClub: (clubId: ClubId) => void;
  matchListMode: MatchListMode;
  onToggleMatchListMode: () => void;
};

export default function Header({
  competitions,
  selectedCompetitionIds,
  onToggleCompetition,
  selectedClub,
  onSelectClub,
  matchListMode,
  onToggleMatchListMode,
}: HeaderProps) {
  const foreground = useThemeColor("default-foreground");
  const [isClubsModalOpen, setIsClubsModalOpen] = useState(false);
  const selectedClubLogo = getClubLogo(selectedClub);

  return (
    <View className="flex-col items-center justify-center bg-pitch pt-7.5 pb-2">
      <View className="mb-4 w-full flex-row items-center justify-center gap-10 bg-pitch">
        <CompetitionsMenu
          competitions={competitions}
          selectedCompetitionIds={selectedCompetitionIds}
          onToggleCompetition={onToggleCompetition}
        />
        <View className="h-10 w-10 items-center justify-center">
          <Image
            source={require("../../assets/images/logo-zen-football.png")}
            className="h-12.5 w-12.5 object-contain"
          />
        </View>
        <View className="h-10 w-10 items-center justify-center">
          <Pressable
            accessibilityLabel={`Clube: ${selectedClub.name}`}
            onPress={() => setIsClubsModalOpen(true)}
          >
            {selectedClubLogo ? (
              <Image
                source={selectedClubLogo}
                className="h-8 w-8 object-contain"
              />
            ) : (
              <View className="h-7 w-7" />
            )}
          </Pressable>
        </View>
      </View>
      <View className="flex-row items-center justify-center">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={
            matchListMode === "upcoming"
              ? "Mostrar partidas passadas"
              : "Mostrar partidas seguintes"
          }
          onPress={onToggleMatchListMode}
          className="flex-row items-center justify-center active:opacity-60 gap-1 text-center"
        >
          <Text
            accessibilityRole="header"
            className="font-semibold uppercase text-heading"
          >
            {matchListMode === "upcoming"
              ? "Partidas Seguintes"
              : "Partidas Passadas"}
          </Text>
          <ArrowLeftRight size={20} color={foreground} />
        </Pressable>
      </View>
      <SelectClubsDialog
        isOpen={isClubsModalOpen}
        onClose={() => setIsClubsModalOpen(false)}
        selectedClubId={selectedClub.id}
        onSelectClub={onSelectClub}
      />
    </View>
  );
}

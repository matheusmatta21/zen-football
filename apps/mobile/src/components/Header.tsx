import type { FdCompetition } from "@zen/types";
import { useState } from "react";
import { Image, Pressable, Text, View } from "react-native";

import CompetitionsMenu from "./CompetitionsMenu";
import SelectClubsDialog from "./SelectClubsDialog";
import { Club, ClubId, getClubLogo } from "./tournaments";

type HeaderProps = {
  competitions: FdCompetition[];
  selectedCompetitionIds: number[];
  onToggleCompetition: (competitionId: number) => void;
  selectedClub: Club;
  onSelectClub: (clubId: ClubId) => void;
};

export default function Header({
  competitions,
  selectedCompetitionIds,
  onToggleCompetition,
  selectedClub,
  onSelectClub,
}: HeaderProps) {
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
      <Text className="font-semibold uppercase text-heading">
        Partidas Seguintes
      </Text>
      <SelectClubsDialog
        isOpen={isClubsModalOpen}
        onClose={() => setIsClubsModalOpen(false)}
        selectedClubId={selectedClub.id}
        onSelectClub={onSelectClub}
      />
    </View>
  );
}

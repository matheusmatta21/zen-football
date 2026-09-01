import type { FdCompetition } from "@zen/types";
import { Menu } from "heroui-native";
import { Trophy } from "lucide-react-native";
import { useState } from "react";
import { Image, Pressable, Text, View } from "react-native";
import SelectClubsDialog from "./SelectClubsDialog";
import { ClubId } from "./tournaments";

type HeaderProps = {
  competitions: FdCompetition[];
  selectedCompetitionIds: number[];
  onToggleCompetition: (competitionId: number) => void;
  selectedClubIds: ClubId[];
  onToggleClub: (clubId: ClubId) => void;
};

export default function Header({
  competitions,
  selectedCompetitionIds,
  onToggleCompetition,
  selectedClubIds,
  onToggleClub,
}: HeaderProps) {
  const [isClubsModalOpen, setIsClubsModalOpen] = useState(false);

  return (
    <View className="flex-col items-center justify-center bg-pitch pt-7.5 pb-2">
      <View className="mb-4 w-full flex-row items-center justify-center gap-10 bg-pitch">
        <View className="h-10 w-10 items-center justify-center">
          <Menu>
            <Menu.Trigger accessibilityLabel="Competições">
              <Trophy width={28} height={28} strokeWidth={1.5} />
            </Menu.Trigger>
            <Menu.Portal>
              <Menu.Overlay />
              <Menu.Content
                presentation="popover"
                width={240}
                align="start"
                offset={8}
              >
                <Menu.Label className="mb-1">Competições</Menu.Label>
                {competitions.length === 0 ? (
                  <Menu.Item isDisabled>
                    <Menu.ItemTitle>Nenhuma competição</Menu.ItemTitle>
                  </Menu.Item>
                ) : (
                  competitions.map((competition) => (
                    <Menu.Item
                      key={competition.id}
                      shouldCloseOnSelect={false}
                      isSelected={selectedCompetitionIds.includes(
                        competition.id,
                      )}
                      onSelectedChange={() =>
                        onToggleCompetition(competition.id)
                      }
                    >
                      <Menu.ItemIndicator />
                      {competition.emblem ? (
                        <Image
                          source={{ uri: competition.emblem }}
                          className="h-5 w-5"
                          resizeMode="contain"
                        />
                      ) : (
                        <View className="h-5 w-5" />
                      )}
                      <Menu.ItemTitle>{competition.name}</Menu.ItemTitle>
                    </Menu.Item>
                  ))
                )}
              </Menu.Content>
            </Menu.Portal>
          </Menu>
        </View>
        <View className="h-10 w-10 items-center justify-center">
          <Image
            source={require("../../assets/images/logo-zen-football.png")}
            className="h-12.5 w-12.5 object-contain"
          />
        </View>
        <View className="h-10 w-10 items-center justify-center">
          <Pressable onPress={() => setIsClubsModalOpen(true)}>
          <Image
            source={require("../../assets/images/bournemouth.png")}
            className="h-7 w-7 object-contain"
          />
          </Pressable>
        </View>
      </View>
      <Text className="font-semibold uppercase text-heading">
        Partidas Seguintes
      </Text>
      <SelectClubsDialog
        isOpen={isClubsModalOpen}
        onClose={() => setIsClubsModalOpen(false)}
        selectedClubIds={selectedClubIds}
        onToggleClub={onToggleClub}
      />
    </View>
  );
}

import type { FdCompetition } from "@zen/types";
import { Menu } from "heroui-native";
import { Trophy } from "lucide-react-native";
import { useState } from "react";
import { Image, Pressable, Text, View } from "react-native";
import SelectClubsDialog from "./SelectClubsDialog";
import {
  Club,
  ClubId,
  getClubLogo,
  getCompetitionEmblem,
  getTournamentName,
} from "./tournaments";

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
                align="center"
                offset={8}
                className="rounded-2xl border border-card-border bg-card/90 p-2 shadow-lg"
              >
                <Menu.Label className="mb-2 px-2 pt-1 text-xs font-bold uppercase text-heading">
                  Ligas
                </Menu.Label>
                {competitions.length === 0 ? (
                  <Menu.Item isDisabled className="rounded-xl px-3 py-2">
                    <Menu.ItemTitle className="text-heading">
                      Nenhuma competição
                    </Menu.ItemTitle>
                  </Menu.Item>
                ) : (
                  competitions.map((competition) => {
                    const competitionEmblem = getCompetitionEmblem(competition);

                    return (
                      <Menu.Item
                        key={competition.id}
                        shouldCloseOnSelect={false}
                        isSelected={selectedCompetitionIds.includes(
                          competition.id,
                        )}
                        className="rounded-xl px-3 py-2.5"
                        onSelectedChange={() =>
                          onToggleCompetition(competition.id)
                        }
                      >
                        <Menu.ItemIndicator />
                        {competitionEmblem ? (
                          <Image
                            source={competitionEmblem}
                            className="h-5 w-5"
                            resizeMode="contain"
                          />
                        ) : (
                          <View className="h-5 w-5" />
                        )}
                        <Menu.ItemTitle className="font-semibold text-heading">
                          {getTournamentName(competition)}
                        </Menu.ItemTitle>
                      </Menu.Item>
                    );
                  })
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
          <Pressable
            accessibilityLabel={`Clube: ${selectedClub.name}`}
            onPress={() => setIsClubsModalOpen(true)}
          >
            {selectedClubLogo ? (
              <Image
                source={selectedClubLogo}
                className="h-7 w-7 object-contain"
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

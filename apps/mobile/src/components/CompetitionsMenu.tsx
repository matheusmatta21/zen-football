import type { FdCompetition } from "@zen/types";
import { Menu, useThemeColor } from "heroui-native";
import { CheckIcon, Trophy } from "lucide-react-native";
import { Image, View } from "react-native";

import { getCompetitionEmblem, getTournamentName } from "./tournaments";

type CompetitionsMenuProps = {
  competitions: FdCompetition[];
  selectedCompetitionIds: number[];
  onToggleCompetition: (competitionId: number) => void;
};

export default function CompetitionsMenu({
  competitions,
  selectedCompetitionIds,
  onToggleCompetition,
}: CompetitionsMenuProps) {
  const background = useThemeColor("background");
  const foreground = useThemeColor("default-foreground");

  return (
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
                const isSelected = selectedCompetitionIds.includes(
                  competition.id,
                );

                return (
                  <Menu.Item
                    key={competition.id}
                    shouldCloseOnSelect={false}
                    isSelected={isSelected}
                    animation={{
                      backgroundColor: {
                        value: background,
                        timingConfig: { duration: 0 },
                      },
                    }}
                    className="rounded-xl px-3 py-2.5"
                    onSelectedChange={() =>
                      onToggleCompetition(competition.id)
                    }
                  >
                    <Menu.ItemIndicator>
                      <CheckIcon
                        width={20}
                        height={20}
                        strokeWidth={2}
                        color={foreground}
                      />
                    </Menu.ItemIndicator>
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
  );
}

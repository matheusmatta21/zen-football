import { Dialog, useThemeColor } from "heroui-native";
import { ScrollView, View, useWindowDimensions } from "react-native";
import type { Club } from "@zen/types";
import LeagueClubsAccordion from "./LeagueClubsAccordion";

type SelectClubsDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  selectedClub: Club;
  onSelectClub: (club: Club) => void;
};

export default function SelectClubsDialog({
  isOpen,
  onClose,
  selectedClub,
  onSelectClub,
}: SelectClubsDialogProps) {
  const foreground = useThemeColor("default-foreground");
  const { height } = useWindowDimensions();

  return (
    <Dialog
      isOpen={isOpen}
      onOpenChange={(isDialogOpen) => {
        if (!isDialogOpen) {
          onClose();
        }
      }}
    >
      <Dialog.Portal className="px-0">
        <Dialog.Overlay />
        <Dialog.Content
          isSwipeable={false}
          className="w-[95%] max-w-lg self-center rounded-[28px] bg-card p-5"
          style={{ maxHeight: height * 0.85 }}
        >
          <View className="relative flex-row items-center mb-4">
            <Dialog.Title className="w-full text-center text-ink">
              Clubes
            </Dialog.Title>
            <Dialog.Close
              iconProps={{ color: foreground }}
              className="absolute right-0 top-0 bg-transparent"
            />
          </View>
          <ScrollView style={{ flexShrink: 1 }} showsVerticalScrollIndicator={false}>
            {isOpen && <LeagueClubsAccordion selectedClub={selectedClub}
              onSelectClub={(club) => { onSelectClub(club); onClose(); }} />}
          </ScrollView>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
}

import { Dialog, useThemeColor } from "heroui-native";
import { View } from "react-native";
import { CLUBS, ClubId, getClubLogo } from "./tournaments";
import ClubOption from "./ClubOption";

type SelectClubsDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  selectedClubId: ClubId;
  onSelectClub: (clubId: ClubId) => void;
};

export default function SelectClubsDialog({
  isOpen,
  onClose,
  selectedClubId,
  onSelectClub,
}: SelectClubsDialogProps) {
  const foreground = useThemeColor("default-foreground");

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
          className="w-[95%] self-center bg-card"
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
          <View>
            <View className="mt-4 flex-row flex-wrap gap-y-10">
              {CLUBS.map((club) => (
                <ClubOption
                  key={club.id}
                  clubName={club.name}
                  clubImageSource={getClubLogo(club)}
                  isSelected={club.id === selectedClubId}
                  onSelect={() => {
                    onSelectClub(club.id);
                    onClose();
                  }}
                />
              ))}
            </View>
          </View>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
}

import { Dialog } from "heroui-native";
import { View } from "react-native";
import { CLUBS, ClubId, getClubLogo } from "./tournaments";
import ClubOption from "./ClubOption";

type SelectClubsDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  selectedClubIds: ClubId[];
  onToggleClub: (clubId: ClubId) => void;
};

export default function SelectClubsDialog({
  isOpen,
  onClose,
  selectedClubIds,
  onToggleClub,
}: SelectClubsDialogProps) {
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
            <Dialog.Title className="text-black w-full text-center">
              Clubes
            </Dialog.Title>
            <Dialog.Close
              iconProps={{ color: "black" }}
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
                  isSelected={selectedClubIds.includes(club.id)}
                  onToggle={() => onToggleClub(club.id)}
                />
              ))}
            </View>
          </View>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
}

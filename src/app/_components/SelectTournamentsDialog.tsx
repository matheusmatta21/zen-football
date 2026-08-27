import { Dialog } from "heroui-native";
import { View } from "react-native";
import TournamentOption from "./TournamentOption";
import { TOURNAMENTS, TournamentId } from "./tournaments";

type SelectTournamentDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  selectedTournamentIds: TournamentId[];
  onToggleTournament: (tournamentId: TournamentId) => void;
};

export default function SelectTournamentDialog({
  isOpen,
  onClose,
  selectedTournamentIds,
  onToggleTournament,
}: SelectTournamentDialogProps) {
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
              Competições
            </Dialog.Title>
            <Dialog.Close
              iconProps={{ color: "black" }}
              className="absolute right-0 top-0 bg-transparent"
            />
          </View>
          <View className="mt-4 flex-row flex-wrap gap-y-10">
            {TOURNAMENTS.map((tournament) => (
              <TournamentOption
                key={tournament.id}
                tournamentName={tournament.name}
                tournamentImageSource={tournament.imageSource}
                isSelected={selectedTournamentIds.includes(tournament.id)}
                onToggle={() => onToggleTournament(tournament.id)}
              />
            ))}
          </View>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
}

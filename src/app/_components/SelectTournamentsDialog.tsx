import { Dialog } from "heroui-native";
import { View } from "react-native";
import TournamentOption from "./TournamentOption";

type SelectTournamentDialogProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function SelectTournamentDialog({
  isOpen,
  onClose,
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
            <TournamentOption tournamentName="Premier League" tournamentImageSource={require("../../../assets/images/premier-league.png")} />
            <TournamentOption tournamentName="La Liga" tournamentImageSource={require("../../../assets/images/la-liga.png")} />
            <TournamentOption tournamentName="Brasileirão Serie A" tournamentImageSource={require("../../../assets/images/brasileirao-serie-a.png")} />
            <TournamentOption tournamentName="Bundesliga" tournamentImageSource={require("../../../assets/images/bundesliga.png")} />
            <TournamentOption tournamentName="Libertadores" tournamentImageSource={require("../../../assets/images/libertadores.webp")} />
            <TournamentOption tournamentName="Sulamericana" tournamentImageSource={require("../../../assets/images/sudamericana.png")} />
          </View>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
}

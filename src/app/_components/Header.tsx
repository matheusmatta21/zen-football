import { Trophy } from "lucide-react-native";
import { useState } from "react";
import { Image, Pressable, Text, View } from "react-native";
import SelectTournamentDialog from "./SelectTournamentsDialog";
import { ClubId, TournamentId } from "./tournaments";
import SelectClubsDialog from "./SelectClubsDialog";

type HeaderProps = {
  selectedTournamentIds: TournamentId[];
  onToggleTournament: (tournamentId: TournamentId) => void;
  selectedClubIds: ClubId[];
  onToggleClub: (clubId: ClubId) => void;
};

export default function Header({
  selectedTournamentIds,
  onToggleTournament,
  selectedClubIds,
  onToggleClub,
}: HeaderProps) {
  const [isTournamentModalOpen, setIsTournamentModalOpen] = useState(false);
  const [isClubsModalOpen, setIsClubsModalOpen] = useState(false);

  return (
    <View className="flex-col items-center justify-center bg-pitch pt-7.5 pb-2">
      <View className="mb-4 w-full flex-row items-center justify-center gap-10 bg-pitch">
        <View className="h-10 w-10 items-center justify-center">
          <Pressable onPress={() => setIsTournamentModalOpen(true)}>
            <Trophy width={28} height={28} strokeWidth={1.5} />
          </Pressable>
        </View>
        <View className="h-10 w-10 items-center justify-center">
          <Image
            source={require("../../../assets/images/logo-zen-football.png")}
            className="h-12.5 w-12.5 object-contain"
          />
        </View>
        <View className="h-10 w-10 items-center justify-center">
          <Pressable onPress={() => setIsClubsModalOpen(true)}>
          <Image
            source={require("../../../assets/images/bournemouth.png")}
            className="h-7 w-7 object-contain"
          />
          </Pressable>
        </View>
      </View>
      <Text className="font-semibold uppercase text-heading">
        Partidas Seguintes
      </Text>
      <SelectTournamentDialog
        isOpen={isTournamentModalOpen}
        onClose={() => setIsTournamentModalOpen(false)}
        selectedTournamentIds={selectedTournamentIds}
        onToggleTournament={onToggleTournament}
      />
      <SelectClubsDialog
        isOpen={isClubsModalOpen}
        onClose={() => setIsClubsModalOpen(false)}
        selectedClubIds={selectedClubIds}
        onToggleClub={onToggleClub}
      />
    </View>
  );
}

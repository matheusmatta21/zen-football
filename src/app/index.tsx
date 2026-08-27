import { useState } from "react";
import { ScrollView } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { withUniwind } from "uniwind";

import Header from "./_components/Header";
import MatchCard from "./_components/MatchCard";
import { TOURNAMENTS, TournamentId } from "./_components/tournaments";

const StyledSafeAreaView = withUniwind(SafeAreaView);

export default function Index() {
  const [selectedTournamentIds, setSelectedTournamentIds] = useState<
    TournamentId[]
  >(() => TOURNAMENTS.map((tournament) => tournament.id));

  const handleToggleTournament = (tournamentId: TournamentId) => {
    setSelectedTournamentIds((currentIds) =>
      currentIds.includes(tournamentId)
        ? currentIds.filter((id) => id !== tournamentId)
        : [...currentIds, tournamentId]
    );
  };

  return (
    <StyledSafeAreaView className="flex-1 bg-pitch">
      <Header
        selectedTournamentIds={selectedTournamentIds}
        onToggleTournament={handleToggleTournament}
      />
      <ScrollView
        className="flex-1"
        contentContainerClassName="grow w-full items-center gap-5 bg-pitch py-7.5"
      >
        <MatchCard status="live" />
        <MatchCard status="finished" />
        <MatchCard status="finished" />
        <MatchCard status="finished" />
      </ScrollView>
    </StyledSafeAreaView>
  );
}

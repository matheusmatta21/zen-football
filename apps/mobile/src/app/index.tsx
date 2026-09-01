import { useState } from "react";
import { ScrollView } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { withUniwind } from "uniwind";

import Header from "../components/Header";
import MatchCard from "../components/MatchCard";
import {
  CLUBS,
  ClubId,
  TOURNAMENTS,
  TournamentId,
} from "../components/tournaments";

const StyledSafeAreaView = withUniwind(SafeAreaView);

export default function Index() {
  const [selectedTournamentIds, setSelectedTournamentIds] = useState<
    TournamentId[]
  >(() => TOURNAMENTS.map((tournament) => tournament.id));
  const [selectedClubIds, setSelectedClubIds] = useState<ClubId[]>(() =>
    CLUBS.map((club) => club.id),
  );

  const handleToggleTournament = (tournamentId: TournamentId) => {
    setSelectedTournamentIds((currentIds) =>
      currentIds.includes(tournamentId)
        ? currentIds.filter((id) => id !== tournamentId)
        : [...currentIds, tournamentId],
    );
  };

  const handleToggleCLub = (clubId: ClubId) => {
    setSelectedClubIds((currentIds) =>
      currentIds.includes(clubId)
        ? currentIds.filter((id) => id !== clubId)
        : [...currentIds, clubId],
    );
  };

  return (
    <StyledSafeAreaView className="flex-1 bg-pitch">
      <Header
        selectedTournamentIds={selectedTournamentIds}
        onToggleTournament={handleToggleTournament}
        selectedClubIds={selectedClubIds}
        onToggleClub={handleToggleCLub}
      />
      <ScrollView
        className="flex-1"
        contentContainerClassName="grow w-full items-center gap-5 bg-pitch py-7.5"
      >
        <MatchCard status="live" />
        <MatchCard status="upcoming" />
        <MatchCard status="finished" />
        <MatchCard status="finished" />
      </ScrollView>
    </StyledSafeAreaView>
  );
}

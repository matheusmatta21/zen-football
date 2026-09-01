import type { Match } from "@zen/types";
import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, Text } from "react-native";

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
import { getTestMatches } from "../services/footballDataTest";

const StyledSafeAreaView = withUniwind(SafeAreaView);

export default function Index() {
  const [selectedTournamentIds, setSelectedTournamentIds] = useState<
    TournamentId[]
  >(() => TOURNAMENTS.map((tournament) => tournament.id));
  const [selectedClubIds, setSelectedClubIds] = useState<ClubId[]>(() =>
    CLUBS.map((club) => club.id),
  );

  const [matches, setMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    setIsLoading(true);
    setError(null);

    getTestMatches({ signal: controller.signal })
      .then(setMatches)
      .catch((cause) => {
        if (controller.signal.aborted) return;
        setError("Não foi possível carregar os jogos.");
        console.error(cause);
      })
      .finally(() => {
        if (controller.signal.aborted) return;
        setIsLoading(false);
      });

    return () => controller.abort();
  }, []);

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
        {isLoading && <ActivityIndicator size="large" color="#4e5c6f" />}

        {error && <Text className="text-sm font-medium text-clock">{error}</Text>}

        {!isLoading &&
          !error &&
          matches.map((match) => <MatchCard key={match.id} match={match} />)}
      </ScrollView>
    </StyledSafeAreaView>
  );
}

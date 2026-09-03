import type { FdCompetition, Match } from "@zen/types";
import { useEffect, useState } from "react";
import { ActivityIndicator, AppState, ScrollView, Text } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { withUniwind } from "uniwind";

import Header from "../components/Header";
import MatchCard from "../components/MatchCard";
import { CLUBS } from "../components/tournaments";
import { useSelectedClub } from "../contexts/SelectedClubContext";
import { getTeamCompetitions, getTeamMatches } from "../services/footballData";

const StyledSafeAreaView = withUniwind(SafeAreaView);

const TICK_INTERVAL_MS = 60_000;
const KICKOFF_LOOKAHEAD_MS = 5 * 60_000;

/** Só vale atualizar sozinho quando há jogo rolando ou prestes a começar. */
function hasMatchInProgress(matches: Match[], now: number) {
  return matches.some((match) => {
    if (match.status === "live") return true;
    if (match.status !== "upcoming" || match.note !== null) return false;

    return new Date(match.kickoffUtc).getTime() - now <= KICKOFF_LOOKAHEAD_MS;
  });
}

export default function Index() {
  const { selectedClubId, selectClub } = useSelectedClub();
  const [competitions, setCompetitions] = useState<FdCompetition[]>([]);
  const [selectedCompetitionIds, setSelectedCompetitionIds] = useState<
    number[]
  >([]);

  const [matches, setMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isAppActive, setIsAppActive] = useState(
    () => AppState.currentState === "active",
  );
  const [now, setNow] = useState(() => Date.now());

  const selectedClub =
    CLUBS.find((club) => club.id === selectedClubId) ?? CLUBS[0];
  const teamId = selectedClub.teamId;

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextState) => {
      setIsAppActive(nextState === "active");
    });

    return () => subscription.remove();
  }, []);

  useEffect(() => {
    if (!isAppActive) return;

    setNow(Date.now());

    const interval = setInterval(() => setNow(Date.now()), TICK_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [isAppActive]);

  useEffect(() => {
    const controller = new AbortController();

    setIsLoading(true);
    setError(null);

    getTeamMatches({ teamId, signal: controller.signal })
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
  }, [teamId]);

  const shouldPoll = isAppActive && hasMatchInProgress(matches, now);

  useEffect(() => {
    if (!shouldPoll) return;

    const controller = new AbortController();

    getTeamMatches({ teamId, signal: controller.signal })
      .then(setMatches)
      .catch((cause) => {
        if (controller.signal.aborted) return;
        console.error(cause);
      });

    return () => controller.abort();
  }, [shouldPoll, now, teamId]);

  useEffect(() => {
    const controller = new AbortController();

    getTeamCompetitions({ teamId, signal: controller.signal })
      .then((fetchedCompetitions) => {
        setCompetitions(fetchedCompetitions);
        setSelectedCompetitionIds(
          fetchedCompetitions.map((competition) => competition.id),
        );
      })
      .catch((cause) => {
        if (controller.signal.aborted) return;
        console.error(cause);
      });

    return () => controller.abort();
  }, [teamId]);

  const handleToggleCompetition = (competitionId: number) => {
    setSelectedCompetitionIds((currentIds) =>
      currentIds.includes(competitionId)
        ? currentIds.filter((id) => id !== competitionId)
        : [...currentIds, competitionId],
    );
  };

  const visibleMatches =
    competitions.length === 0
      ? matches
      : matches.filter((match) =>
          selectedCompetitionIds.includes(match.competition.id),
        );

  return (
    <StyledSafeAreaView className="flex-1 bg-pitch">
      <Header
        competitions={competitions}
        selectedCompetitionIds={selectedCompetitionIds}
        onToggleCompetition={handleToggleCompetition}
        selectedClub={selectedClub}
        onSelectClub={selectClub}
      />
      <ScrollView
        className="flex-1"
        contentContainerClassName="grow w-full items-center gap-5 bg-pitch py-7.5"
      >
        {isLoading && <ActivityIndicator size="large" color="#4e5c6f" />}

        {error && <Text className="text-sm font-medium text-clock">{error}</Text>}

        {!isLoading &&
          !error &&
          visibleMatches.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
      </ScrollView>
    </StyledSafeAreaView>
  );
}

import type { Club, FdCompetition, Match } from "@zen/types";
import { useThemeColor } from "heroui-native";
import { useEffect, useState } from "react";
import { ActivityIndicator, AppState, Text } from "react-native";

import CollapsibleHeaderLayout from "../components/CollapsibleHeaderLayout";
import Header from "../components/Header";
import MatchCard from "../components/MatchCard";
import { useSelectedClub } from "../contexts/SelectedClubContext";
import { getTeamCompetitions, getTeamMatches } from "../services/footballData";
import { selectMatches, type MatchListMode } from "../utils/selectMatches";

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
  const { selectedClub, selectClub } = useSelectedClub();
  return selectedClub ? (
    <ClubMatches key={selectedClub.id} selectedClub={selectedClub} selectClub={selectClub} />
  ) : null;
}

function ClubMatches({ selectedClub, selectClub }: {
  selectedClub: Club;
  selectClub: (club: Club) => void;
}) {
  const muted = useThemeColor("muted");
  const [competitions, setCompetitions] = useState<FdCompetition[]>([]);
  const [selectedCompetitionIds, setSelectedCompetitionIds] = useState<
    number[]
  >([]);

  const [matches, setMatches] = useState<Match[]>([]);
  const [matchListMode, setMatchListMode] = useState<MatchListMode>("upcoming");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isAppActive, setIsAppActive] = useState(
    () => AppState.currentState === "active",
  );
  const [now, setNow] = useState(() => Date.now());

  const teamId = selectedClub.id;

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

  const competitionMatches =
    competitions.length === 0
      ? matches
      : matches.filter((match) =>
          selectedCompetitionIds.includes(match.competition.id),
        );

  const visibleMatches = selectMatches(competitionMatches, matchListMode);

  return (
    <CollapsibleHeaderLayout
      header={
        <Header
          competitions={competitions}
          selectedCompetitionIds={selectedCompetitionIds}
          onToggleCompetition={handleToggleCompetition}
          selectedClub={selectedClub}
          onSelectClub={selectClub}
          matchListMode={matchListMode}
          onToggleMatchListMode={() =>
            setMatchListMode((current) =>
              current === "upcoming" ? "finished" : "upcoming",
            )
          }
        />
      }
    >
      {isLoading && <ActivityIndicator size="large" color={muted} />}

      {error && <Text className="text-sm font-medium text-clock">{error}</Text>}

      {!isLoading && !error && visibleMatches.length === 0 && (
        <Text className="text-sm font-medium text-clock p-5 text-center">
          Nenhuma partida {matchListMode === "upcoming" ? "seguinte" : "passada"}{" "}
          para os filtros selecionados.
        </Text>
      )}

      {!isLoading &&
        !error &&
        visibleMatches.map((match) => (
          <MatchCard key={match.id} match={match} now={now} />
        ))}
    </CollapsibleHeaderLayout>
  );
}

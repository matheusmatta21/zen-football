import type { Match, MatchTeam } from "@zen/types";
import { ImageSourcePropType, View } from "react-native";
import Scoreboard from "./Scoreboard";
import TeamView from "./TeamView";

type MatchViewProps = {
  match: Match;
};

function crestSource(team: MatchTeam): ImageSourcePropType | null {
  return team.crestUrl ? { uri: team.crestUrl } : null;
}

export default function MatchView({ match }: MatchViewProps) {
  return (
    <View className="mt-4 w-full flex-row items-center justify-between">
      <TeamView
        teamName={
          match.homeTeam.shortName ?? match.homeTeam.name ?? "A definir"
        }
        teamImage={crestSource(match.homeTeam)}
        status={match.status}
      />
      <Scoreboard match={match} />

      <TeamView
        teamName={
          match.awayTeam.shortName ?? match.awayTeam.name ?? "A definir"
        }
        teamImage={crestSource(match.awayTeam)}
        status={match.status}
      />
    </View>
  );
}

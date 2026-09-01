import { View } from "react-native";
import Scoreboard from "./Scoreboard";
import TeamView from "./TeamView";

type MatchViewProps = {
  status: "live" | "finished" | "upcoming"
};



export default function MatchView({ status }: MatchViewProps) {
  return (
    <View className="mt-4 w-full flex-row items-center justify-between">
      <TeamView
        teamName="Bournemouth"
        teamImage={require("../../../assets/images/bournemouth.png")}
        status={status}
      />
      <Scoreboard status={status}/>

      <TeamView
        teamName="Chelsea"
        teamImage={require("../../../assets/images/chelsea.webp")}
        status={status}
      />
    </View>
  );
}

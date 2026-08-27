import { Image, Text, View } from "react-native";

type HeaderCardProps = {
  status: "live" | "finished";
};

export default function HeaderCard( {status}: HeaderCardProps) {
  return (
    <View className="relative mb-4 items-center justify-center">
      <Text className="absolute left-0">18/08</Text>
      <View className="flex-row items-center gap-1">
        <Image
          source={require("../../../assets/images/premier-league.png")}
          className="h-4.5 w-4.5"
        />
        <Text>Premier League</Text>
      </View>
      {status === "live" && <Text className="absolute right-0 font-medium text-slate-800">AGORA</Text>}
    </View>
  );
}

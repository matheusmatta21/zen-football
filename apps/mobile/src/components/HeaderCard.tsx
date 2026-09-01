import { Image, Text, View } from "react-native";

type HeaderCardProps = {
  status: "live" | "finished" | "upcoming";
};

const fontVariants = {
  live: "text-sm font-bold text-clock",
  finished: "text-xs font-medium text-clock",
  upcoming: "text-xs font-medium text-clock",
};

const imageSizeVariants = {
  live: "h-4.5 w-4.5",
  finished: "h-3.5 w-3.5",
  upcoming: "h-3.5 w-3.5",
};

export default function HeaderCard({ status }: HeaderCardProps) {
  return (
    <View className="relative mb-4 items-center justify-center">
      <Text className={`absolute left-0 ${fontVariants[status]}`}>18/08</Text>
      <View className="flex-row items-center gap-1">
        <Image
          source={require("../../assets/images/premier-league.png")}
          className={imageSizeVariants[status]}
        />
        <Text className={fontVariants[status]}>Premier League</Text>
      </View>
      {status === "live" && (
        <Text className="absolute right-0 font-medium text-slate-800">
          AGORA
        </Text>
      )}
    </View>
  );
}

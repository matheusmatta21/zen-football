import type { Match } from "@zen/types";
import { Image, Text, View } from "react-native";

type HeaderCardProps = {
  match: Match;
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

function formatKickoffDate(kickoffUtc: string): string {
  const date = new Date(kickoffUtc);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${day}/${month}`;
}

export default function HeaderCard({ match }: HeaderCardProps) {
  const { status, competition } = match;

  return (
    <View className="relative mb-4 items-center justify-center">
      <Text className={`absolute left-0 ${fontVariants[status]}`}>
        {formatKickoffDate(match.kickoffUtc)}
      </Text>
      <View className="flex-row items-center gap-1">
        {competition.emblemUrl && (
          <Image
            source={{ uri: competition.emblemUrl }}
            className={imageSizeVariants[status]}
          />
        )}
        <Text className={fontVariants[status]}>{competition.name}</Text>
      </View>
      {status === "live" && (
        <Text className="absolute right-0 font-medium text-slate-800">
          AGORA
        </Text>
      )}
    </View>
  );
}

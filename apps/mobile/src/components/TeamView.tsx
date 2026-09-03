import type { MatchStatus } from "@zen/types";
import { Image, ImageSourcePropType, Text, View } from "react-native";

type TeamViewProps = {
  teamName: string;
  teamImage: ImageSourcePropType | null;
  status: MatchStatus;
};

const sizeVariants = {
  live: "h-15.75 w-15.75",
  finished: "h-12 w-12",
  upcoming: "h-12 w-12",
};

const fontVariants = {
  live: "text-base font-bold",
  finished: "text-sm font-bold",
  upcoming: "text-sm font-bold",
};

export default function TeamView({ teamName, teamImage, status }: TeamViewProps) {
  return (
    <View className="w-[30%] flex-col items-center gap-2">
      <View
        className={`${sizeVariants[status]} shrink-0 items-center justify-center`}
      >
        {teamImage ? (
          <Image
            source={teamImage}
            className="h-full w-full"
            resizeMode="contain"
          />
        ) : (
          <View className="h-full w-full" />
        )}
      </View>
      <Text
        className={`h-10 w-full text-center ${fontVariants[status]}`}
        numberOfLines={2}
      >
        {teamName}
      </Text>
    </View>
  );
}

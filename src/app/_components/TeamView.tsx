import { Image, ImageSourcePropType, Text, View } from "react-native";

type TeamViewProps = {
  teamName: string;
  teamImage: ImageSourcePropType;
  status: "live" | "finished" | "upcoming";
};

const sizeVariants = {
  live: "h-15.75 w-15.75",
  finished: "h-12 w-12",
  upcoming: "h-12 w-12",
}

const fontVariants = {
  live: "text-base font-bold",
  finished: "text-sm font-bold",
  upcoming: "text-sm font-bold",
}

export default function TeamView(props: TeamViewProps) {
  return (
    <View className="flex-col items-center justify-center gap-2">
      <Image
        source={props.teamImage}
        className={sizeVariants[props.status]}
        resizeMode="contain"
      />
      <Text className={fontVariants[props.status]}>{props.teamName}</Text>
    </View>
  );
}

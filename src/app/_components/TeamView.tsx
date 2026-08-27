import { Image, ImageSourcePropType, Text, View } from "react-native";

type TeamViewProps = {
  teamName: string;
  teamImage: ImageSourcePropType;
};

export function TeamView(props: TeamViewProps) {
  return (
    <View className="flex-col items-center justify-center gap-2">
      <Image
        source={props.teamImage}
        className="h-[63px] w-[63px]"
        resizeMode="contain"
      />
      <Text className="text-base font-bold">{props.teamName}</Text>
    </View>
  );
}

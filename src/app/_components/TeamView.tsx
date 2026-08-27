import { Image, ImageSourcePropType, Text, View } from "react-native";

type TeamViewProps = {
  teamName: string;
  teamImage: ImageSourcePropType;
};

export default function TeamView(props: TeamViewProps) {
  return (
    <View className="flex-col items-center justify-center gap-2">
      <Image
        source={props.teamImage}
        className="h-15.75 w-15.75"
        resizeMode="contain"
      />
      <Text className="text-base font-bold">{props.teamName}</Text>
    </View>
  );
}

import { Trophy } from "lucide-react-native";
import { Image, Text, View } from "react-native";

export function Header() {
  return (
    <View className="flex-col items-center justify-center bg-pitch pt-7.5 pb-7.5">
      <View className="mb-4 w-full flex-row items-center justify-center gap-10 bg-pitch">
        <View className="h-10 w-10 items-center justify-center">
          <Trophy />
        </View>
        <View className="h-10 w-10 items-center justify-center">
          <Image
            source={require("../../../assets/images/logo-zen-football.png")}
            className="h-12.5 w-12.5 object-contain"
          />
        </View>
        <View className="h-10 w-10 items-center justify-center">
          <Image
            source={require("../../../assets/images/bournemouth.png")}
            className="h-5 w-5 object-contain"
          />
        </View>
      </View>
      <Text className="font-semibold uppercase text-heading">
        Partidas Seguintes
      </Text>
    </View>
  );
}

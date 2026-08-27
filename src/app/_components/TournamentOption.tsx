import { Check } from "lucide-react-native";
import { useState } from "react";
import { Image, Pressable, Text, View } from "react-native";

type TournamentOptionProps = {
  tournamentName: string;
  tournamentImageSource: any;
};

export default function TournamentOption({
  tournamentName,
  tournamentImageSource,
}: TournamentOptionProps) {
  const [isSelected, setIsSelected] = useState(false);

  return (
    <View className="w-1/3 flex-col items-center px-1">
      <Pressable
        className="w-full items-center"
        onPress={() => setIsSelected((wasSelected) => !wasSelected)}
      >
        <View
          data-active={isSelected}
          className="relative aspect-square w-full items-center justify-center rounded-lg border-2 border-transparent bg-[#b5b5a5] p-2 data-active:border-border data-active:bg-[#b1b1a1]"
        >
          <Image
            source={tournamentImageSource}
            className="h-11 w-11 object-contain"
          />
          {isSelected && (
            <View className="absolute right-1 top-1">
              <Check width={14} height={14} strokeWidth={2.5} color="#404034" />
            </View>
          )}
        </View>
        <View className="mt-2 w-full">
          <Text className="text-center">{tournamentName}</Text>
        </View>
      </Pressable>
    </View>
  );
}

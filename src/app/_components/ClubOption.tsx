import { Check } from "lucide-react-native";
import { Image, ImageSourcePropType, Pressable, Text, View } from "react-native";

type ClubOptionProps = {
  clubName: string;
  clubImageSource: ImageSourcePropType;
  isSelected: boolean;
  onToggle: () => void;
};

export default function ClubOption({
  clubName,
  clubImageSource,
  isSelected,
  onToggle,
}: ClubOptionProps) {
  return (
    <View className="w-1/3 flex-col items-center px-1">
      <Pressable
        className="w-full items-center"
        accessibilityRole="checkbox"
        accessibilityState={{ checked: isSelected }}
        accessibilityLabel={clubName}
        onPress={onToggle}
      >
        <View
          data-active={isSelected}
          className="relative aspect-square w-full items-center justify-center rounded-lg border-2 border-transparent bg-[#b5b5a5] p-2 data-active:border-border data-active:bg-[#b1b1a1]"
        >
          <Image
            source={clubImageSource}
            className="h-11 w-11 object-contain"
          />
          {isSelected && (
            <View className="absolute right-1 top-1">
              <Check width={14} height={14} strokeWidth={2.5} color="#404034" />
            </View>
          )}
        </View>
        <View className="mt-2 w-full">
          <Text className="text-center">{clubName}</Text>
        </View>
      </Pressable>
    </View>
  );
}

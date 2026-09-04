import { useThemeColor } from "heroui-native";
import { Check } from "lucide-react-native";
import { Image, ImageSourcePropType, Pressable, Text, View } from "react-native";

type ClubOptionProps = {
  clubName: string;
  clubImageSource: ImageSourcePropType | null;
  isSelected: boolean;
  onSelect: () => void;
};

export default function ClubOption({
  clubName,
  clubImageSource,
  isSelected,
  onSelect,
}: ClubOptionProps) {
  const foreground = useThemeColor("default-foreground");

  return (
    <View className="w-1/3 flex-col items-center px-1">
      <Pressable
        className="w-full items-center"
        accessibilityRole="radio"
        accessibilityState={{ selected: isSelected }}
        accessibilityLabel={clubName}
        onPress={onSelect}
      >
        <View
          data-active={isSelected}
          className="relative aspect-square w-full items-center justify-center rounded-lg border-2 border-transparent bg-option p-2 data-active:border-border data-active:bg-option-selected"
        >
          {clubImageSource ? (
            <Image
              source={clubImageSource}
              className="h-11 w-11 object-contain"
            />
          ) : (
            <View className="h-11 w-11" />
          )}
          {isSelected && (
            <View className="absolute right-1 top-1">
              <Check
                width={14}
                height={14}
                strokeWidth={2.5}
                color={foreground}
              />
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

import { useThemeColor } from "heroui-native";
import { Check } from "lucide-react-native";
import { ImageSourcePropType, Pressable, Text, View } from "react-native";
import CrestImage from "./CrestImage";

type ClubOptionProps = {
  clubName: string;
  clubImageSource: ImageSourcePropType | null;
  isSelected: boolean;
  onSelect: () => void;
  columns?: 3 | 4;
};

export default function ClubOption({
  clubName,
  clubImageSource,
  isSelected,
  onSelect,
  columns = 3,
}: ClubOptionProps) {
  const foreground = useThemeColor("default-foreground");

  return (
    <View className={`${columns === 4 ? "w-1/4" : "w-1/3"} flex-col items-center px-1.5`}>
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
          <CrestImage source={clubImageSource} size={40} name={clubName} />
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
          <Text numberOfLines={2} className="text-center text-xs font-semibold text-ink">{clubName}</Text>
        </View>
      </Pressable>
    </View>
  );
}

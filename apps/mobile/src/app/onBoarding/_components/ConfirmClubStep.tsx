import { Text, View, Image } from "react-native";
import { Button, useThemeColor } from "heroui-native";
import { Check, ChevronLeft } from "lucide-react-native";

import { Club, getClubLogo } from "@/components/tournaments";

type ConfirmClubStepProps = {
  club: Club;
  onConfirm: () => void;
  onBack: () => void;
};

export default function ConfirmClubStep({
  club,
  onConfirm,
  onBack,
}: ConfirmClubStepProps) {
  const clubLogo = getClubLogo(club);
  const primaryForeground = useThemeColor("accent-foreground");
  const outlineForeground = useThemeColor("default-foreground");

  return (
    <View className="w-full flex flex-col items-center justify-center gap-4 px-8">
      <View className="flex flex-col items-center justify-center gap-4">
        <Image
          source={
            clubLogo ?? require("../../../../assets/images/logo-zen-football.png")
          }
          className="w-32 h-32 object-contain"
        />
        <Text className="text-title text-center text-ink">
          {club.name}
        </Text>
        <Text className="text-body text-center text-heading">
          Tem certeza que esse é o clube escolhido?
        </Text>
      </View>
      <View className="mt-2 w-full flex flex-col items-stretch gap-2">
        <Button variant="primary" className="w-full" onPress={onConfirm}>
          <Check
            width={18}
            height={18}
            strokeWidth={2.5}
            color={primaryForeground}
          />
          <Button.Label>Continuar</Button.Label>
        </Button>
        <Button variant="outline" className="w-full" onPress={onBack}>
          <ChevronLeft
            width={18}
            height={18}
            strokeWidth={2.5}
            color={outlineForeground}
          />
          <Button.Label>Voltar</Button.Label>
        </Button>
      </View>
    </View>
  );
}

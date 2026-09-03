import { Text, View, Image } from "react-native";
import { Button } from "heroui-native";
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

  return (
    <View className="w-full flex flex-col items-center justify-center gap-4 px-8">
      <View className="flex flex-col items-center justify-center gap-4">
        <Image
          source={
            clubLogo ?? require("../../../../assets/images/logo-zen-football.png")
          }
          className="w-32 h-32 object-contain"
        />
        <Text className="text-3xl font-extrabold text-black text-center">
          {club.name}
        </Text>
        <Text className="text-base text-muted-foreground text-center">
          Tem certeza que esse é o clube escolhido?
        </Text>
      </View>
      <View className="mt-2 w-full flex flex-col items-stretch gap-2">
        <Button variant="primary" className="w-full" onPress={onConfirm}>
          <Button.Background className="bg-black" />
          <Check width={18} height={18} strokeWidth={2.5} color="#ffffff" />
          <Button.Label className="text-center">Continuar</Button.Label>
        </Button>
        <Button variant="outline" className="w-full" onPress={onBack}>
          <ChevronLeft
            width={18}
            height={18}
            strokeWidth={2.5}
            color="#24241a"
          />
          <Button.Label className="text-center text-[#24241a]">
            Voltar
          </Button.Label>
        </Button>
      </View>
    </View>
  );
}

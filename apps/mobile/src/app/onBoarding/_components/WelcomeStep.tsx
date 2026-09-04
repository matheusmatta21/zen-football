import { View, Image, Text } from "react-native";
import { Button } from "heroui-native";

type WelcomeStepProps = {
  onNext: () => void;
};

export default function WelcomeStep({ onNext }: WelcomeStepProps) {
  return (
    <View className="flex flex-col items-center justify-center gap-4 px-8">
      <View>
        <Image
          source={require("../../../../assets/images/logo-zen-football.png")}
          className="w-32 h-32"
        />
      </View>
      <View className="flex flex-col items-center justify-center gap-4">
        <Text className="text-title text-center text-ink">
          Bem Vindo ao Zen Football
        </Text>
        <Text className="text-body text-center text-heading">
          A proposta do app é exibir partidas de futebol de maneira minimalista
          e simples, para que você acompanhe o que realmente importa sem
          distrações.
        </Text>
      </View>
      <Button
        variant="primary"
        className="mt-4 px-8"
        onPress={onNext}
      >
        <Button.Label>Começar</Button.Label>
      </Button>
    </View>
  );
}

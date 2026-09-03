import { View, Image, Text } from "react-native";
import { Button } from "heroui-native";

export default function WelcomeStep() {
    return (
              <View className="flex flex-col items-center justify-center gap-4 px-8">
        <View>
          <Image
            source={require("../../../../assets/images/logo-zen-football.png")}
            className="w-32 h-32"
          />
        </View>
        <View className="flex flex-col items-center justify-center gap-4">
          <Text className="text-3xl font-extrabold text-black text-center">
            Bem Vindo ao Zen {'\n'}Football
          </Text>
          <Text className="text-base text-muted-foreground text-center">
            A proposta do app é exibir partidas de futebol de maneira
            minimalista e simples, para que você acompanhe o que
            realmente importa sem distrações.
          </Text>
        </View>
        <Button variant="primary" className="mt-4 px-8 bg-black">Começar</Button>
      </View>
    )
}
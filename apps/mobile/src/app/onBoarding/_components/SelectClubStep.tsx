import { ScrollView, Text, View } from "react-native";
import { Button } from "heroui-native";

import LeagueClubsAccordion from "@/components/LeagueClubsAccordion";
import type { Club } from "@zen/types";

type SelectClubStepProps = {
  selectedClub: Club | null;
  onSelectClub: (club: Club) => void;
  onNext: () => void;
};

export default function SelectClubStep({
  selectedClub,
  onSelectClub,
  onNext,
}: SelectClubStepProps) {
  return (
    <View className="h-full w-full flex-col items-center gap-4 px-6 py-6">
      <View className="flex flex-col items-center justify-center gap-4">
        <Text className="text-title text-center text-ink">
          Selecione seu clube
        </Text>
        <Text className="text-body text-center text-heading">
          Escolha a liga e depois o clube que você deseja acompanhar as partidas.
        </Text>
      </View>
      <ScrollView className="w-full flex-1" showsVerticalScrollIndicator={false}>
        <LeagueClubsAccordion selectedClub={selectedClub} onSelectClub={onSelectClub} />
      </ScrollView>
      <Button
        variant="primary"
        className="mt-2 px-8"
        isDisabled={selectedClub === null}
        onPress={onNext}
      >
        <Button.Label>Continuar</Button.Label>
      </Button>
    </View>
  );
}

import { Text, View } from "react-native";
import { Button } from "heroui-native";

import ClubOption from "@/components/ClubOption";
import { CLUBS, ClubId, getClubLogo } from "@/components/tournaments";

type SelectClubStepProps = {
  selectedClubId: ClubId | null;
  onSelectClub: (clubId: ClubId) => void;
  onNext: () => void;
};

export default function SelectClubStep({
  selectedClubId,
  onSelectClub,
  onNext,
}: SelectClubStepProps) {
  return (
    <View className="flex flex-col items-center justify-center gap-4 px-8">
      <View className="flex flex-col items-center justify-center gap-4">
        <Text className="text-3xl font-extrabold text-black text-center">
          Selecione seu clube
        </Text>
        <Text className="text-base text-muted-foreground text-center">
          Escolha o clube que você deseja acompanhar as partidas.
        </Text>
      </View>
      <View>
        <View className="mt-4 flex-row flex-wrap gap-y-8">
          {CLUBS.map((club) => (
            <ClubOption
              key={club.id}
              clubName={club.name}
              clubImageSource={getClubLogo(club)}
              isSelected={club.id === selectedClubId}
              onSelect={() => onSelectClub(club.id)}
            />
          ))}
        </View>
      </View>
      <Button
        variant="primary"
        className="mt-2 px-8 bg-black"
        isDisabled={selectedClubId === null}
        onPress={onNext}
      >
        Continuar
      </Button>
    </View>
  );
}

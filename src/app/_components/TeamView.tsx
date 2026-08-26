import { View, Image, Text } from "react-native";

type TeamViewProps = {
  teamName: string;
  teamImage: any;
};

export function TeamView(props: TeamViewProps) {
  return (
    <View style={styles.teamView}>
      <Image
        source={props.teamImage}
        style={styles.logoMatchCard}
        resizeMode="contain"
      />
      <Text style={styles.teamViewName}>{props.teamName}</Text>
    </View>
  );
}
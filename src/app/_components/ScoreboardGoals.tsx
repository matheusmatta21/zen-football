import { View, Text } from "react-native";

export function ScoreboardGoals() {
  return (
    <View style={styles.scoreboardGoals}>
      <Text style={styles.scoreboardNumberGoals}>2</Text>
      <Text>x</Text>
      <Text style={styles.scoreboardNumberGoals}>2</Text>
    </View>
  );
}
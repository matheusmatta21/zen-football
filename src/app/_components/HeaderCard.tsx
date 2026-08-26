import { Image, Text, View } from "react-native";

export function HeaderCard() {
  return (
    <View style={styles.headerCard}>
      <Text style={styles.dateCardHeader}>18/08</Text>
      <View style={styles.tournamentViewCardHeader}>
        <Image
          source={require("../../../assets/images/premier-league.png")}
          style={styles.logoCardHeader}
        />
        <Text>Premier League</Text>
      </View>
    </View>
  );
}

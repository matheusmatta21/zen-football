import { Trophy } from "lucide-react-native";
import { View, Image, Text } from "react-native";

export function Header() {
  return (
    <View style={styles.headerWrapper}>
      <View style={styles.headerContainer}>
        <View style={styles.headerSlot}>
          <Trophy />
        </View>
        <View style={styles.headerSlot}>
          <Image
            source={require("../../../assets/images/logo-zen-football.png")}
            style={styles.logoZenHeader}
          />
        </View>
        <View style={styles.headerSlot}>
          <Image
            source={require("../../../assets/images/bournemouth.png")}
            style={styles.logoHeader}
          />
        </View>
      </View>
      <Text style={styles.followingMatchesText}>Partidas Seguintes</Text>
    </View>
  );
}

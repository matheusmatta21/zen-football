import {
  Animated,
  Image,
  ImageSourcePropType,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useRef } from "react";

import { Trophy } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type TeamViewProps = {
  teamName: string;
  teamImage: ImageSourcePropType;
};

export default function Index() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <Header />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.container}
      >
        <MatchCard />
        <MatchCard />
        <MatchCard />
        <MatchCard />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#a6a695",
  },
  scrollView: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    width: "100%",
    alignItems: "center",
    backgroundColor: "#a6a695",
    paddingTop: 30,
    paddingBottom: 30,
    gap: 20,
  },
  headerWrapper: {
    backgroundColor: "#a6a695",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  headerContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    marginBottom: 16,
    backgroundColor: "#a6a695",
  },
  headerSlot: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  logoHeader: {
    width: 40,
    height: 40,
    objectFit: "contain",
  },
  followingMatchesText: {
    color: "#404034",
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  card: {
    width: "100%",
    backgroundColor: "#b9b9a9",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "#b4b4a5",
  },
  cardPressable: {
    width: "90%",
  },
  headerCard: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  dateCardHeader: {
    position: "absolute",
    left: 0,
  },
  tournamentViewCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  logoCardHeader: {
    width: 18,
    height: 18,
  },
  logoMatchCard: {
    width: 63,
    height: 63,
  },
  matchCard: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
  },
  teamView: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  teamViewName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  scoreboardContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 63,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  scoreboardGoals: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  scoreboardNumberGoals: {
    fontSize: 32,
    fontWeight: "bold",
  },
  scoreboardTime: {
    padding: 4,
  },
  scoreboardTimeText: {
    color: "#5a6777",
    fontWeight: "600",
  },
});

function Header() {
  return (
    <View style={styles.headerWrapper}>
      <View style={styles.headerContainer}>
        <View style={styles.headerSlot}>
          <Trophy />
        </View>
        <View style={styles.headerSlot}>
          <Image
            source={require("../../assets/images/logo-zen-football.png")}
            style={styles.logoHeader}
          />
        </View>
        <View style={styles.headerSlot}>
          <Image
            source={require("../../assets/images/bournemouth.png")}
            style={styles.logoHeader}
          />
        </View>
      </View>
      <Text style={styles.followingMatchesText}>Partidas Seguintes</Text>
    </View>
  );
}

function MatchCard() {
  const scaleValue = useRef(new Animated.Value(1)).current; //escala 1 (100%)

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      delay: 50,
      toValue: 1.02,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Pressable
      style={styles.cardPressable}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View
        style={[styles.card, { transform: [{ scale: scaleValue }] }]}
      >
        <HeaderCard />
        <MatchView />
      </Animated.View>
    </Pressable>
  );
}

function HeaderCard() {
  return (
    <View style={styles.headerCard}>
      <Text style={styles.dateCardHeader}>18/08</Text>
      <View style={styles.tournamentViewCardHeader}>
        <Image
          source={require("../../assets/images/premier-league.png")}
          style={styles.logoCardHeader}
        />
        <Text>Premier League</Text>
      </View>
    </View>
  );
}

function MatchView() {
  return (
    <View style={styles.matchCard}>
      <TeamView
        teamName="Bournemouth"
        teamImage={require("../../assets/images/bournemouth.png")}
      />
      <Scoreboard />

      <TeamView
        teamName="Chelsea"
        teamImage={require("../../assets/images/chelsea.webp")}
      />
    </View>
  );
}

function TeamView(props: TeamViewProps) {
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

function Scoreboard() {
  return (
    <View style={styles.scoreboardContainer}>
      <ScoreboardGoals />
      <ScoreboardTime />
    </View>
  );
}

function ScoreboardGoals() {
  return (
    <View style={styles.scoreboardGoals}>
      <Text style={styles.scoreboardNumberGoals}>2</Text>
      <Text>x</Text>
      <Text style={styles.scoreboardNumberGoals}>2</Text>
    </View>
  );
}

function ScoreboardTime() {
  return (
    <View style={styles.scoreboardTime}>
      <Text style={styles.scoreboardTimeText}>56'</Text>
    </View>
  );
}

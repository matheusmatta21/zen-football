import type { Match } from "@zen/types";
import { useRef } from "react";
import { Animated, Pressable } from "react-native";
import HeaderCard from "./HeaderCard";
import MatchView from "./MatchView";

type MatchCardProps = {
  match: Match;
};

const colorVariants = {
  finished: "w-full rounded-[20px] border border-card-border bg-card p-5",
  live: "w-full rounded-[20px] border-2 border-[#536173] bg-stone-400 p-5",
  upcoming: "w-full rounded-[20px] border border-card-border bg-card p-5",
};

export default function MatchCard({ match }: MatchCardProps) {
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
      className="w-[90%]"
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View
        className={colorVariants[match.status]}
        style={{ transform: [{ scale: scaleValue }] }}
      >
        <HeaderCard match={match} />
        <MatchView match={match} />
      </Animated.View>
    </Pressable>
  );
}

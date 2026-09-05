import type { Match } from "@zen/types";
import { useRef } from "react";
import { Animated, Pressable } from "react-native";
import { getMatchCardStatus } from "../utils/getMatchCardStatus";
import HeaderCard from "./HeaderCard";
import MatchView from "./MatchView";

type MatchCardProps = {
  match: Match;
  now: number;
};

const colorVariants = {
  finished: "w-full rounded-[20px] border border-card-border bg-card p-5",
  live: "w-full rounded-[20px] border-2 border-live-border bg-live-surface p-5",
  finishedToday: "w-full rounded-[20px] border-2 border-live-border bg-live-surface p-5",
  paused: "w-full rounded-[20px] border-2 border-live-border bg-live-surface p-5",
  upcoming: "w-full rounded-[20px] border border-card-border bg-card p-5",
};

export default function MatchCard({ match, now }: MatchCardProps) {
  const cardMatch = { ...match, status: getMatchCardStatus(match, now) };
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
        className={colorVariants[cardMatch.status]}
        style={{ transform: [{ scale: scaleValue }] }}
      >
        <HeaderCard match={cardMatch} />
        <MatchView match={cardMatch} />
      </Animated.View>
    </Pressable>
  );
}

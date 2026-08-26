import { useRef } from "react";
import { Animated, Pressable } from "react-native";
import { HeaderCard } from "./HeaderCard";
import { MatchView } from "./MatchView";

export function MatchCard() {
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
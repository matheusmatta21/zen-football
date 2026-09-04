import type { Match } from "@zen/types";
import { useThemeColor } from "heroui-native";
import { Loader2 } from "lucide-react-native";
import { useEffect, useRef } from "react";
import { Animated, Text, View } from "react-native";

type ScoreboardTimeProps = {
  match: Match;
};

const fontVariants = {
  live: "text-sm font-bold text-clock",
  finished: "text-xs font-bold text-clock",
  upcoming: "text-xs font-bold text-clock",
};

export default function ScoreboardTime({ match }: ScoreboardTimeProps) {
  const { status } = match;
  const muted = useThemeColor("muted");
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (status !== "live") return;

    const animation = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 900,
        useNativeDriver: true,
      }),
    );

    animation.start();

    return () => animation.stop();
  }, [spinValue, status]);

  const rotate = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View className="items-center">
      {status === "live" && (
        <>
          <Text className={fontVariants[status]}>
            {match.minute !== null ? `${match.minute}'` : "AO VIVO"}
          </Text>
          <Animated.View style={{ transform: [{ rotate }] }}>
            <Loader2 size={14} color={muted} />
          </Animated.View>
        </>
      )}
      {status === "finished" && (
        <Text className={fontVariants[status]}>FT</Text>
      )}
    </View>
  );
}

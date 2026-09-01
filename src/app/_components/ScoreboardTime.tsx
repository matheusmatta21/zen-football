import { Loader2 } from "lucide-react-native";
import { useEffect, useRef } from "react";
import { Animated, Text, View } from "react-native";

type ScoreboardTimeProps = {
  status: "live" | "finished" | "upcoming";
};

const fontVariants = {
  live: "text-sm font-bold text-clock",
  finished: "text-xs font-bold text-clock",
  upcoming: "text-xs font-bold text-clock",
};

export default function ScoreboardTime({ status }: ScoreboardTimeProps) {
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
    <View className="items-center p-1">
      {status === "live" && (
        <>
          <Text className={fontVariants[status]}>56'</Text>
          <Animated.View style={{ transform: [{ rotate }] }} className="mt-0.5">
            <Loader2 size={20} color={"#4e5c6f"} />
          </Animated.View>
        </>
      )}
      {status === "finished" && (
        <Text className={fontVariants[status]}>FT</Text>
      )}
    </View>
  );
}

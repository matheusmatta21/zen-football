import {
  type PropsWithChildren,
  type ReactNode,
  useCallback,
  useRef,
  useState,
} from "react";
import {
  Animated,
  type LayoutChangeEvent,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { withUniwind } from "uniwind";

const StyledSafeAreaView = withUniwind(SafeAreaView);

const HEADER_SCROLL_THRESHOLD = 8;
const SCROLLED_HEADER_OPACITY = 0.78;

type HeaderMode = "top" | "visible" | "hidden";

type CollapsibleHeaderLayoutProps = PropsWithChildren<{
  header: ReactNode;
}>;

export default function CollapsibleHeaderLayout({
  children,
  header,
}: CollapsibleHeaderLayoutProps) {
  const headerTranslateY = useRef(new Animated.Value(0)).current;
  const headerOpacity = useRef(new Animated.Value(1)).current;
  const headerMode = useRef<HeaderMode>("top");
  const lastScrollY = useRef(0);
  const scrollDistanceInDirection = useRef(0);
  const lastScrollDirection = useRef<"up" | "down" | null>(null);
  const [headerHeight, setHeaderHeight] = useState(0);

  const animateHeader = useCallback(
    (mode: HeaderMode) => {
      if (headerMode.current === mode) return;

      headerMode.current = mode;
      Animated.parallel([
        Animated.timing(headerTranslateY, {
          toValue: mode === "hidden" ? -headerHeight : 0,
          duration: mode === "hidden" ? 180 : 220,
          useNativeDriver: true,
        }),
        Animated.timing(headerOpacity, {
          toValue:
            mode === "hidden"
              ? 0
              : mode === "visible"
                ? SCROLLED_HEADER_OPACITY
                : 1,
          duration: 180,
          useNativeDriver: true,
        }),
      ]).start();
    },
    [headerHeight, headerOpacity, headerTranslateY],
  );

  const handleHeaderLayout = useCallback(
    (event: LayoutChangeEvent) => {
      const nextHeight = event.nativeEvent.layout.height;
      setHeaderHeight(nextHeight);

      if (headerMode.current === "hidden") {
        headerTranslateY.setValue(-nextHeight);
      }
    },
    [headerTranslateY],
  );

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const scrollY = Math.max(0, event.nativeEvent.contentOffset.y);
      const delta = scrollY - lastScrollY.current;

      if (scrollY <= 0) {
        animateHeader("top");
        scrollDistanceInDirection.current = 0;
        lastScrollDirection.current = null;
        lastScrollY.current = scrollY;
        return;
      }

      if (delta === 0) return;

      const direction = delta > 0 ? "down" : "up";
      if (lastScrollDirection.current !== direction) {
        lastScrollDirection.current = direction;
        scrollDistanceInDirection.current = 0;
      }

      scrollDistanceInDirection.current += Math.abs(delta);
      lastScrollY.current = scrollY;

      if (scrollDistanceInDirection.current < HEADER_SCROLL_THRESHOLD) return;

      animateHeader(direction === "down" ? "hidden" : "visible");
      scrollDistanceInDirection.current = 0;
    },
    [animateHeader],
  );

  return (
    <StyledSafeAreaView className="flex-1 bg-pitch">
      <View className="flex-1">
        <Animated.View
          onLayout={handleHeaderLayout}
          style={{
            left: 0,
            opacity: headerOpacity,
            position: "absolute",
            right: 0,
            top: 0,
            transform: [{ translateY: headerTranslateY }],
            zIndex: 1,
          }}
        >
          {header}
        </Animated.View>
        <Animated.ScrollView
          className="flex-1"
          contentContainerClassName="grow w-full items-center gap-5 bg-pitch"
          contentContainerStyle={{
            paddingBottom: 30,
            paddingTop: headerHeight + 30,
          }}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          {children}
        </Animated.ScrollView>
      </View>
    </StyledSafeAreaView>
  );
}

import { useState } from "react";
import { Image, Text, View, type ImageSourcePropType } from "react-native";
import { SvgUri } from "react-native-svg";

type CrestImageProps = {
  source: ImageSourcePropType | null;
  size: number;
  name: string;
};

export default function CrestImage(props: CrestImageProps) {
  // Reset error state when switching clubs or changing the image URL.
  return <CrestContent key={JSON.stringify(props.source)} {...props} />;
}

function CrestContent({ source, size, name }: CrestImageProps) {
  const [failed, setFailed] = useState(false);
  const uri = source && !Array.isArray(source) && typeof source === "object"
    ? source.uri : undefined;

  return (
    <View style={{ width: size, height: size }} className="items-center justify-center">
      {!source || failed ? (
        <Text className="font-bold text-heading">{name.slice(0, 2).toUpperCase()}</Text>
      ) : uri && /\.svg(?:[?#]|$)/i.test(uri) ? (
        <SvgUri uri={uri} width={size} height={size} onError={() => setFailed(true)} />
      ) : (
        <Image source={source} style={{ width: size, height: size }}
          resizeMode="contain" onError={() => setFailed(true)} />
      )}
    </View>
  );
}

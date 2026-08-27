import type { ImageSourcePropType } from "react-native";

export type TournamentId =
  | "premier-league"
  | "la-liga"
  | "brasileirao-serie-a"
  | "bundesliga"
  | "libertadores"
  | "sulamericana";

export type Tournament = {
  id: TournamentId;
  name: string;
  imageSource: ImageSourcePropType;
};

export const TOURNAMENTS: Tournament[] = [
  {
    id: "premier-league",
    name: "Premier League",
    imageSource: require("../../../assets/images/premier-league.png"),
  },
  {
    id: "la-liga",
    name: "La Liga",
    imageSource: require("../../../assets/images/la-liga.png"),
  },
  {
    id: "brasileirao-serie-a",
    name: "Brasileirão Serie A",
    imageSource: require("../../../assets/images/brasileirao-serie-a.png"),
  },
  {
    id: "bundesliga",
    name: "Bundesliga",
    imageSource: require("../../../assets/images/bundesliga.png"),
  },
  {
    id: "libertadores",
    name: "Libertadores",
    imageSource: require("../../../assets/images/libertadores.webp"),
  },
  {
    id: "sulamericana",
    name: "Sulamericana",
    imageSource: require("../../../assets/images/sudamericana.png"),
  },
];

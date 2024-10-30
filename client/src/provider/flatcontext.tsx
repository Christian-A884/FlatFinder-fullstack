import { createContext } from "react";
import { Flat } from "../interface";

export const FlatContext = createContext<FlatContextValue>({
  flat: [],
  setFlat: () => {},
});

interface FlatContextValue {
  flat: Flat[];
  setFlat: React.Dispatch<React.SetStateAction<Flat[]>>;
}


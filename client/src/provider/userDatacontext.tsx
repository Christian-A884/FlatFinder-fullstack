import { createContext } from "react";
import { User } from "../interface";

interface UserDataContextProps {
  userDetails: User;
  setUserDetails: React.Dispatch<React.SetStateAction<User | null>>;
  isSessionChecked: boolean;
}

export const UserDataContext = createContext<UserDataContextProps>({
  userDetails: {} as User,
  setUserDetails: () => {},
  isSessionChecked: false,
});

import AppRouter from "./router/routes";
import { useEffect, useState } from "react";
import { UserDataContext } from "./provider/userDatacontext";
import { checkSession } from "./api/methods/auth/users";
import { FlatContext } from "./provider/flatcontext";
import { User, Flat } from "./interface";
import { ToastContainer } from "react-toastify";

// import Cookies from "js-cookie";

function App() {
  const [userDetails, setUserDetails] = useState({} as User);
  const [allUsers, setAllUsers] = useState([]);
  const [flat, setFlat] = useState<Flat[]>([]);
  const [isSessionChecked, setIsSessionChecked] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      let user = null;
      try {
        const userData = await checkSession();
        setUserDetails(userData);
        user = userData;
        setIsSessionChecked(true);
      } catch (error) {
        console.error("Error fetching session data:", error);
      } finally {
        if (!user) {
          const currentURL = window.location.href;
          if (!currentURL.includes("/reset-password")) {
            if (currentURL !== "http://localhost:5173/login") {
              window.location.href = "http://localhost:5173/login";
            }
          }
        }
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <FlatContext.Provider value={{ flat, setFlat }}>
        <UserDataContext.Provider value={{ userDetails, setUserDetails, allUsers, setAllUsers, isSessionChecked }}>
          <ToastContainer />
          <AppRouter />
        </UserDataContext.Provider>
      </FlatContext.Provider>
    </>
  );
}

export default App;

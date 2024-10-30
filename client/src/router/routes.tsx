import { BrowserRouter, Route, Routes } from "react-router-dom";
import Homepage from "../pages/Homepage";
import AllUsers from "../pages/AllUsers";
import Favourites from "../pages/Favourites";
import FlatView from "../pages/FlatView";
import Login from "../pages/Login";
import Register from "../pages/Register";
import MyFlats from "../pages/MyFlats";
import NewFlat from "../pages/NewFlat";
import Profile from "../pages/Profile";
import ForgotPassword from "../pages/ForgotPassword";
import Navbar from "../components/Navbar";
import NavMobile from "../components/NavMobile";
import Footer from "../components/Footer";
import ResetPassword from "../pages/ResetPassword";

const AppRouter = () => {
  const routes = [
    { name: <Homepage />, path: "/" },
    { name: <AllUsers />, path: "/allusers" },
    { name: <Favourites />, path: "/favourites" },
    { name: <FlatView />, path: "/flat-view/:id" },
    { name: <Login />, path: "/login" },
    { name: <Register />, path: "/register" },
    { name: <MyFlats />, path: "/my-flats" },
    { name: <NewFlat />, path: "/new-flat" },
    { name: <Profile />, path: "/profile/:_id" },
    { name: <ForgotPassword />, path: "/forgot-password" },
    { name: <ResetPassword />, path: "/reset-password/:token" },
  ];

  return (
    <BrowserRouter>
      <NavMobile />
      <Navbar />
      <Routes>
        {routes.map(({ name, path }) => (
          <Route key={path} path={path} element={name} />
        ))}
      </Routes>
      <Footer />
    </BrowserRouter>
  );
};

export default AppRouter;

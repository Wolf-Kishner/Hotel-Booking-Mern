import "./App.css";
import { Route, Routes } from "react-router-dom";
import IndexPage from "./pages/IndexPage";
import LoginPage from "./pages/LoginPage";
import { Layout } from "./Layout";
import RegisterPage from "./pages/Register";
import axios from "axios";
import { UserContextProvider } from "../UserContext";
import { ProfilePage } from "./pages/ProfilePage";
import { PlacesPage } from "./pages/PlacesPage";
import { PlacesFormPage } from "./pages/PlacesFormPage";
import { PlacePage } from "./pages/PlacePage";
import { BookingsPage } from "./pages/BookingsPage";
import { BookingPage } from "./pages/BookingPage";

//This is Base URL for making Requests from Client  Side to Server Side from port 5173 to--> 4000
axios.defaults.baseURL = "https://hotel-booking-mern-3b69.onrender.com";
axios.defaults.withCredentials = true;

//Now What we Want is To always Check whether we are Logged in or Not for that We will use Context API
function App() {
  return (
    <UserContextProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<IndexPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/account" element={<ProfilePage />} />
          <Route path="/account/places" element={<PlacesPage />} />
          <Route path="/account/places/new" element={<PlacesFormPage />} />
          <Route path="/account/places/:id" element={<PlacesFormPage />} />
          <Route path="/place/:id" element={<PlacePage />} />
          <Route path="/account/bookings" element={<BookingsPage />} />
          <Route path="/account/bookings/:id" element={<BookingPage />} />
        </Route>
      </Routes>
    </UserContextProvider>
  );
}

export default App;

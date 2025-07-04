import { Navigate, Routes, Route } from "react-router-dom";
import Home from "../pages/HomeLegal";
import About from "../pages/AboutLegal";
import Contact from "../pages/ContactLegal";
import Chatbot from "../pages/Chatbot";
import Login from "../pages/LoginLegal";
import Register from "../pages/RegisterLegal";
import UserProfile from "../pages/UserProfile";
import ProtectedRoutes from "../components/UI/ProtectedRoutes";
// import ChatbotPage from "../pages/Chatbotpage";
import FAQ from "../pages/FAQ";

const Routers = () => {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/home" />} />
            <Route index element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FAQ />} />
            {/* <Route path="/chatbottry" element={<ChatbotPage />} /> */}
            <Route path="/chatbot" element={ <ProtectedRoutes> <Chatbot /> </ProtectedRoutes> } />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/userprofile" element={ <ProtectedRoutes> <UserProfile /> </ProtectedRoutes> } />
        </Routes>
    );
};

export default Routers;

import { Link } from "react-router-dom";

import NewHeader from "../components/Header/NewHeader";
import MainHeader from "../components/Header/MainHeader"; 

import { useState } from "react";
import InfoCards from "../components/Cards/Cards";
import UseCasesSection from "../components/Cards/CardImg";

const Home = () => {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);

    const handleSendMessage = () => {
        if (message.trim()) {
            setMessages([...messages, { text: message, sender: "user" }]);
            setMessage(""); // Clear the input field
        }
    };

    // Handle key press to send message when Enter is pressed
    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleSendMessage(); // Call send message if Enter key is pressed
        }
    };

    return (
        <div>
      <MainHeader />
       <InfoCards />
        <UseCasesSection />
        </div>
    );
};

export default Home;

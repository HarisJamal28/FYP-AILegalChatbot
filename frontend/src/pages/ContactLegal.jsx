import { Link } from "react-router-dom";
import "./ContactLegal.css"; // Make sure to create or copy styles into this file

const Contact = () => {
    return (
        <div className="contact-container">
            <div className="contact-content-container">
                {/* Main Content Area */}
                <div className="contact-main-content">
                    <h1>Contact Us</h1>
                    <p>
                        If you have any questions, feedback, or need support, feel free to reach out to us. 
                        We’re here to help!
                    </p>
                    <ul>
                        <li>Email: support@ailegalchatbot.com</li>
                        <li>Phone: +1 (123) 456-7890</li>
                        <li>Hours: Mon–Fri, 9am–5pm</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Contact;

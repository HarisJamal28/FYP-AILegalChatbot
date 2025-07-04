import './footerlegal.css';

const Footer = () => {
    return (
        <div className="footer">
            <p>&copy; AI Legal Chatbot. All rights reserved. {new Date().getFullYear()}</p>
        </div>
    );
};

export default Footer;


const Footer = () => {
    const date = new Date();
    return (
        <> 
            <div className="items-center justify-center text-center bg-[#1e1e1e] p-4">
                <p>&copy; AI Legal Chatbot. All rights reserved. {new Date().getFullYear()}</p>
            </div>
        </>
    );
};

export default Footer;

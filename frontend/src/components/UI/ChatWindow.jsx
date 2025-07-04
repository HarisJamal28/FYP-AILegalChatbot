import Message from "./Message";

const ChatWindow = ({ messages }) => (
    <div className="flex flex-col space-y-4">
        {messages.map((msg, index) => (
        <Message key={index} sender={msg.sender} text={msg.text} />
        ))}
    </div>
);
export default ChatWindow;
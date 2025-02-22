import { useState, KeyboardEvent, ChangeEvent } from "react";
import { Paper, InputBase, IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

const ChatInput = ({ onSendMessage, disabled = false }: ChatInputProps) => {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: "8px",
        display: "flex",
        alignItems: "center",
        border: 1,
        borderColor: "divider",
        borderRadius: 3,
      }}
    >
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder="Type a message..."
        value={message}
        onChange={handleChange}
        onKeyPress={handleKeyPress}
        disabled={disabled}
        multiline
        maxRows={4}
      />
      <IconButton
        onClick={handleSend}
        disabled={disabled || !message.trim()}
        color="primary"
      >
        <SendIcon />
      </IconButton>
    </Paper>
  );
};

export default ChatInput;

import { Box, Paper, Typography, CircularProgress } from "@mui/material";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import PersonIcon from "@mui/icons-material/Person";

interface ChatMessageProps {
  message: string;
  isBot?: boolean;
  isTyping?: boolean;
}

const ChatMessage = ({
  message,
  isBot = false,
  isTyping = false,
}: ChatMessageProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: isBot ? "flex-start" : "flex-end",
        mb: 2,
        gap: 1,
      }}
    >
      {isBot && (
        <SmartToyIcon
          sx={{
            color: "primary.main",
            fontSize: 32,
            alignSelf: "flex-end",
            mb: 0.5,
          }}
        />
      )}
      <Paper
        elevation={0}
        sx={{
          maxWidth: "70%",
          p: 2,
          backgroundColor: isBot ? "primary.main" : "primary.light",
          color: isBot ? "white" : "text.primary",
          borderRadius: isBot ? "16px 16px 16px 4px" : "16px 16px 4px 16px",
        }}
      >
        {isTyping ? (
          <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
            <CircularProgress size={8} color="inherit" />
            <CircularProgress size={8} color="inherit" />
            <CircularProgress size={8} color="inherit" />
          </Box>
        ) : (
          <Typography>{message}</Typography>
        )}
      </Paper>
      {!isBot && (
        <PersonIcon
          sx={{
            color: "primary.main",
            fontSize: 32,
            alignSelf: "flex-end",
            mb: 0.5,
          }}
        />
      )}
    </Box>
  );
};

export default ChatMessage;

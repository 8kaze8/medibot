import { ThemeProvider, createTheme } from "@mui/material";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import SendIcon from "@mui/icons-material/Send";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import Typography from "@mui/material/Typography";
import { useState, useEffect } from "react";
import { Chat, Message } from "./types/chat";
import Sidebar from "./components/layout/Sidebar";
import WelcomeScreen from "./components/chat/WelcomeScreen";

const DRAWER_WIDTH = 300;
const STORAGE_KEY = "medi_chats";

const theme = createTheme({
  palette: {
    primary: {
      main: "#4B7BF5",
      light: "#E8F0FE",
    },
    background: {
      default: "#F8FAFC",
      paper: "#FFFFFF",
    },
  },
  shape: {
    borderRadius: 16,
  },
  typography: {
    fontFamily:
      "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          border: "none",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          margin: "4px 8px",
          padding: "10px 16px",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 12,
            backgroundColor: "#F8FAFC",
            "&:hover": {
              backgroundColor: "#F1F5F9",
            },
            "&.Mui-focused": {
              backgroundColor: "#FFFFFF",
            },
          },
        },
      },
    },
  },
});

function App() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Load chats from localStorage on initial render
  useEffect(() => {
    const savedChats = localStorage.getItem(STORAGE_KEY);
    if (savedChats) {
      const parsedChats = JSON.parse(savedChats);
      setChats(parsedChats);

      // Select the most recent chat if exists
      if (parsedChats.length > 0) {
        setSelectedChat(parsedChats[0].id);
      }
    }
  }, []);

  // Save chats to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(chats));
  }, [chats]);

  const getCurrentChat = () => {
    return chats.find((chat) => chat.id === selectedChat);
  };

  const handleNewChat = () => {
    const newChat: Chat = {
      id: Date.now().toString(),
      title: `Yeni Sohbet ${chats.length + 1}`,
      messages: [],
      lastMessage: "",
      timestamp: Date.now(),
    };

    setChats((prev) => [newChat, ...prev]);
    setSelectedChat(newChat.id);
  };

  const handleEditChat = (chatId: string, newTitle: string) => {
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === chatId ? { ...chat, title: newTitle } : chat
      )
    );
  };

  const handleDeleteChat = (chatId: string) => {
    setChats((prev) => prev.filter((chat) => chat.id !== chatId));
    if (selectedChat === chatId) {
      const remainingChats = chats.filter((chat) => chat.id !== chatId);
      setSelectedChat(remainingChats.length > 0 ? remainingChats[0].id : null);
    }
  };

  const handleQuickStart = (message: string) => {
    handleNewChat();
    setInputMessage(message);
    setTimeout(() => handleSend(), 100);
  };

  const handleSend = async () => {
    if (!inputMessage.trim() || !selectedChat) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage.trim(),
      isBot: false,
      timestamp: Date.now(),
    };

    // Update chat with new message
    setChats((prev) =>
      prev.map((chat) => {
        if (chat.id === selectedChat) {
          // If this is the first message, use it as chat title
          if (chat.messages.length === 0) {
            // Use the message as the chat title if it's not too long
            const newTitle =
              userMessage.text.length <= 30
                ? userMessage.text
                : userMessage.text.substring(0, 27) + "...";

            return {
              ...chat,
              title: newTitle,
              messages: [...chat.messages, userMessage],
              lastMessage: userMessage.text,
              timestamp: userMessage.timestamp,
            };
          }
          return {
            ...chat,
            messages: [...chat.messages, userMessage],
            lastMessage: userMessage.text,
            timestamp: userMessage.timestamp,
          };
        }
        return chat;
      })
    );

    setInputMessage("");
    setIsLoading(true);

    // Simulate bot response
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Bu bir örnek yanıttır. API entegrasyonu sonra eklenecek.",
        isBot: true,
        timestamp: Date.now(),
      };

      setChats((prev) =>
        prev.map((chat) => {
          if (chat.id === selectedChat) {
            return {
              ...chat,
              messages: [...chat.messages, botMessage],
              lastMessage: botMessage.text,
              timestamp: botMessage.timestamp,
            };
          }
          return chat;
        })
      );

      setIsLoading(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const currentChat = getCurrentChat();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: "flex", minHeight: "100vh" }}>
        <Sidebar
          width={DRAWER_WIDTH}
          chats={chats}
          selectedChat={selectedChat}
          onNewChat={handleNewChat}
          onSelectChat={setSelectedChat}
          onEditChat={handleEditChat}
          onDeleteChat={handleDeleteChat}
        />

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            bgcolor: "background.default",
            p: { xs: 1, md: 3 },
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Paper
            elevation={0}
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              borderRadius: 4,
              border: "1px solid",
              borderColor: "divider",
              bgcolor: "background.paper",
            }}
          >
            <Box
              sx={{
                flex: 1,
                p: 3,
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                gap: 2,
                "&::-webkit-scrollbar": { width: "8px" },
                "&::-webkit-scrollbar-track": {
                  backgroundColor: "background.default",
                  borderRadius: 4,
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "primary.light",
                  borderRadius: 4,
                  "&:hover": {
                    backgroundColor: "primary.main",
                  },
                },
              }}
            >
              {!selectedChat ? (
                <WelcomeScreen
                  onNewChat={handleNewChat}
                  onQuickStart={handleQuickStart}
                />
              ) : (
                <>
                  {currentChat?.messages.map((message) => (
                    <Box
                      key={message.id}
                      sx={{
                        display: "flex",
                        justifyContent: message.isBot
                          ? "flex-start"
                          : "flex-end",
                        gap: 1.5,
                        alignItems: "flex-end",
                      }}
                    >
                      {message.isBot && (
                        <Box
                          sx={{
                            bgcolor: "primary.main",
                            borderRadius: "50%",
                            p: 0.5,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            mb: 0.5,
                          }}
                        >
                          <SmartToyIcon sx={{ fontSize: 20, color: "white" }} />
                        </Box>
                      )}
                      <Paper
                        elevation={0}
                        sx={{
                          py: 1.5,
                          px: 2,
                          maxWidth: "70%",
                          bgcolor: message.isBot
                            ? "primary.main"
                            : "primary.light",
                          color: message.isBot ? "white" : "text.primary",
                          borderRadius: message.isBot
                            ? "20px 20px 20px 4px"
                            : "20px 20px 4px 20px",
                          boxShadow: message.isBot
                            ? "0 4px 20px rgba(75, 123, 245, 0.2)"
                            : "0 4px 20px rgba(0, 0, 0, 0.05)",
                        }}
                      >
                        <Typography
                          sx={{ fontSize: "0.95rem", lineHeight: 1.5 }}
                        >
                          {message.text}
                        </Typography>
                      </Paper>
                    </Box>
                  ))}
                  {isLoading && (
                    <Box
                      sx={{ display: "flex", gap: 1.5, alignItems: "center" }}
                    >
                      <Box
                        sx={{
                          bgcolor: "primary.main",
                          borderRadius: "50%",
                          p: 0.5,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <SmartToyIcon sx={{ fontSize: 20, color: "white" }} />
                      </Box>
                      <Paper
                        elevation={0}
                        sx={{
                          py: 1.5,
                          px: 2,
                          bgcolor: "primary.main",
                          color: "white",
                          borderRadius: "20px 20px 20px 4px",
                          boxShadow: "0 4px 20px rgba(75, 123, 245, 0.2)",
                        }}
                      >
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <Box
                            sx={{
                              width: 6,
                              height: 6,
                              borderRadius: "50%",
                              bgcolor: "white",
                              animation: "bounce 1.4s infinite",
                            }}
                          />
                          <Box
                            sx={{
                              width: 6,
                              height: 6,
                              borderRadius: "50%",
                              bgcolor: "white",
                              animation: "bounce 1.4s infinite 0.2s",
                            }}
                          />
                          <Box
                            sx={{
                              width: 6,
                              height: 6,
                              borderRadius: "50%",
                              bgcolor: "white",
                              animation: "bounce 1.4s infinite 0.4s",
                            }}
                          />
                        </Box>
                      </Paper>
                    </Box>
                  )}
                </>
              )}
            </Box>

            <Box
              sx={{
                p: { xs: 2, md: 3 },
                borderTop: "1px solid",
                borderColor: "divider",
                bgcolor: "background.paper",
              }}
            >
              <Box sx={{ display: "flex", gap: 1.5, alignItems: "flex-end" }}>
                <TextField
                  fullWidth
                  multiline
                  maxRows={4}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={
                    selectedChat
                      ? "Mesajınızı yazın..."
                      : "Yeni bir sohbet başlatın..."
                  }
                  variant="outlined"
                  size="small"
                  disabled={!selectedChat}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      padding: "8px 14px",
                    },
                  }}
                />
                <IconButton
                  color="primary"
                  onClick={handleSend}
                  disabled={!selectedChat || !inputMessage.trim() || isLoading}
                  sx={{
                    bgcolor: "primary.main",
                    color: "white",
                    width: 40,
                    height: 40,
                    "&:hover": {
                      bgcolor: "primary.dark",
                    },
                    "&.Mui-disabled": {
                      bgcolor: "action.disabledBackground",
                      color: "action.disabled",
                    },
                  }}
                >
                  <SendIcon sx={{ fontSize: 20 }} />
                </IconButton>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Box>
      <style>
        {`
          @keyframes bounce {
            0%, 60%, 100% { transform: translateY(0); }
            30% { transform: translateY(-4px); }
          }
        `}
      </style>
    </ThemeProvider>
  );
}

export default App;

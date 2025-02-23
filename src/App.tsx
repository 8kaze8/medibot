import { ThemeProvider, createTheme } from "@mui/material";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import SendIcon from "@mui/icons-material/Send";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import MenuIcon from "@mui/icons-material/Menu";
import Typography from "@mui/material/Typography";
import { useState, useEffect } from "react";
import { Chat, Message } from "./types/chat";
import Sidebar from "./components/layout/Sidebar";
import WelcomeScreen from "./components/chat/WelcomeScreen";
import { mediAI } from "./services/ai";
import useMediaQuery from "@mui/material/useMediaQuery";

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
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // Load chats from localStorage on initial render
  useEffect(() => {
    const savedChats = localStorage.getItem(STORAGE_KEY);
    if (savedChats) {
      const parsedChats = JSON.parse(savedChats);
      setChats(parsedChats);
      // Her zaman WelcomeScreen ile başla
      setSelectedChat(null);
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
    const welcomeMessage = mediAI.getWelcomeMessage();
    const newChat: Chat = {
      id: Date.now().toString(),
      title: "Yeni sohbet",
      messages: [
        {
          id: Date.now().toString(),
          text: welcomeMessage,
          isBot: true,
          timestamp: Date.now(),
        },
      ],
      lastMessage: welcomeMessage,
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
          // If this is the first user message, create a title
          if (chat.messages.length === 1) {
            let newTitle = userMessage.text;

            // Eğer soru işareti varsa, soru kısmını al
            if (newTitle.includes("?")) {
              newTitle = newTitle.split("?")[0] + "?";
            }

            // Başlığı kısalt
            if (newTitle.length > 30) {
              newTitle = newTitle.substring(0, 27) + "...";
            }

            // İlk harfi büyük yap
            newTitle = newTitle.charAt(0).toUpperCase() + newTitle.slice(1);

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

    try {
      const aiResponse = await mediAI.chat(userMessage.text);

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
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
    } catch (error) {
      console.error("Error getting AI response:", error);

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Üzgünüm, bir hata oluştu. Lütfen daha sonra tekrar deneyin.",
        isBot: true,
        timestamp: Date.now(),
      };

      setChats((prev) =>
        prev.map((chat) => {
          if (chat.id === selectedChat) {
            return {
              ...chat,
              messages: [...chat.messages, errorMessage],
              lastMessage: errorMessage.text,
              timestamp: errorMessage.timestamp,
            };
          }
          return chat;
        })
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const currentChat = getCurrentChat();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: "flex", minHeight: "100vh" }}>
        {isMobile && (
          <IconButton
            color="primary"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{
              position: "fixed",
              top: 8,
              left: 8,
              zIndex: 1200,
              bgcolor: "background.paper",
              boxShadow: 1,
              "&:hover": { bgcolor: "background.paper" },
            }}
          >
            <MenuIcon />
          </IconButton>
        )}

        <Sidebar
          width={DRAWER_WIDTH}
          chats={chats}
          selectedChat={selectedChat}
          onNewChat={handleNewChat}
          onSelectChat={(chatId) => {
            setSelectedChat(chatId);
            if (isMobile) setMobileOpen(false);
          }}
          onEditChat={handleEditChat}
          onDeleteChat={handleDeleteChat}
          mobileOpen={mobileOpen}
          onDrawerToggle={handleDrawerToggle}
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
              borderRadius: { xs: 2, md: 4 },
              border: "1px solid",
              borderColor: "divider",
              bgcolor: "background.paper",
              mt: { xs: 5, md: 0 },
              width: "100%",
            }}
          >
            <Box
              sx={{
                flex: 1,
                p: { xs: 2, md: 3 },
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                gap: 2,
                justifyContent: !selectedChat ? "center" : "flex-start",
                alignItems: !selectedChat ? "center" : "stretch",
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
              {!selectedChat || chats.length === 0 ? (
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
                          dangerouslySetInnerHTML={{ __html: message.text }}
                        />
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
                p: { xs: 1.5, md: 3 },
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
                      padding: { xs: "6px 10px", md: "8px 14px" },
                      fontSize: { xs: "0.9rem", md: "1rem" },
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
                    width: { xs: 35, md: 40 },
                    height: { xs: 35, md: 40 },
                    "&:hover": {
                      bgcolor: "primary.dark",
                    },
                    "&.Mui-disabled": {
                      bgcolor: "action.disabledBackground",
                      color: "action.disabled",
                    },
                  }}
                >
                  <SendIcon sx={{ fontSize: { xs: 18, md: 20 } }} />
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

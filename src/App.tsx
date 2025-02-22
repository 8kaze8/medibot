import { ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import CssBaseline from "@mui/material/CssBaseline";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import SendIcon from "@mui/icons-material/Send";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import PersonIcon from "@mui/icons-material/Person";
import AddIcon from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ChatIcon from "@mui/icons-material/Chat";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState, useEffect, useRef } from "react";

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: number;
}

interface Chat {
  id: string;
  title: string;
  messages: Message[];
  lastMessage: string;
  timestamp: number;
}

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
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const editInputRef = useRef<HTMLInputElement>(null);

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

  const handleEditStart = (chatId: string, currentTitle: string) => {
    setEditingChatId(chatId);
    setEditTitle(currentTitle);
    // Focus input on next render
    setTimeout(() => {
      editInputRef.current?.focus();
    }, 0);
  };

  const handleEditSave = (chatId: string) => {
    if (editTitle.trim()) {
      setChats((prev) =>
        prev.map((chat) =>
          chat.id === chatId ? { ...chat, title: editTitle.trim() } : chat
        )
      );
    }
    setEditingChatId(null);
    setEditTitle("");
  };

  const handleEditCancel = () => {
    setEditingChatId(null);
    setEditTitle("");
  };

  const handleDeleteChat = (chatId: string) => {
    setChats((prev) => prev.filter((chat) => chat.id !== chatId));
    if (selectedChat === chatId) {
      const remainingChats = chats.filter((chat) => chat.id !== chatId);
      setSelectedChat(remainingChats.length > 0 ? remainingChats[0].id : null);
    }
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

  const formatTimestamp = (timestamp: number): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays === 0) {
      return date.toLocaleTimeString("tr-TR", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (diffDays === 1) {
      return "Dün";
    } else if (diffDays < 7) {
      return `${diffDays} gün önce`;
    } else {
      return date.toLocaleDateString("tr-TR");
    }
  };

  const currentChat = getCurrentChat();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: "flex", minHeight: "100vh" }}>
        <Drawer
          variant="permanent"
          sx={{
            width: DRAWER_WIDTH,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: DRAWER_WIDTH,
              boxSizing: "border-box",
              bgcolor: "background.paper",
              borderRight: "1px solid",
              borderColor: "divider",
            },
          }}
        >
          <Box
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              height: "100%",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
              <Box
                sx={{
                  bgcolor: "primary.main",
                  borderRadius: "50%",
                  p: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <SmartToyIcon sx={{ fontSize: 24, color: "white" }} />
              </Box>
              <Typography variant="h6" color="primary" sx={{ fontWeight: 600 }}>
                Medi
              </Typography>
            </Box>

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleNewChat}
              sx={{
                mb: 2,
                borderRadius: 3,
                textTransform: "none",
                py: 1.2,
                boxShadow: "none",
                "&:hover": { boxShadow: "none" },
              }}
            >
              Yeni Sohbet
            </Button>

            <List sx={{ flex: 1, mt: 1, overflowY: "auto" }}>
              {chats.map((chat) => (
                <ListItem
                  key={chat.id}
                  disablePadding
                  sx={{
                    position: "relative",
                    "&:hover": {
                      "& .chat-actions": {
                        opacity: 1,
                      },
                    },
                  }}
                >
                  <ListItemButton
                    selected={selectedChat === chat.id}
                    onClick={() => setSelectedChat(chat.id)}
                    sx={{
                      pr: 8,
                      "&.Mui-selected": {
                        backgroundColor: "primary.light",
                        "&:hover": {
                          backgroundColor: "primary.light",
                        },
                      },
                    }}
                  >
                    <ListItemIcon>
                      <ChatIcon
                        color={selectedChat === chat.id ? "primary" : "action"}
                      />
                    </ListItemIcon>
                    {editingChatId === chat.id ? (
                      <TextField
                        inputRef={editInputRef}
                        size="small"
                        fullWidth
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            handleEditSave(chat.id);
                          } else if (e.key === "Escape") {
                            handleEditCancel();
                          }
                        }}
                        onBlur={() => handleEditSave(chat.id)}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            backgroundColor: "background.paper",
                          },
                        }}
                      />
                    ) : (
                      <Typography
                        sx={{
                          fontSize: "0.9rem",
                          fontWeight: selectedChat === chat.id ? 600 : 400,
                          flex: 1,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {chat.title}
                      </Typography>
                    )}
                  </ListItemButton>
                  <Box
                    className="chat-actions"
                    sx={{
                      position: "absolute",
                      right: 12,
                      top: "50%",
                      transform: "translateY(-50%)",
                      display: "flex",
                      gap: 0.5,
                      opacity: 0,
                      transition: "opacity 0.2s ease-in-out",
                      backgroundColor:
                        selectedChat === chat.id
                          ? "primary.light"
                          : "background.paper",
                      padding: "4px",
                      borderRadius: "8px",
                      zIndex: 1,
                    }}
                  >
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditStart(chat.id, chat.title);
                      }}
                      sx={{
                        width: 28,
                        height: 28,
                        backgroundColor: "primary.main",
                        color: "white",
                        "&:hover": {
                          backgroundColor: "primary.dark",
                        },
                      }}
                    >
                      <EditIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteChat(chat.id);
                      }}
                      sx={{
                        width: 28,
                        height: 28,
                        backgroundColor: "error.main",
                        color: "white",
                        "&:hover": {
                          backgroundColor: "error.dark",
                        },
                      }}
                    >
                      <DeleteIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                  </Box>
                </ListItem>
              ))}
            </List>
          </Box>
        </Drawer>

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
              {currentChat?.messages.map((message) => (
                <Box
                  key={message.id}
                  sx={{
                    display: "flex",
                    justifyContent: message.isBot ? "flex-start" : "flex-end",
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
                      bgcolor: message.isBot ? "primary.main" : "primary.light",
                      color: message.isBot ? "white" : "text.primary",
                      borderRadius: message.isBot
                        ? "20px 20px 20px 4px"
                        : "20px 20px 4px 20px",
                      boxShadow: message.isBot
                        ? "0 4px 20px rgba(75, 123, 245, 0.2)"
                        : "0 4px 20px rgba(0, 0, 0, 0.05)",
                    }}
                  >
                    <Typography sx={{ fontSize: "0.95rem", lineHeight: 1.5 }}>
                      {message.text}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        display: "block",
                        mt: 0.5,
                        opacity: 0.7,
                        fontSize: "0.75rem",
                      }}
                    >
                      {formatTimestamp(message.timestamp)}
                    </Typography>
                  </Paper>
                  {!message.isBot && (
                    <Box
                      sx={{
                        bgcolor: "primary.light",
                        borderRadius: "50%",
                        p: 0.5,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mb: 0.5,
                      }}
                    >
                      <PersonIcon
                        sx={{ fontSize: 20, color: "primary.main" }}
                      />
                    </Box>
                  )}
                </Box>
              ))}
              {isLoading && (
                <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
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

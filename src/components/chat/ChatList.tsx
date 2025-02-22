import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  Typography,
  Box,
  IconButton,
  TextField,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useRef, useState } from "react";

interface Chat {
  id: string;
  title: string;
  messages: any[];
  lastMessage: string;
  timestamp: number;
}

interface ChatListProps {
  chats: Chat[];
  selectedChat: string | null;
  onSelectChat: (chatId: string) => void;
  onEditChat: (chatId: string, newTitle: string) => void;
  onDeleteChat: (chatId: string) => void;
}

const ChatList = ({
  chats,
  selectedChat,
  onSelectChat,
  onEditChat,
  onDeleteChat,
}: ChatListProps) => {
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const editInputRef = useRef<HTMLInputElement>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleEditStart = (chatId: string, currentTitle: string) => {
    setEditingChatId(chatId);
    setEditTitle(currentTitle);
    setTimeout(() => {
      editInputRef.current?.focus();
    }, 0);
  };

  const handleEditSave = (chatId: string) => {
    if (editTitle.trim()) {
      onEditChat(chatId, editTitle.trim());
    }
    setEditingChatId(null);
    setEditTitle("");
  };

  const handleEditCancel = () => {
    setEditingChatId(null);
    setEditTitle("");
  };

  return (
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
            onClick={() => onSelectChat(chat.id)}
            sx={{
              pr: 8,
              py: { xs: 1.2, md: 1.5 },
              "&.Mui-selected": {
                backgroundColor: "primary.light",
                "&:hover": {
                  backgroundColor: "primary.light",
                },
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: { xs: 36, md: 40 } }}>
              <ChatIcon
                color={selectedChat === chat.id ? "primary" : "action"}
                sx={{ fontSize: { xs: 20, md: 24 } }}
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
                    fontSize: { xs: "0.9rem", md: "1rem" },
                  },
                }}
              />
            ) : (
              <Typography
                sx={{
                  fontSize: { xs: "0.85rem", md: "0.9rem" },
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
              right: { xs: 8, md: 12 },
              top: "50%",
              transform: "translateY(-50%)",
              display: "flex",
              gap: 0.5,
              opacity: isMobile ? 1 : 0,
              transition: "opacity 0.2s ease-in-out",
              backgroundColor:
                selectedChat === chat.id ? "primary.light" : "background.paper",
              padding: "4px",
              borderRadius: "8px",
              zIndex: 1,
            }}
          >
            <IconButton
              size={isMobile ? "small" : "medium"}
              onClick={(e) => {
                e.stopPropagation();
                handleEditStart(chat.id, chat.title);
              }}
              sx={{
                width: { xs: 24, md: 28 },
                height: { xs: 24, md: 28 },
                backgroundColor: "primary.main",
                color: "white",
                "&:hover": {
                  backgroundColor: "primary.dark",
                },
              }}
            >
              <EditIcon sx={{ fontSize: { xs: 14, md: 16 } }} />
            </IconButton>
            <IconButton
              size={isMobile ? "small" : "medium"}
              onClick={(e) => {
                e.stopPropagation();
                onDeleteChat(chat.id);
              }}
              sx={{
                width: { xs: 24, md: 28 },
                height: { xs: 24, md: 28 },
                backgroundColor: "error.main",
                color: "white",
                "&:hover": {
                  backgroundColor: "error.dark",
                },
              }}
            >
              <DeleteIcon sx={{ fontSize: { xs: 14, md: 16 } }} />
            </IconButton>
          </Box>
        </ListItem>
      ))}
    </List>
  );
};

export default ChatList;

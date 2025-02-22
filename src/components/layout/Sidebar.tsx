import { Box, Typography, Button, Drawer } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import ChatList from "../chat/ChatList";

interface Chat {
  id: string;
  title: string;
  messages: any[];
  lastMessage: string;
  timestamp: number;
}

interface SidebarProps {
  width: number;
  chats: Chat[];
  selectedChat: string | null;
  onNewChat: () => void;
  onSelectChat: (chatId: string) => void;
  onEditChat: (chatId: string, newTitle: string) => void;
  onDeleteChat: (chatId: string) => void;
}

const Sidebar = ({
  width,
  chats,
  selectedChat,
  onNewChat,
  onSelectChat,
  onEditChat,
  onDeleteChat,
}: SidebarProps) => {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width,
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
          onClick={onNewChat}
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

        <ChatList
          chats={chats}
          selectedChat={selectedChat}
          onSelectChat={onSelectChat}
          onEditChat={onEditChat}
          onDeleteChat={onDeleteChat}
        />
      </Box>
    </Drawer>
  );
};

export default Sidebar;

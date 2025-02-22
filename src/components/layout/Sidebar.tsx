import {
  Box,
  Typography,
  Button,
  Drawer,
  useTheme,
  useMediaQuery,
} from "@mui/material";
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
  mobileOpen: boolean;
  onDrawerToggle: () => void;
}

const Sidebar = ({
  width,
  chats,
  selectedChat,
  onNewChat,
  onSelectChat,
  onEditChat,
  onDeleteChat,
  mobileOpen,
  onDrawerToggle,
}: SidebarProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const drawerContent = (
    <Box
      sx={{
        p: { xs: 1.5, md: 2 },
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          mb: { xs: 2, md: 3 },
        }}
      >
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
          <SmartToyIcon sx={{ fontSize: { xs: 20, md: 24 }, color: "white" }} />
        </Box>
        <Typography
          variant="h6"
          color="primary"
          sx={{ fontWeight: 600, fontSize: { xs: "1.1rem", md: "1.25rem" } }}
        >
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
          py: { xs: 1, md: 1.2 },
          fontSize: { xs: "0.9rem", md: "1rem" },
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
  );

  return (
    <Box
      component="nav"
      sx={{
        width: { md: width },
        flexShrink: { md: 0 },
      }}
    >
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={onDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better mobile performance
          }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: width,
              bgcolor: "background.paper",
              borderRight: "1px solid",
              borderColor: "divider",
            },
          }}
        >
          {drawerContent}
        </Drawer>
      ) : (
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", md: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: width,
              bgcolor: "background.paper",
              borderRight: "1px solid",
              borderColor: "divider",
            },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      )}
    </Box>
  );
};

export default Sidebar;

import { AppBar, Toolbar, Typography } from "@mui/material";

const Header = () => {
  return (
    <AppBar position="static" color="transparent" elevation={0}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ color: "primary.main" }}>
          Medi
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Header;

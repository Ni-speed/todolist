import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { LinearBuffer } from "../LinearProgress/LinerProgress";
import { useAppDispatch, useAppSelector } from "app/store";
import { RequestStatusType } from "app/app-reducer";
import { logoutTC } from "features/Login/auth-reducer";
import { useCallback } from "react";
import { selectorIsLoggedIn, selectorStatus } from "components/Header/header-selectors";

export const Header = () => {
  const status = useAppSelector<RequestStatusType>(selectorStatus);
  const isLoggedIn = useAppSelector<boolean>(selectorIsLoggedIn);
  const dispatch = useAppDispatch();
  const logoutHandler = useCallback(() => {
    dispatch(logoutTC());
  }, []);
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            News
          </Typography>
          {isLoggedIn && (
            <Button color="inherit" onClick={logoutHandler}>
              Log out
            </Button>
          )}
        </Toolbar>
        {status === "loading" && <LinearBuffer />}
      </AppBar>
    </Box>
  );
};

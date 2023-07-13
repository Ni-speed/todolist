import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { LinearBuffer } from "common/components/LinearProgress/LinerProgress";
import { useAppSelector } from "app/store";
import { RequestStatusType } from "app/app-reducer";
import { useCallback } from "react";
import { selectorIsLoggedIn } from "features/auth/auth-selectors";
import { useAppDispatch } from "common/hooks";
import { selectorStatus } from "app/app-selectors";
import { authThunks } from "features/auth/auth-reducer";

export const Header = () => {
  const status = useAppSelector<RequestStatusType>(selectorStatus);
  const isLoggedIn = useAppSelector<boolean>(selectorIsLoggedIn);
  const dispatch = useAppDispatch();

  const logoutHandler = useCallback(() => {
    debugger;
    dispatch(authThunks.logout());
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

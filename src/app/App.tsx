import React, { useEffect } from "react";
import "./App.css";
import { CircularProgress, Container } from "@mui/material";
import { TodoListsList } from "features/TodolistsList/TodoListsList";
import { Navigate, Route, Routes } from "react-router-dom";
import { Login } from "features/auth/Login";
import { useAppSelector } from "./store";
import { meTC } from "app/app-reducer";
import { selectorIsInitialized } from "app/app-selectors";
import { useAppDispatch } from "common/hooks";
import { ErrorSnackbar, Header } from "common/components";

function App() {
  const dispatch = useAppDispatch();
  const isInitialized = useAppSelector<boolean>(selectorIsInitialized);
  console.log("isInitialized: ", isInitialized);
  console.log("Render App");
  useEffect(() => {
    dispatch(meTC());
  }, []);
  if (!isInitialized) {
    return (
      <div style={{ position: "fixed", top: "30%", textAlign: "center", width: "100%" }}>
        <CircularProgress />
      </div>
    );
  }
  return (
    <div className="App">
      <ErrorSnackbar />
      <Header />
      <Container fixed>
        <Routes>
          <Route path={"/"} element={<TodoListsList />} />
          <Route path={"/login"} element={<Login />} />
          <Route path={"/404"} element={<h1>404 Page note found </h1>} />
          <Route path={"*"} element={<Navigate to={"404"} />} />
        </Routes>
      </Container>
    </div>
  );
}

export default App;

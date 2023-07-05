import React, { useEffect } from "react";
import "./App.css";
import { Header } from "components/Header/Header";
import { CircularProgress, Container } from "@mui/material";
import { TodoListsList } from "features/TodolistsList/TodoListsList";
import { ErrorSnackbar } from "components/ErrorSnackbar/ErrorSnackbar";
import { Navigate, Route, Routes } from "react-router-dom";
import { Login } from "features/Login/Login";
import { useAppDispatch, useAppSelector } from "./store";
import { meTC } from "app/app-reducer";

function App() {
  const dispatch = useAppDispatch();
  const isInitialized = useAppSelector<boolean>((state) => state.app.isInitialized);

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

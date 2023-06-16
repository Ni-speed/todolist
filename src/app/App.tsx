import React from "react";
import "./App.css";
import {Header} from '../components/Header/Header';
import {Container} from "@mui/material";
import {TodoListsList} from "../features/TodolistsList/TodoListsList";
import {ErrorSnackbar} from "../components/ErrorSnackbar/ErrorSnackbar";
import {Navigate, Route, Routes} from "react-router-dom";
import {Login} from "../features/Login/Login";


function App() {

    return (
        <div className="App">
            <ErrorSnackbar/>
            <Header/>
            <Container fixed>
                <Routes>
                    <Route path={'/'} element={<TodoListsList />} />
                    <Route path={'/login'} element={<Login/>} />
                    <Route path={'/404'} element={<h1>404 Page note found </h1>} />
                    <Route path={'*'} element={<Navigate to={'404'}/>} />
                </Routes>
            </Container>
        </div>
    );
}

export default App;

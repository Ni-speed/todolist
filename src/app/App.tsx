import React from "react";
import "./App.css";
import {Header} from '../components/Header/Header';
import {Container} from "@mui/material";
import {TodoListsList} from "../features/TodolistsList/TodoListsList";


function App() {

    return (
        <div className="App">
            <Header/>
            <Container fixed>
                <TodoListsList/>
            </Container>
        </div>
    );
}

export default App;

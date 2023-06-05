import React, {ChangeEvent, KeyboardEvent, useState} from "react";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import TextField from '@mui/material/TextField';

export type AddItemFormType = {
    addCallback: (title: string) => void;
};
export const AddItemForm: React.FC<AddItemFormType> = (props) => {
    const [title, setTitle] = useState("");
    const [error, setError] = useState<string | null>(null);

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value);
    };
    const addTask = () => {
        if (title.trim() !== "") {
            props.addCallback(title.trim());
            setTitle("");
        } else {
            setError("Title is required");
        }
    };
    const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        setError(null);
        if (e.key === "Enter") {
            addTask();
        }
    };

    return (
        <div>
            <TextField className={error ? "error" : ""}
                       placeholder={"Enter new task"}
                       value={title}
                       onChange={onChangeHandler}
                       onKeyDown={onKeyPressHandler}
                       id="outlined-basic"
                       label="Outlined"
                       variant="outlined"/>
            <AddCircleOutlineIcon
                color="primary"
                style={{
                    maxWidth: "30px",
                    maxHeight: "30px",
                    minWidth: "30px",
                    minHeight: "30px",
                }}
                onClick={addTask}
            />

            {error && <div className={"error-message"}>{error}</div>}
        </div>
    );
};

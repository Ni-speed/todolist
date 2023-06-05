import React, {ChangeEvent, KeyboardEvent, useState} from "react";
import TextField from '@mui/material/TextField';
import IconButton from "@mui/material/IconButton";
import AddBox from "@mui/icons-material/AddBox";

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
            <TextField error={!!error}
                       placeholder={"Enter new task"}
                       value={title}
                       onChange={onChangeHandler}
                       onKeyDown={onKeyPressHandler}
                       id="outlined-basic"
                       label="Title"
                       variant="outlined"
                       helperText={error}
            />
            <IconButton
                color="primary"
                onClick={addTask}>
                <AddBox/>
            </IconButton>

            {/*{error && <div className={"error-message"}>{error}</div>}*/}
        </div>
    );
};

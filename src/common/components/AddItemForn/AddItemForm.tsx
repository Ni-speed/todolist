import React, { ChangeEvent, KeyboardEvent, useState } from "react";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import { AddBox } from "@mui/icons-material";

export type AddItemFormType = {
  addCallback: (title: string) => void;
  disabled?: boolean;
};
export const AddItemForm: React.FC<AddItemFormType> = React.memo((props) => {
  console.log("AddItemForm called");
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
    if (error !== null) {
      setError(null);
    }
    if (e.key === "Enter") {
      addTask();
    }
  };

  return (
    <div>
      <TextField
        variant="outlined"
        error={!!error}
        value={title}
        onChange={onChangeHandler}
        onKeyDown={onKeyPressHandler}
        label="Enter new task"
        helperText={error}
        disabled={props.disabled}
      />
      <IconButton color="primary" onClick={addTask} component="span" disabled={props.disabled}>
        <AddBox />
      </IconButton>

      {/*{error && <div className={"error-message"}>{error}</div>}*/}
    </div>
  );
});

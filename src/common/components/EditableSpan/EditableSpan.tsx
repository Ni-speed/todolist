import React, { ChangeEvent, useState, KeyboardEvent } from "react";
import TextField from "@mui/material/TextField";

type EditableSpanType = {
  value: string;
  onChange: (newTitle: string) => void;
};
export const EditableSpan: React.FC<EditableSpanType> = React.memo((props) => {
  console.log("EditableSpan called");
  const [editMode, setEditMode] = useState<boolean>(false);
  const [title, setTitle] = useState(props.value);

  const onDoubleClickHandler = () => {
    setEditMode(!editMode);
    props.onChange(title);
  };
  const activateEditMode = () => {
    setEditMode(true);
    setTitle(props.value);
  };
  const onChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.currentTarget.value);
  };
  const onKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") setEditMode(!editMode);
    props.onChange(title);
  };
  return editMode ? (
    <TextField
      value={title}
      autoFocus={true}
      onBlur={onDoubleClickHandler}
      onChange={onChangeHandler}
      onKeyDown={onKeyDownHandler}
      id="outlined-basic"
      label="Outlined"
      variant="outlined"
    />
  ) : (
    <span onDoubleClick={activateEditMode}>{props.value}</span>
  );
});

import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import React from "react";

function ActionDialog({
  open,
  dialogMode,
  submitHandler,
  handleClose,
  children,
}) {
  return (
    open && (
      <Dialog open={open}>
        <form onSubmit={submitHandler}>
          <DialogTitle>{dialogMode}</DialogTitle>
          <DialogContent dividers className="dialog-content">{children}</DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit">Confirm</Button>
          </DialogActions>
        </form>
      </Dialog>
    )
  );
}

export default ActionDialog;

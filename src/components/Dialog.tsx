import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import * as React from "react";
import { useEffect } from "react";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: "flex",
      flexWrap: "wrap",
    },
  })
);

const DialogComponent: React.FC<{
  openModal: number;
  title: string;
  onClickConfirmHandler?: any;
  confirmText?: string;
  cancelText?: string;
}> = (props) => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    if (props.openModal) {
      setOpen(true);
    }
  }, [props.openModal]);

  const handleClose = () => {
    setOpen(false);
  };

  const onClickConfirm = () => {
    setOpen(false);

    if (props.onClickConfirmHandler) {
      props.onClickConfirmHandler();
    }
  };

  return (
    <Dialog
      disableBackdropClick
      disableEscapeKeyDown
      open={open}
      onClose={handleClose}
    >
      <DialogTitle>{props.title}</DialogTitle>
      <DialogContent>
        <div className={classes.container}>{props.children}</div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          {props.cancelText || "Cancel"}
        </Button>
        <Button onClick={onClickConfirm} color="primary">
          {props.confirmText || "Ok"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogComponent;

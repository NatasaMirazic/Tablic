import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

function InformationModal(props) {
  return (
    <div>
      <Dialog
        open={props.isOpenModal}
        aria-labelledby="alert-title"
        aria-describedby="alert-description"
      >
        <DialogTitle id="alert-title">{props.title}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {props.contentText}
            </DialogContentText>
          </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={props.closeModal} className="continue-button">
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default InformationModal;

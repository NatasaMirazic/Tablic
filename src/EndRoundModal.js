import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

function EndRoundModal(props) {
  return (
    <div>
      <Dialog
        open={props.isOpenedEndRoundDialog}
        onClose={props.closeEndRoundsDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Obaveštenje</DialogTitle>
        {/* When cards are even - there are no 3 bonus points */}
        {(props.computerCardsTaken.length === props.humanCardsTaken.length) ?
          <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Nakon ove partije, Vi imate {props.humanPoints+props.humanTables} a računar {props.computerPoints+props.computerTables} poena. <br />
            Takodje, Vi i računar imate isti broj odnetih karata, pa u ovom slučaju niko ne dobija dodatna 3 poena. <br />
            Konačni rezultat nakon ove partije je {props.humanPoints+props.humanTables}:{props.computerPoints+props.computerTables+3}. <br />
            Sada možete da nastavite igru. Pobednik je onaj koji prvi skupi 101 poen. Srećno!
          </DialogContentText>
        </DialogContent> :
        <div>
          {/* when computer have more taken cards then human */}
          {(props.computerCardsTaken.length > props.humanCardsTaken.length) ?
            <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Nakon ove partije, Vi imate {props.humanPoints+props.humanTables} a računar {props.computerPoints+props.computerTables} poena. <br />
              Takodje, broj karata koji ste Vi odneli je {props.humanCardsTaken.length}, a računar {props.computerCardsTaken.length}. <br />
              Iz tog razloga dodatna 3 poena je osvojio računar i konačni rezultat nakon ove partije je {props.humanPoints+props.humanTables}:{props.computerPoints+props.computerTables+3}. <br />
              Sada možete da nastavite igru. Pobednik je onaj koji prvi skupi 101 poen. Srećno!
            </DialogContentText>
          </DialogContent> :
          // when human have more taken cards then computer
          <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Nakon ove partije, Vi imate {props.humanPoints+props.humanTables} a računar {props.computerPoints+props.computerTables} poena. <br />
            Takodje, broj karata koji ste Vi odneli je {props.humanCardsTaken.length}, a računar {props.computerCardsTaken.length}. <br />
            Iz tog razloga Vi osvajate dodatna 3 poena i konačni rezultat nakon ove partije je {props.humanPoints+3+props.humanTables}:{props.computerPoints+props.computerTables}. <br />
            Sada možete da nastavite igru. Pobednik je onaj koji prvi skupi 101 poen. Srećno!
          </DialogContentText>
        </DialogContent>
          }
        </div>
        }
        <DialogActions>
          <Button variant="contained" onClick={props.continueGame} className="continue-button">
            Nastavi
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default EndRoundModal;

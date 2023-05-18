import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import { useState } from "react";
import BarCodeComponent from "../Print/BarCode";

interface Props {
  open: boolean;
  handleClose: () => void;
}

const VistaPrevia = ({ open, handleClose }: Props) => {
  const [column, setColumn] = useState(2);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      maxWidth="md"
    >
      <DialogTitle id="alert-dialog-title">{"Modelo de impresión"}</DialogTitle>
      <DialogContent>
        <div className="flex gap-2 mb-2">
          <label>Columna</label>
          <select
            value={column}
            className="border outline-none"
            onChange={(e) => {
              setColumn(Number(e.target.value));
            }}
          >
            <option value={1}>1</option>
            <option value={2}>2</option>
          </select>
        </div>
        <div className="flex flex-col text-center">
          <div className="flex">
            <BarCodeComponent />

            {column === 1 && (
              <div className="border-t border-r border-b w-[104mm] h-[50.8mm]"></div>
            )}

            {column === 2 && (
              <BarCodeComponent className="border-t border-r border-b" />
            )}
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} autoFocus>
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default VistaPrevia;

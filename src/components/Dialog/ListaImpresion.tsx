/* eslint-disable @typescript-eslint/no-explicit-any */
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";

interface Props {
  open: boolean;
  handleClose: () => void;
  data: any;
  setValue: any;
}

const ListaImpresion = ({ open, handleClose, data, setValue }: Props) => {
  // console.log(data);
  // console.log(data?.selects);
  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="md"
      >
        <DialogTitle id="alert-dialog-title">
          {`Lista de productos para imprimir - ${
            (data?.selects || []).length
          } Total`}
        </DialogTitle>
        <DialogContent>
          <TableContainer component={Paper}>
            <Table
              sx={{ minWidth: 650 }}
              size="small"
              aria-label="simple table"
            >
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell align="left">CODIGO</TableCell>
                  <TableCell align="left">PRODUCTO</TableCell>
                  <TableCell align="left">CODIGO BARRA</TableCell>
                  <TableCell align="center">SELECCIONAR</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(data?.selects || []).map((a, i) => {
                  return (
                    <TableRow
                      key={i + 1}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                      className="hover:bg-purple-400 border-b"
                    >
                      <TableCell component="th" scope="row">
                        {a.COR}
                      </TableCell>
                      <TableCell align="left">{a.COD}</TableCell>
                      <TableCell align="left">{a.PRODUCTO}</TableCell>
                      <TableCell align="left">
                        {a.COD_BARRA.padStart(15, "0")}
                        {/* {data["barcode_" + a.COD]} */}
                      </TableCell>
                      <TableCell align="center">
                        <input
                          checked={(data?.selects || []).some(
                            (x) => x.COR === a.COR
                          )}
                          className="cursor-pointer"
                          onChange={(e) => {
                            const checked = e.target.checked;
                            const selected = data?.selects[i];
                            if (checked) {
                              // Si el checkbox está marcado, agrega el elemento seleccionado a "selects"
                              setValue("selects", [
                                ...(data?.selects || []),
                                selected,
                              ]);
                            } else {
                              // Si el checkbox está desmarcado, remueve el elemento seleccionado de "selects"
                              setValue(
                                "selects",
                                data?.selects.filter(
                                  (item) => item.COR !== selected.COR
                                )
                              );
                            }
                          }}
                          type="checkbox"
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} autoFocus>
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ListaImpresion;

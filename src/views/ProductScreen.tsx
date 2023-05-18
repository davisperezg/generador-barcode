/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChangeEvent, useState, useMemo, useRef } from "react";
import { CSVLink } from "react-csv";
import {
  CABECERA_FORMATO_IMPORTACION,
  EXTENSIONS,
  FORMATO_IMPORTACION,
} from "../utils/const";
import * as XLSX from "xlsx";
import { useForm } from "react-hook-form";
import { useReactToPrint } from "react-to-print";
import usePagination from "../hooks/Pagination";
import { Pagination } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import VistaPrevia from "../components/Dialog/VistaPrevia";
import BarCodeComponent from "../components/Print/BarCode";
import ListaImpresion from "../components/Dialog/ListaImpresion";

interface Product {
  COD: number;
  PRODUCTO: string;
  COD_BARRA: string;
}

const initialState = {
  type: "",
  message: "" || <></>,
};

//let findError = false;

const ProductScreen = () => {
  const [registers, setRegisters] = useState<Product[]>([]);
  const [file, setFile] = useState("");
  const [fileReader, setFileReader] = useState("");
  const [existRegisters, setExistRegisters] = useState(false);
  const [registersAnalizados, setRegistersAnalizados] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [message, setMessage] = useState<any>(initialState);
  const [message2, setMessage2] = useState<any>(initialState);
  const [message3, setMessage3] = useState<any>(initialState);
  const [showAlert1, setShowAlert1] = useState(false);
  const [showAlert2, setShowAlert2] = useState(false);
  const [showAlert3, setShowAlert3] = useState(false);
  const [loadingCargando, setLoadingCargando] = useState(false);
  const [countPrint, setCountPrint] = useState(0);
  const [open, setOpen] = useState(false);
  const [openLista, setOpenLista] = useState(false);
  const {
    register,
    watch,
    setValue,
    formState: { errors },
    //setError,
    clearErrors,
  } = useForm();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleClickOpenLista = () => {
    setOpenLista(true);
  };

  const handleCloseLista = () => {
    setOpenLista(false);
  };

  const refBardcode = useRef(null);

  const buscador = watch("buscador");

  const [page, setPage] = useState(1);

  const PER_PAGE = Number(watch("imp_lote")) || 10;

  const productsFiltered = useMemo(() => {
    let computedProducts: any[] = [];

    if (products) {
      if (buscador) {
        return products.filter((product) =>
          product.PRODUCTO.toLowerCase()
            .trim()
            .includes(buscador.toLowerCase().trim())
        );
      }

      computedProducts = products;
    }

    return computedProducts;
  }, [products, buscador]);

  const _DATA = usePagination(productsFiltered, PER_PAGE);
  const count = Math.ceil(productsFiltered.length / PER_PAGE);

  const handleChange = (e, p) => {
    setPage(p);
    _DATA.jump(p);
  };

  const getExention = (file: any) => {
    const parts = file.name.split(".");
    const extension = parts[parts.length - 1];
    return EXTENSIONS.includes(extension); // return boolean
  };

  const convertToJson = (headers: any[], data: any[]) => {
    let rows: any[] = [];

    data.forEach((row: any) => {
      const rowData: any = {};

      row.forEach((element: any, index: any) => {
        rowData[headers[index]] = element;
      });

      rows.push(rowData);
    });

    rows = rows.map((format: Product) => {
      return {
        ...format,
        COD: Number(format.COD),
        PRODUCTO: String(format.PRODUCTO),
        COD_BARRA: String(format.COD_BARRA),
      };
    });

    return rows;
  };

  const cancelXML = () => {
    setShowAlert1(false);
    setShowAlert2(false);
    setShowAlert3(false);
    setMessage(initialState);
    setMessage2(initialState);
    setMessage3(initialState);
    setRegisters([]);
    setFile("");
  };

  const cargar = () => {
    setRegistersAnalizados(true);
    setLoadingCargando(true);

    setTimeout(() => {
      const addProducts = registers.map((item) => item);
      setProducts(addProducts);
      setLoadingCargando(false);
    }, 1000);
  };

  // Función para corregir la codificación de una celda específica
  const fixEncoding = (cell: string) => {
    const decodedCell = decodeURIComponent(escape(cell)); // Decodifica el valor de la celda
    return decodedCell;
  };

  const handleChangeImport = (e: ChangeEvent<HTMLInputElement>) => {
    const fileList: FileList | null = e.target.files;

    if (fileList) {
      const file = fileList[0];
      setFile(e.target.value);

      const reader = new FileReader();

      if (file) {
        //Ejecuta si seleccionas el archivo y es valido
        if (getExention(file)) {
          setRegisters([]);
          setProducts([]);
          setFileReader(file.name);
          reader.readAsBinaryString(file);
        } else {
          //Si no es valido manda alert y limpia file
          alert(`El tipo de archivo debe ser .cvs`);
          setFile("");
          setFileReader("");
          return;
        }
      } else {
        //Ejecuta si das cancelar
        setRegisters([]);
        setProducts([]);
        setFile("");
        setFileReader("");
        return;
      }

      setExistRegisters(true);

      reader.onload = (event) => {
        const bstr = event.target?.result;
        const workBook = XLSX.read(bstr, { type: "binary" });
        const workSheetName = workBook.SheetNames[0];
        const workSheet = workBook.Sheets[workSheetName];
        const fileData = XLSX.utils.sheet_to_json(workSheet, { header: 1 });
        const headers = ["COR", "COD", "PRODUCTO", "COD_BARRA"];

        const formatIsInValid = fileData.some((x: any) => x.length === 0);
        let myArray: any[] = [];

        if (formatIsInValid) {
          console.log("formato incorrecto");
          //USAR LA FORMA 2
          const groupedArray: any[] = [];
          const groupSize = 2;
          const clearArray = fileData
            .map((a: any) => {
              return a.map((b) => {
                return b.replace(/"/g, "").trim().split(",");
              });
            })
            .filter((x) => x.length > 0);

          for (let i = 0; i < clearArray.length; i += groupSize) {
            const group = clearArray.slice(i, i + groupSize).flat();
            const combinedArray: any = group.reduce(
              (acc, curr) => acc.concat(curr),
              []
            );
            groupedArray.push(combinedArray);
          }

          myArray = groupedArray
            .map((row: any, i) => {
              return [
                i + 1,
                Number(row[16 + 1]),
                fixEncoding(row[17 + 1]),
                row[21 + 1] === undefined ? 0 : row[21 + 1],
              ];
            })
            .slice(0, -1);

          //myArray = [];
        } else {
          console.log("formato correcto");
          //USAR LA FORMA 1
          myArray = fileData
            .map((row: any, i) => {
              return [
                i + 1,
                row[16],
                fixEncoding(row[17]),
                row[21] === undefined ? 0 : row[21],
              ];
            })
            .slice(0, -1);
        }

        setRegisters(convertToJson(headers, myArray));
      };

      setTimeout(() => {
        setExistRegisters(false);
      }, 1000);
    }

    // if (fileList) {
    //   const file = fileList[0];

    //   setFile(e.target.value);

    //   const reader = new FileReader();
    //   reader.onload = (event) => {
    //     //parse data

    //     const bstr = event.target?.result;

    //     const workBook = XLSX.read(bstr, { type: "binary" });

    //     //get first sheet
    //     const workSheetName = workBook.SheetNames[0];

    //     const workSheet = workBook.Sheets[workSheetName];

    //     //convert to array
    //     const fileData = XLSX.utils.sheet_to_json(workSheet, { header: 1 });
    //     //console.log(fileData.flat());

    //     const headers = ["COR", "COD", "PRODUCTO", "COD_BARRA"];

    //     //SEGUNDA FORMA
    //     if (countPrint === 1) {
    //       const groupedArray = [];
    //       const groupSize = 2;

    //       const xa = fileData
    //         .map((valor) => {
    //           return valor.map((b) => {
    //             return b.replace(/"/g, "").trim().split(",");
    //           });
    //           //.flat();
    //           //  return valor[i].replace(/"/g, "").trim();
    //         })
    //         .filter((x) => x.length > 0);

    //       for (let i = 0; i < xa.length; i += groupSize) {
    //         const group = xa.slice(i, i + groupSize).flat();
    //         const combinedArray = group.reduce(
    //           (acc, curr) => acc.concat(curr),
    //           []
    //         );
    //         groupedArray.push(combinedArray);
    //       }

    //       const cleanedData2 = groupedArray
    //         .map((row: any, i) => {
    //           return [
    //             i + 1,
    //             Number(row[16 + 1]),
    //             fixEncoding(row[17 + 1]),
    //             row[21 + 1] === undefined ? 0 : row[21 + 1],
    //           ];
    //         })
    //         .slice(0, -1);
    //       console.log(cleanedData2);
    //       return setRegisters(convertToJson(headers, cleanedData2));
    //     }

    //     // Carga registro forma 1
    //     // Eliminar las partes no deseadas
    //     const cleanedData = fileData
    //       .map((row: any, i) => {
    //         return [
    //           i + 1,
    //           row[16],
    //           fixEncoding(row[17]),
    //           row[21] === undefined ? 0 : row[21],
    //         ];
    //       })
    //       .slice(0, -1);
    //     // console.log(cleanedData);

    //     //setColDefs(heads)

    //     //removing header
    //     //fileData.splice(0, 1);

    //     setRegisters(convertToJson(headers, cleanedData));
    //   };

    //   if (file) {
    //     if (getExention(file)) {
    //       reader.readAsBinaryString(file);
    //     } else {
    //       alert(
    //         `Archivo invalido. Importa archivos excel de tipo ${EXTENSIONS}. Puedes usar como ejemplo el archivo de "Descargar formato"`
    //       );
    //       //cancelXML();
    //     }
    //   }
    // }
  };

  // const onSubtmitRevalid = () => {
  //   console.log("onSubtmitRevalid");
  //   if (fileInputRef.current) {
  //     const selectedFile = fileInputRef.current.files[0];
  //     // Realiza las operaciones deseadas en el archivo seleccionado
  //     console.log("Archivo seleccionado:", selectedFile);

  //     const changeEvent = new Event("change", { bubbles: true });
  //     console.log(changeEvent);
  //     fileInputRef.current.dispatchEvent(changeEvent);
  //     onSubmitXML();
  //   }
  // };

  // const onSubmitXML = async () => {
  //   setCountPrint(1);
  //   setLoadingCargando(true);
  //   setShowAlert1(false);
  //   setShowAlert2(false);
  //   setShowAlert3(false);
  //   setMessage(initialState);
  //   setMessage2(initialState);
  //   setMessage3(initialState);

  //   setTimeout(() => {
  //     const errors: Product[] = [];

  //     //guarda los que no tienen errores de types
  //     const filterTypes: any[] = registers
  //       .map((product) => (isNaN(product.COD) ? errors.push(product) : product))
  //       .filter((err) => typeof err === "object");

  //     //muestra mensaje de los productos con errores
  //     if (errors.length > 0) {
  //       setError(true);
  //       cancelXML();
  //       setShowAlert1(true);
  //       setMessage({
  //         type: "bg-red-600 text-white border-red-600",
  //         message: (
  //           <>
  //             <span>
  //               Se han encontrado registros con errores. Posiblemente no estas
  //               ingresando el formato indicado que requiere el sistema.
  //               Aplicaremos otro formato{" "}
  //               <strong>Intenta analizando otra vez.</strong> haciendo click en
  //               "Volver a cargar registros"
  //             </span>
  //             {/* {
  //               <ul>
  //                 {errors.map((err, i) => (
  //                   <li key={i + 1}>
  //                     Producto{err.COD}: {err.PRODUCTO}
  //                   </li>
  //                 ))}
  //               </ul>
  //             } */}
  //           </>
  //         ),
  //       });
  //       setLoadingCargando(false);
  //       return;
  //     }

  //     const productsEquals: any[] = [];
  //     const productsAdds: any[] = [];

  //     //de los productos filtrados correctamente se formatea con el cod del area
  //     const formatFiltersTypes = filterTypes.map((format: Product) => {
  //       return {
  //         ...format, //{cod_internal: '679xxxxcc'}
  //         COD: format.COD,
  //       };
  //     });

  //     //busca los existentes de lo formateado con los productos ya registrados
  //     products.filter((product) => {
  //       formatFiltersTypes.map((format) => {
  //         if (format.COD === product.COD) {
  //           productsEquals.push(format);
  //         }
  //       });
  //     });

  //     //busca los registros nuevos pero aun esta con el formato
  //     //{cod_internal: '679xxxxcc'}
  //     formatFiltersTypes.filter((product) => {
  //       if (!productsEquals.includes(product)) {
  //         productsAdds.push(product);
  //       }
  //     });

  //     //quitando el formato {cod_internal: '679xxxxcc'} a {cod_internal: 'xxxxcc'}
  //     const noCodeToAdd = productsAdds.map((add: Product) => {
  //       return {
  //         ...add,
  //         COD: add.COD,
  //       };
  //     });

  //     if (productsEquals.length > 0) {
  //       const updatedProducts = productsEquals.map((product) => product);
  //       setProducts(updatedProducts);
  //       // setShowAlert2(true);
  //       // setMessage2({
  //       //   type: "bg-yellow-300 border-yellow-600",
  //       //   message: (
  //       //     <>
  //       //       Se han encontrado {productsEquals.length} producto(s) que ya se
  //       //       encuentran registrado(s). Quieres{" "}
  //       //       <strong>
  //       //         ¿Volver a registrar de todas formas? (Esto actualizará los
  //       //         productos con los mismos datos de tu excel que estas
  //       //         ingresandos).
  //       //       </strong>{" "}
  //       //       Si solo quieres actualizar una parte en especifico del producto.
  //       //       Por favor seleccione el producto de la tabla directamente.{" "}
  //       //       <button
  //       //         className="bg-blue-500 px-4 py-2 text-white"
  //       //         onClick={() => onSubmitXMLTwo(productsEquals)}
  //       //       >
  //       //         Actualizar de todas formas
  //       //       </button>{" "}
  //       //       <button
  //       //         className="bg-red-500 px-4 py-2 text-white"
  //       //         onClick={cancelXML}
  //       //       >
  //       //         Cancelar
  //       //       </button>
  //       //     </>
  //       //   ),
  //       // });
  //     }

  //     if (noCodeToAdd.length > 0) {
  //       const updatedProducts = noCodeToAdd.map((product) => product);
  //       setProducts([...products, ...updatedProducts]);

  //       // for (let i = 0; i < noCodeToAdd.length; i++) {
  //       //   const product = noCodeToAdd[i];
  //       //   setProducts([...products, ...noCodeToAdd[i]]);
  //       //   //await postCreateProduct(product);
  //       //   setShowAlert3(true);
  //       //   setMessage3({
  //       //     type: "bg-green-600 text-white border-green-600",
  //       //     message: `Se han agregado ${noCodeToAdd.length} productos con éxito.`,
  //       //   });
  //       // }

  //       //RECARGAR
  //       //listProducts();
  //     }

  //     setLoadingCargando(false);
  //   }, 1000);
  // };

  // const onSubmitXMLTwo = async (array: any[]) => {
  //   for (let i = 0; i < array.length; i++) {
  //     const product = {
  //       ...array[i],
  //       xmls: true,
  //     };
  //     //setProducts([...products, ...product]);
  //     //await postCreateProduct(product);
  //     setMessage2({
  //       type: "bg-green-600 text-white border-green-600",
  //       message: (
  //         <>
  //           <span>{array.length} producto(s) actualizado(s) con éxito.</span>
  //           <ul>
  //             {array.map((arr: Product, i) => (
  //               <li key={i + 1}>
  //                 Producto{arr.COD}: {arr.PRODUCTO}
  //               </li>
  //             ))}
  //           </ul>
  //         </>
  //       ),
  //     });
  //   }

  //   //RECARGAR
  //   //listProducts();
  // };

  const handlePrint = useReactToPrint({
    content: () => refBardcode.current,
  });

  return (
    <>
      <ListaImpresion
        data={watch()}
        setValue={setValue}
        open={openLista}
        handleClose={handleCloseLista}
      />
      <VistaPrevia open={open} handleClose={handleClose} />
      <div className="flex h-full flex-col">
        <div
          className={`w-full flex ${
            (watch("selects") || []).length > 0
              ? "justify-between"
              : "justify-end"
          }`}
        >
          {(watch("selects") || []).length > 0 && (
            <a
              className="cursor-pointer underline text-green-600 flex"
              onClick={handleClickOpenLista}
            >
              Lista de seleccionados para imprimir{" "}
              {(watch("selects") || []).length > 0 && (
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
              )}
            </a>
          )}
          {/* <CSVLink
            className="float-right underline"
            data={FORMATO_IMPORTACION}
            headers={CABECERA_FORMATO_IMPORTACION}
            filename="formato.csv"
            target="_blank"
            separator={";"}
          >
            Descargar formato
          </CSVLink> */}
          <a className="cursor-pointer underline" onClick={handleClickOpen}>
            Modelo de impresión
          </a>
        </div>
        <div className="flex border flex-row h-full w-full">
          <div className="w-1/4 border-r flex flex-col h-full">
            <div className="w-full flex flex-col h-full">
              {showAlert1 && (
                <div className={`border ${message.type} p-2 rounded-md m-2`}>
                  {message.message}
                </div>
              )}
              {showAlert2 && (
                <div className={`border ${message.type2} p-2 rounded-md m-2`}>
                  {message2.message}
                </div>
              )}
              {showAlert3 && (
                <div className={`border ${message.type3} p-2 rounded-md m-2`}>
                  {message3.message}
                </div>
              )}

              <div
                className={`flex flex-col gap-2 ${
                  productsFiltered.length > 0 ? "border-b" : ""
                }`}
              >
                <div
                  className={`flex justify-center text-center ${
                    showAlert1 || showAlert2 || showAlert3 ? "" : "mt-10"
                  }`}
                >
                  <label
                    htmlFor="id-import"
                    className="underline cursor-pointer"
                  >
                    Importar productos{fileReader ? `(${fileReader})` : ``}
                    <input
                      type="file"
                      id="id-import"
                      className="hidden"
                      onChange={handleChangeImport}
                      value={file}
                      ref={fileInputRef}
                    />
                  </label>
                </div>

                <div className="flex justify-center mt-10">
                  <label className="text-[24px] text-center text-black">
                    {existRegisters
                      ? "Buscando registros..."
                      : registers.length > 0
                      ? loadingCargando
                        ? `Analizando registros...`
                        : registersAnalizados
                        ? `${registers.length} registros analizados`
                        : `${registers.length} registros encontrados`
                      : file
                      ? "No se encontraron registros"
                      : ""}
                  </label>
                </div>

                {registers.length > 0 && !existRegisters && (
                  <button
                    onClick={cargar}
                    disabled={loadingCargando}
                    className={`cursor-pointer border ${
                      loadingCargando
                        ? "bg-slate-400"
                        : "bg-default hover:bg-slate-400"
                    }  text-white py-2 px-4 rounded-md mt-10 mx-10 mb-10`}
                  >
                    {loadingCargando ? (
                      <div className="flex justify-center cursor-pointer">
                        <AiOutlineLoading3Quarters className="animate-spin h-[24px] w-[24px]" />
                      </div>
                    ) : (
                      <label className="cursor-pointer">
                        Cargar archivo
                        {/* {countPrint === 0 && "Cargar registros"}
                        {countPrint === 1 && "Volver a cargar registros"} */}
                      </label>
                    )}
                  </button>
                )}
              </div>

              {/* IMPRIMIR */}

              <div className="h-full flex_[1_0_100%] flex flex-col">
                {products.length > 0 && (
                  <>
                    <div className="">
                      <div className="flex ml-2 mt-2">
                        <label className="flex gap-2">
                          Filas por página:
                          <select
                            {...register("imp_lote", {
                              value: 10,
                              onChange: (e) => {
                                setPage(1);
                                _DATA.jump(1);
                              },
                            })}
                            className="border outline-none cursor-pointer"
                          >
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={30}>30</option>
                            <option value={40}>40</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                          </select>
                        </label>
                      </div>

                      <div className="flex ml-2 mt-2">
                        <label className="flex gap-2">
                          Columnas a imprimir:
                          <select
                            {...register("column_imp", {
                              value: 2,
                            })}
                            className="border outline-none cursor-pointer"
                          >
                            <option value={1}>1</option>
                            <option value={2}>2</option>
                          </select>
                        </label>
                      </div>
                    </div>

                    <div className="flex flex-col flex_[1_0_100%] h-full relative">
                      <div className="fixed w-[calc(25%-91px)] bottom-[30px] left-[60px] flex justify-center">
                        <button
                          onClick={handlePrint}
                          className={`${
                            (watch("selects") || []).length > 0
                              ? "bg-blue-700 hover:bg-blue-400"
                              : "bg-blue-400"
                          } border text-white py-2 px-4 w-full rounded-md`}
                          disabled={
                            (watch("selects") || []).length > 0 ? false : true
                          }
                        >
                          Imprimir
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* )} */}
            </div>
          </div>

          {products.length > 0 && (
            <div className="w-[calc(100%-25%)] flex flex-col h-full">
              <div className="flex justify-between">
                <label className="flex gap-2 items-end">
                  <input
                    {...register("buscador", {
                      onChange: (e) => {
                        //const value = e.target.value.trim() as string;
                        setPage(1);
                        _DATA.jump(1);
                      },
                    })}
                    autoFocus
                    className="border outline-none pl-2 w-[400px] ml-2 mt-2"
                    type="text"
                    placeholder="Buscar producto"
                  />
                  Total {productsFiltered.length} productos
                </label>
                <Pagination
                  className="mt-2 mr-1"
                  count={count}
                  size="large"
                  page={page}
                  variant="outlined"
                  shape="rounded"
                  onChange={handleChange}
                />
              </div>
              <div className="border mx-2 my-2">
                <TableContainer component={Paper}>
                  <Table size="small" aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell>#</TableCell>
                        <TableCell align="left">CODIGO</TableCell>
                        <TableCell align="left">PRODUCTO</TableCell>
                        <TableCell align="left">CODIGO BARRA</TableCell>
                        <TableCell align="center">
                          <label className="flex flex-col">
                            SELECCIONAR{" "}
                            {/* <input
                              checked={watch(`checkall_${page}`) ?? false}
                              {...register(`checkall_${page}`, {
                                value: false,
                                onChange: (e) => {
                                  const checked = e.target.checked;
                                  const allSelects = _DATA.currentData();

                                  if (checked) {
                                    setValue("selects", [
                                      ...(watch("selects") || []),
                                      ...allSelects,
                                    ]);
                                  } else {
                                    const test = watch("selects").slice(
                                      page - 1,
                                      watch("imp_lote")
                                    );

                                    const test2 = watch("selects");
                                    //setValue("selects", []);
                                    console.log(test2);
                                    console.log(test);
                                  }
                                },
                              })}
                              type="checkbox"
                            /> */}
                          </label>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {_DATA.currentData().map((a, i) => {
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

                              {/* <input */}
                              {/* type="text" */}
                              {/* value={watch(String("barcode_" + a.COD))} */}
                              {/* className={`outline-none cursor-pointer`} */}
                              {
                                /* {...register(String("barcode_" + a.COD), { */
                                //   value: a.COD_BARRA.padStart(15, "0"),
                                //   pattern: {
                                //     value: /^\d{15}$/,
                                //     message:
                                //       "Los 15 caracteres deben ser numericos",
                                //   },
                                //   onChange: (e) => {
                                //     console.log(errors["barcode_" + a.COD]);
                                //     let value = e.target.value as string;
                                //     const regex = /^\d{15}$/;
                                //     if (value.length === 0) {
                                //       return setValue("barcode_" + a.COD, "0");
                                //     }
                                //     if (value.length > 15) {
                                //       value = value.slice(0, 15);
                                //       setValue("barcode_" + a.COD, value);
                                //     }
                                //     if (!regex.test(value)) {
                                //       console.log(regex.test(value));
                                //       return setError("barcode_" + a.COD, {
                                //         type: "custom",
                                //         message:
                                //           "Los 15 caracteres deben ser numericos",
                                //       });
                                //     } else {
                                //       clearErrors("barcode_" + a.COD);
                                //     }
                                //   },
                                // })}
                                // />
                              }
                            </TableCell>
                            <TableCell align="center">
                              <input
                                checked={(watch("selects") || []).some(
                                  (x) => x.COR === a.COR
                                )}
                                className="cursor-pointer"
                                {...register(`select_${a.COR}`, {
                                  value: false,
                                  onChange: (e) => {
                                    const checked = e.target.checked;
                                    const selected = _DATA.currentData()[i];
                                    if (checked) {
                                      // Si el checkbox está marcado, agrega el elemento seleccionado a "selects"
                                      setValue("selects", [
                                        ...(watch("selects") || []),
                                        selected,
                                      ]);
                                    } else {
                                      // Si el checkbox está desmarcado, remueve el elemento seleccionado de "selects"
                                      setValue(
                                        "selects",
                                        watch("selects").filter(
                                          (item) => item.COR !== selected.COR
                                        )
                                      );
                                    }
                                  },
                                })}
                                type="checkbox"
                              />
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
              {/* 

            <table className="">
              <thead className="border-b">
                <tr>
                  <th className="border-r w-[40px]">#</th>
                  <th className="border-r">CODIGO</th>
                  <th className="border-r">PRODUCTO</th>
                  <th className="border-r">CODIGO BARRA</th>
                  <th>ESTADO IMP</th>
                </tr>
              </thead>
              <tbody>
                {productsFiltered.map((a, i) => {
                  return (
                    <tr key={i + 1} className="hover:bg-purple-400 border-b">
                      <td className="border-r text-center">{i + 1}</td>
                      <td className="border-r text-center">{a.COD}</td>
                      <td className="border-r pl-5">{a.PRODUCTO}</td>
                      <td className="border-r text-center">
                        <input
                          className="cursor-pointer"
                          {...register(String(a.COD), {
                            value: a.COD_BARRA.padStart(15, "0"),
                          })}
                        />
                      </td>
                      <td className="text-center">Pasado</td>
                    </tr>
                  );    
                })}
              </tbody>
            </table> 
            */}
              <div className="hidden">
                <div className="flex flex-col text-center" ref={refBardcode}>
                  {(watch("selects") || []).map((a, i) => {
                    return (
                      <div key={i + 1} className="flex">
                        <div className="page-break flex">
                          <BarCodeComponent
                            producto={a.PRODUCTO}
                            barcode={a.COD_BARRA.padStart(15, "0")}
                          />
                          {Number(watch("column_imp")) === 2 && (
                            <BarCodeComponent
                              producto={a.PRODUCTO}
                              barcode={a.COD_BARRA.padStart(15, "0")}
                            />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ProductScreen;

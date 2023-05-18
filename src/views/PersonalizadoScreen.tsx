import Barcode from "react-barcode";
import { useState, useRef } from "react";
import ReactToPrint from "react-to-print";
import { useForm } from "react-hook-form";

const PersonalizadoScreen = () => {
  const [disabled, setDisabled] = useState(false);
  const refBardcode = useRef(null);

  const { register, watch, setValue } = useForm({
    defaultValues: {
      column1: "000123456701239",
      column2: "",
      columns_ind: false,
      columns_imp: 1,
    },
  });

  return (
    <>
      <div className="flex w-full flex-col">
        {Number(watch("columns_imp")) === 1 || (
          <>
            <label className="flex gap-2 mb-4 items-center">
              Usar columnas individualmente:
              <input
                {...register("columns_ind", {
                  onChange: (e) => {
                    const value = e.target.checked;
                    if (value) {
                      setValue("column2", "000123456701888");
                    } else {
                      setValue("column2", "");
                    }
                  },
                })}
                type="checkbox"
              />
            </label>
          </>
        )}
        <div className="flex w-full gap-28">
          <div className="flex w-1/4 flex-col">
            <small>Columna 1</small>
            <label className="flex flex-col gap-2 mb-5">
              Escriba una cadena de texto:
              <input
                {...register("column1", {
                  onChange: (e) => {
                    const value = e.target.value;
                    if (value.length === 0) {
                      return setValue("column1", "000123456701239");
                    }
                  },
                })}
                className="border outline-none pl-1"
                autoFocus
                type="text"
              />
            </label>
          </div>
          {Number(watch("columns_imp")) === 2 && (
            <div className="flex w-1/4 flex-col">
              <small>Columna 2</small>
              <label className="flex flex-col gap-2 mb-5">
                Escriba una cadena de texto:
                <input
                  disabled={watch("columns_ind") === false ? true : false}
                  {...register("column2", {
                    onChange: (e) => {
                      const value = e.target.value;
                      if (value.length === 0) {
                        return setValue("column2", "000123456701888");
                      }
                    },
                  })}
                  className="border outline-none pl-1"
                  type="text"
                />
              </label>
            </div>
          )}
        </div>
      </div>
      <label className="flex gap-2 cursor-pointer" htmlFor="c_select">
        Columnas a imprimir:
        <select
          {...register("columns_imp")}
          className="border outline-none cursor-pointer"
        >
          <option value={1}>1</option>
          <option value={2}>2</option>
        </select>
      </label>
      <div className="flex flex-col text-center" ref={refBardcode}>
        <div className="flex">
          <div className="border w-[104mm] h-[50.8mm]">
            <div className="flex flex-col h-full overflow-hidden justify-center items-center">
              <strong>CORMAELECTRIC SAC</strong>
              <strong>NOMBRE DEL PRODUCTO</strong>
              <Barcode
                width={2}
                height={60}
                value={
                  watch("columns_ind") === true
                    ? watch("column1")
                    : watch("column1")
                }
              />
            </div>
          </div>

          {Number(watch("columns_imp")) === 2 && (
            <div className="border w-[104mm] h-[50.8mm]">
              <div className="flex flex-col h-full overflow-hidden justify-center items-center">
                <strong>CORMAELECTRIC SAC</strong>
                <strong>NOMBRE DEL PRODUCTO</strong>
                <Barcode
                  width={2}
                  height={60}
                  value={
                    watch("columns_ind") === true
                      ? watch("column2")
                      : watch("column1")
                  }
                />
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="w-full flex justify-center mt-10">
        <ReactToPrint
          trigger={() => (
            <button
              disabled={disabled}
              onClick={() => {
                setDisabled(true);
                setTimeout(() => {
                  setDisabled(false);
                }, 3000);
              }}
              className={`border px-5 outline-none  text-white rounded-md py-2 ${
                disabled ? "bg-blue-500" : "bg-blue-700"
              }`}
            >
              {disabled ? "Imprimiendo..." : "Imprimir"}
            </button>
          )}
          content={() => refBardcode.current}
        />
      </div>
    </>
  );
};

export default PersonalizadoScreen;

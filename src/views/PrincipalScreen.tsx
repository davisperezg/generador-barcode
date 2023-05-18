import { FiLogOut } from "react-icons/fi";
import { useState } from "react";

import { HOME, PERSONALIZADO, PRODUCTOS } from "../utils/const";
import BloquesScreen from "./BloquesScreen";
import Breadcrumb from "../components/Breadcrumb/Index";
import PersonalizadoScreen from "./PersonalizadoScreen";
import ProductScreen from "./ProductScreen";

const PrincipalScreen = () => {
  const [modulo, setModulo] = useState("Inicio");
  const [path, setPath] = useState(["Inicio"]);

  const handleBreadcrumb = (modulo: string, index: number) => {
    const newPath = path.slice(0, index + 1);
    setModulo(modulo);
    setPath(newPath);
  };

  const onClickModulo = (titulo: string) => {
    setModulo(titulo);
    setPath([...path, titulo]);
  };

  const Salir = () => {
    localStorage.removeItem("logged");
    window.location.reload();
  };

  return (
    <div className="flex flex-[1_1_100%] flex-col w-full">
      {/* HEADER */}
      <div className="flex flex-row h-[80px] bg-[url('./assets/fondo_login.jpg')] border-b justify-between">
        {/* <div className="">
          <h1>Logo</h1>
        </div>
        <div className="flex items-center pr-5">Navegacion</div> */}
        <div className="flex flex-row justify-center items-center w-full">
          <h1 className="text-[30px] font-serif">
            Generador de barras - Cormaelectric SAC
          </h1>
        </div>
      </div>

      <div className="px-5 py-2 bg-white flex items-center justify-between">
        <a className="cursor-pointer text-[#213547] text-[12px]">
          <strong>Bienvenida</strong>, Claribel
        </a>

        <label
          onClick={Salir}
          className="cursor-pointer text-red-600 flex items-center"
        >
          <FiLogOut />
          Salir
        </label>
      </div>
      <div className="pl-5 py-2 border bg-[#E9ECEF] flex items-center">
        <Breadcrumb
          rutas={path}
          handleBreadcrumb={handleBreadcrumb}
          modulo={modulo}
        />
      </div>
      {/* BODY ml-[10px]*/}
      <div className="p-5 flex-[1_1_100%]">
        {modulo === PRODUCTOS && <ProductScreen />}
        {/* {modulo === PERSONALIZADO && <PersonalizadoScreen />} */}
        {modulo === HOME && <BloquesScreen onClickModulo={onClickModulo} />}
      </div>
    </div>
  );
};

export default PrincipalScreen;

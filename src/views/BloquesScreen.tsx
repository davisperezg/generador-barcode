import Bloque from "../components/Modulos/Bloque";
import { BsFillCartFill } from "react-icons/bs";
import { BsFillBrushFill } from "react-icons/bs";

interface Props {
  onClickModulo: (modulo: string) => void;
}

const BloquesScreen = ({ onClickModulo }: Props) => {
  return (
    <div className="grid grid-cols-[repeat(4,_1fr)] gap-5">
      {/* BLOQUE */}
      <Bloque
        onClick={onClickModulo}
        titulo="Productos"
        icon={<BsFillCartFill className="text-iconsM text-[54px]" />}
      />

      {/* BLOQUE */}
      {/* <Bloque
        onClick={onClickModulo}
        titulo="Personalizado"
        colorBg="bg-blue-700"
        icon={<BsFillBrushFill className="text-iconsM text-[54px]" />}
      /> */}
    </div>
  );
};

export default BloquesScreen;

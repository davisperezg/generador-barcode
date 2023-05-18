import { ReactNode } from "react";

interface Props {
  icon: ReactNode;
  titulo: string;
  colorBg?: string;
  onClick: (titulo: string) => void;
}

const Bloque = ({
  icon,
  titulo,
  colorBg = "bg-purple-700",
  onClick,
}: Props) => {
  return (
    <div
      className={`cursor-pointer w-full ${colorBg} rounded-lg`}
      onClick={() => onClick(titulo)}
    >
      {/* HEADER BLOCK */}
      <div className="flex justify-center items-center py-5">{icon}</div>
      {/* FOOTER BLOCK */}
      <div className="flex justify-center mb-3">
        <label className="text-iconsTM text-[16px] font-bold cursor-pointer">
          {titulo}
        </label>
      </div>
    </div>
  );
};

export default Bloque;

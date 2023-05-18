import Barcode from "react-barcode";
interface Props {
  className?: string;
  empresa?: string;
  producto?: string;
  barcode?: string;
}

const BarCodeComponent = ({
  className = "border",
  empresa = "CORMAELECTRIC SAC",
  producto = "NOMBRE DEL PRODUCTO",
  barcode = "000123456701239",
}: Props) => {
  return (
    <div className={`${className} w-[104mm] h-[50.8mm]`}>
      <div className="flex flex-col h-full overflow-hidden justify-center items-center">
        <strong>{empresa}</strong>
        <strong>{producto}</strong>
        <Barcode width={2} height={60} value={barcode} />
      </div>
    </div>
  );
};

export default BarCodeComponent;

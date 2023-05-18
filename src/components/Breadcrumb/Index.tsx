import { HOME } from "../../utils/const";
import { AiFillHome } from "react-icons/ai";

interface Props {
  rutas: string[];
  handleBreadcrumb: (item: string, index: number) => void;
  modulo: string;
}

const Breadcrumb = ({ rutas, handleBreadcrumb, modulo }: Props) => {
  return (
    <>
      {rutas.map((item, index) => {
        return (
          <div className="flex items-center" key={index}>
            {item === HOME && <AiFillHome className="mr-1" />}
            <a
              className={`${
                item === modulo
                  ? "text-textLink"
                  : "cursor-pointer hover:underline"
              }`}
              onClick={() => handleBreadcrumb(item, index)}
            >
              {item}
            </a>
            <span
              className={`${
                rutas.length === 1
                  ? ""
                  : `text-textLink ${
                      item === modulo ? "" : "after:mx-1 after:content-['/']"
                    }`
              }`}
            ></span>
          </div>
        );
      })}
    </>
  );
};

export default Breadcrumb;

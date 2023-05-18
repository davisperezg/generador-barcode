import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const LoginScreen = () => {
  const [logged, setLogged] = useState(false);

  const {
    watch,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = (data, e) => {
    const mi_usu = import.meta.env.VITE_USERNAME;
    const mi_pass = import.meta.env.VITE_PASSWORD;
    const { username, password } = data;
    if (username === mi_usu && password === mi_pass) {
      setLogged(false);
      localStorage.setItem("logged", "true");
      window.location.reload();
    } else {
      setLogged(true);
    }
  };

  useEffect(() => {
    if (logged === true) {
      alert("Usuario y/o contraseña incorrecta");
    }
  }, [logged]);

  return (
    <div className="flex flex-[1_0_100%] bg-[url('./assets/fondo_login.jpg')]">
      <div className="flex justify-center items-center flex-col w-full px-10">
        <div className="border rounded-md bg-[#E8E8E8] w-11/12 h-auto overflow-hidden">
          <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
            {/* HEADER LOGIN */}
            <div className="w-full bg-[#5A626F] h-[80px] flex justify-center items-center">
              <h1 className="text-[24px] text-white font-bold">
                CORMAELECTRIC SAC
              </h1>
            </div>
            {/* BODY LOGIN */}
            <div className="flex flex-col mb-10">
              <div className="flex flex-row mx-2 mt-10 gap-5">
                <label className="w-1/3 text-[13px]">Usuario:</label>
                <input
                  {...register("username", {
                    required: {
                      value: true,
                      message: "Ingrese usuario",
                    },
                  })}
                  type="text"
                  className={`
                  w-1/2 outline-none pl-1 rounded-sm text-[13px]
                  ${errors.username && "border border-red-600"} 
                  `}
                />
                {errors.username && (
                  <span className="text-red-600">
                    {errors.username.message}
                  </span>
                )}
              </div>

              <div className="flex flex-row mx-2 mt-2 gap-5">
                <label className="w-1/3 text-[13px]">Contraseña:</label>
                <input
                  {...register("password", {
                    required: {
                      value: true,
                      message: "Ingrese contraseña",
                    },
                  })}
                  type="password"
                  className={`
                  w-1/2 outline-none pl-1 rounded-sm text-[13px]
                  ${errors.password && "border border-red-600"} 
                  `}
                />
                {errors.password && (
                  <span className="text-red-600">
                    {errors.password.message}
                  </span>
                )}
              </div>

              <div className="flex flex-row mx-2 mt-10 justify-center">
                {/* border border-[#5A626F] */}
                <button
                  type="submit"
                  className="bg-[#F2F2F2] p-1 px-2 rounded-sm hover:bg-[#E5E5E5]"
                >
                  Ingresar
                </button>
              </div>
            </div>
            {/* FOOTER LOGIN */}
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;

import Image from "next/image";

export default function Home() {
  return (
    <>
      <Image
        src={"/background.jpg"}
        layout="fill"
        objectFit="cover"
        alt="Background"
      />
      <div className="absolute top-1/2 left-1/2 z-30 w-80 -translate-x-1/2 -translate-y-1/2 flex flex-col rounded-lg bg-white p-6 drop-shadow-lg">
        <div className="flex flex-col gap-6 items-center">
          <Image src={"/logo.png"} width={90} height={90} alt="Logo" />
          <p className="text-xl font-semibold">Bienvenido</p>
          <div className="flex flex-col gap-2">
            <label className="text-black text-sm font-bold">Usuario</label>
            <input
              type="text"
              className="focus:shadow-outline w-64 appearance-none rounded-lg border px-2 py-1 leading-tight text-gray-700 focus:outline-none"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-black text-sm font-bold">Contraseña</label>
            <input
              type="password"
              className="focus:shadow-outline w-64 appearance-none rounded-lg border px-2 py-1 leading-tight text-gray-700 focus:outline-none"
              required
            />
          </div>
          <button className="w-64 rounded-lg border bg-[#707070] px-4 py-2 text-base font-semibold text-white hover:text-white hover:bg-[#9F9F9F] hover:border-transparent">
            Iniciar sesión
          </button>
          <div className="flex items-center w-64 my-3">
            <div className="flex-grow h-px bg-gray-300"></div>
            <span className="mx-4 text-gray-400 text-sm font-light">o</span>
            <div className="flex-grow h-px bg-gray-300"></div>
          </div>

          <div className="flex flex-col gap-4">
            <button
              onClick={() => {
                window.location.href =
                  "https://accounts.google.com/o/oauth2/v2/auth?redirect_uri=https://enrollment-unmsm-379762c4b258.herokuapp.com/grant-code&response_type=code&client_id=911851558763-tkev88gg88t3g0387qpvbktlu4beok1t.apps.googleusercontent.com&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile+openid&access_type=offline";
              }}
              className="w-64 rounded-lg border bg-[#C43E1C] px-4 py-2 text-base font-semibold text-white hover:text-white hover:bg-[#D77E67] hover:border-transparent"
            >
              Google
            </button>
            <button className="w-64 rounded-lg border bg-[#1199D3] px-4 py-2 text-base font-semibold text-white hover:text-white hover:bg-[#60BBE1] hover:border-transparent">
              Facebook
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

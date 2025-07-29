import Image from "next/image";
import { useRouter } from "next/router";

import Link from "next/link";

import SignOut from "./signout-button";

export default function NavBar() {
  // Usar el router para obtener la ruta actual
  const router = useRouter();

  // Función para aplicar el color activo cuando estamos en la página correspondiente
  const isActive = (pathname: string) => router.pathname === pathname;

  return (
    <nav
      className={`fixed inset-x-0 bottom-0 z-10 p-1 border-t border-gray-200 flex flex-row bg-white justify-evenly items-center md:rounded-lg md:drop-shadow-lg md:justify-normal md:items-stretch md:static md:flex md:flex-col md:h-full md:border-0 md:gap-8 md:pt-8 md:px-4`}
    >
      <div className="hidden md:w-full md:flex md:flex-row md:justify-center">
        <Image src="/logo.png" width={75} height={75} alt="Logo" />
      </div>

      <Link
        href={"/dashboard/products"}
        className="flex flex-col items-center md:flex md:flex-row md:gap-1"
      >
        <svg
          viewBox="0 0 512 512"
          className={`h-8 w-8 cursor-pointer p-1.5 ${
            isActive("/dashboard/products") ? "fill-sky-500" : "fill-gray-500"
          }`}
        >
          <path d="M0 24C0 10.7 10.7 0 24 0H69.5c22 0 41.5 12.8 50.6 32h411c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3H170.7l5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5H488c13.3 0 24 10.7 24 24s-10.7 24-24 24H199.7c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5H24C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z" />
        </svg>
        <p
          className={`text-sm cursor-pointer ${
            isActive("/dashboard/products") ? "text-sky-500" : "text-gray-500"
          }`}
        >
          Productos
        </p>
      </Link>

      <Link
        href={"/dashboard/reports"}
        className="flex flex-col items-center md:flex md:flex-row md:gap-1"
      >
        <svg
          viewBox="0 0 640 512"
          className={`h-8 w-8 cursor-pointer p-1.5 ${
            isActive("/dashboard/reports") ? "fill-sky-500" : "fill-gray-500"
          }`}
        >
          <path d="M32 32c17.7 0 32 14.3 32 32V400c0 8.8 7.2 16 16 16H480c17.7 0 32 14.3 32 32s-14.3 32-32 32H80c-44.2 0-80-35.8-80-80V64C0 46.3 14.3 32 32 32zM160 224c17.7 0 32 14.3 32 32v64c0 17.7-14.3 32-32 32s-32-14.3-32-32V256c0-17.7 14.3-32 32-32zm128-64V320c0 17.7-14.3 32-32 32s-32-14.3-32-32V160c0-17.7 14.3-32 32-32s32 14.3 32 32zm64 32c17.7 0 32 14.3 32 32v96c0 17.7-14.3 32-32 32s-32-14.3-32-32V224c0-17.7 14.3-32 32-32zM480 96V320c0 17.7-14.3 32-32 32s-32-14.3-32-32V96c0-17.7 14.3-32 32-32s32 14.3 32 32z" />
        </svg>
        <p
          className={`text-sm cursor-pointer ${
            isActive("/dashboard/reports") ? "text-sky-500" : "text-gray-500"
          }`}
        >
          Reportes
        </p>
      </Link>

      <Link
        href={"/dashboard/users"}
        className="flex flex-col items-center md:flex md:flex-row md:gap-1"
      >
        <svg
          viewBox="0 0 512 512"
          className={`h-8 w-8 cursor-pointer p-1.5 ${
            isActive("/dashboard/users") ? "fill-sky-500" : "fill-gray-500"
          }`}
        >
          <path d="M399 384.2C376.9 345.8 335.4 320 288 320H224c-47.4 0-88.9 25.8-111 64.2c35.2 39.2 86.2 63.8 143 63.8s107.8-24.7 143-63.8zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm256 16a72 72 0 1 0 0-144 72 72 0 1 0 0 144z" />
        </svg>
        <p
          className={`text-sm cursor-pointer ${
            isActive("/dashboard/users") ? "text-sky-500" : "text-gray-500"
          }`}
        >
          Usuarios
        </p>
      </Link>

      <SignOut />
    </nav>
  );
}

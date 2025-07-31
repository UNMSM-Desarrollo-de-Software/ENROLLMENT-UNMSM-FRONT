import Image from "next/image";
import { useRouter } from "next/router";
import Link from "next/link";

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
        href={"/dashboard/"}
        className="flex flex-col items-center md:flex md:flex-row md:gap-1"
      >
        <svg
          viewBox="0 0 640 640"
          className={`h-8 w-8 cursor-pointer p-1.5 ${
            isActive("/dashboard/") ? "fill-sky-500" : "fill-gray-500"
          }`}
        >
          <path d="M80 259.8L289.2 345.9C299 349.9 309.4 352 320 352C330.6 352 341 349.9 350.8 345.9L593.2 246.1C602.2 242.4 608 233.7 608 224C608 214.3 602.2 205.6 593.2 201.9L350.8 102.1C341 98.1 330.6 96 320 96C309.4 96 299 98.1 289.2 102.1L46.8 201.9C37.8 205.6 32 214.3 32 224L32 520C32 533.3 42.7 544 56 544C69.3 544 80 533.3 80 520L80 259.8zM128 331.5L128 448C128 501 214 544 320 544C426 544 512 501 512 448L512 331.4L369.1 390.3C353.5 396.7 336.9 400 320 400C303.1 400 286.5 396.7 270.9 390.3L128 331.4z" />
        </svg>

        <p
          className={`text-sm cursor-pointer ${
            isActive("/dashboard/") ? "text-sky-500" : "text-gray-500"
          }`}
        >
          Matrícula
        </p>
      </Link>

      <Link
        href={"/dashboard/fee"}
        className="flex flex-col items-center md:flex md:flex-row md:gap-1"
      >
        <svg
          viewBox="0 0 640 512"
          className={`h-8 w-8 cursor-pointer p-1.5 ${
            isActive("/dashboard/fee") ? "fill-sky-500" : "fill-gray-500"
          }`}
        >
          <path d="M24 48C10.7 48 0 58.7 0 72C0 85.3 10.7 96 24 96L69.3 96C73.2 96 76.5 98.8 77.2 102.6L129.3 388.9C135.5 423.1 165.3 448 200.1 448L456 448C469.3 448 480 437.3 480 424C480 410.7 469.3 400 456 400L200.1 400C188.5 400 178.6 391.7 176.5 380.3L171.4 352L475 352C505.8 352 532.2 330.1 537.9 299.8L568.9 133.9C572.6 114.2 557.5 96 537.4 96L124.7 96L124.3 94C119.5 67.4 96.3 48 69.2 48L24 48zM208 576C234.5 576 256 554.5 256 528C256 501.5 234.5 480 208 480C181.5 480 160 501.5 160 528C160 554.5 181.5 576 208 576zM432 576C458.5 576 480 554.5 480 528C480 501.5 458.5 480 432 480C405.5 480 384 501.5 384 528C384 554.5 405.5 576 432 576z" />
        </svg>
        <p
          className={`text-sm cursor-pointer ${
            isActive("/dashboard/fee") ? "text-sky-500" : "text-gray-500"
          }`}
        >
          Mensualidad
        </p>
      </Link>
    </nav>
  );
}

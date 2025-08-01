import NavBar from "./navbar";

export default function Layout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/**Contenedo principal */}
      <div className="m-0 box-border h-screen w-screen border-0  bg-slate-200 md:flex md:flex-row md:gap-2 md:p-2">
        {/**Barra de menú */}
        <NavBar />
        {/* Contenedor principal ubicadó a la derecha del menú en dispositivos de pantalla grande y en toda la pantalla en móviles */}
        <div className="flex-1 overflow-auto p-6 flex flex-col gap-4 bg-white rounded-lg drop-shadow-lg md:p-12">
          {children}
        </div>
      </div>
    </>
  );
}

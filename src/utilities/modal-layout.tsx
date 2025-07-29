export default function ModalLayout({
  children,
  isOpen,
}: {
  children: React.ReactNode;
  isOpen: boolean;
}) {
  if (!isOpen) {
    return null; // No renderizar el modal si no está abierto
  }

  //Estilizado del fondo detrás del modal. Evita al usuario salirse del modal antes de elegir alguna opción
  const overlayClassName = isOpen
    ? 'fixed top-0 left-0 w-full h-full rounded-lg bg-gray-800 opacity-60 z-20'
    : 'hidden';
  <>
    {/* Fondo borroso y no interactivo */}
    <div className={overlayClassName}></div>
    <div className="absolute top-1/2 left-1/2 z-30 w-11/12 -translate-x-1/2 -translate-y-1/2 flex flex-col gap-2 rounded-lg bg-white p-6 drop-shadow-lg">
      {children}
    </div>
    ;
  </>;
}

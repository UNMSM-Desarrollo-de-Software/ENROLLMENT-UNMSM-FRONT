import { useState } from "react";

type Step = {
  label: string;
  completed: boolean;
  lockedWhenCompleted?: boolean;
};

export default function TrackingBar() {
  const [steps, setSteps] = useState<Step[]>([
    { label: "Selección de cursos", completed: false },
    { label: "Plan de pagos", completed: false },
    { label: "Carta de compromiso", completed: false },
    { label: "Pago de matrícula", completed: false, lockedWhenCompleted: true }, // <- no editable
    { label: "Constancia de matrícula", completed: false },
  ]);

  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const isLocked = (index: number) =>
    steps[index].completed && steps[index].lockedWhenCompleted;

  const markStepCompleted = (index: number) => {
    setSteps((prev) =>
      prev.map((step, i) => (i === index ? { ...step, completed: true } : step))
    );
  };

  const stepContent: Record<number, JSX.Element> = {
    0: (
      <div>
        <h2 className="text-lg font-semibold mb-2">Selección de cursos</h2>
        <input
          type="text"
          placeholder="Curso elegido"
          className="border p-2 rounded w-full"
        />
        <button
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded"
          onClick={() => markStepCompleted(0)}
        >
          Confirmar selección
        </button>
      </div>
    ),
    1: (
      <div>
        <h2 className="text-lg font-semibold mb-2">Plan de pagos</h2>
        <input
          type="number"
          className="border p-2 rounded w-full"
          placeholder="Cuotas"
        />
        <button
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded"
          onClick={() => markStepCompleted(1)}
        >
          Confirmar plan
        </button>
      </div>
    ),
    2: (
      <div>
        <h2 className="text-lg font-semibold mb-2">Carta de compromiso</h2>
        <textarea
          className="w-full border p-2 rounded"
          placeholder="Texto..."
        />
        <button
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded"
          onClick={() => markStepCompleted(2)}
        >
          Confirmar carta
        </button>
      </div>
    ),
    3: (
      <div>
        <h2 className="text-lg font-semibold mb-2">Pago de matrícula</h2>
        <input
          type="text"
          placeholder="N° de comprobante"
          className="border p-2 rounded w-full"
          disabled={isLocked(3)}
        />
        <button
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50"
          onClick={() => markStepCompleted(3)}
          disabled={isLocked(3)}
        >
          Confirmar pago
        </button>
        {isLocked(3) && (
          <p className="text-red-600 mt-2 text-sm">
            Este paso ya no se puede modificar.
          </p>
        )}
      </div>
    ),
    4: (
      <div>
        <h2 className="text-lg font-semibold mb-2">Constancia de matrícula</h2>
        <p>Tu matrícula fue registrada.</p>
        <button
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded"
          onClick={() => markStepCompleted(4)}
        >
          Finalizar
        </button>
      </div>
    ),
  };

  return (
    <div className="w-full px-4 py-12">
      <div className="relative w-full">
        {/* Barra */}
        <div className="absolute top-[16px] left-0 w-full h-5 bg-[#D2D2D2] rounded-full z-0"></div>

        {/* Tracking bar */}
        <div className="flex justify-between items-start relative z-10">
          {steps.map((step, index) => {
            const isActive = index === activeIndex;

            return (
              <div
                key={index}
                className="flex flex-col items-center w-24 cursor-pointer"
                onClick={() => setActiveIndex(index)}
              >
                <div className="h-12 flex items-center justify-center">
                  <div
                    className={`w-10 h-10 rounded-full transition-colors duration-200 ${
                      isActive
                        ? "bg-[#956966]"
                        : step.completed
                        ? "bg-green-600"
                        : "bg-[#611E1A]"
                    }`}
                  ></div>
                </div>
                <span
                  className={`mt-2 text-center text-sm font-medium leading-tight transition-colors duration-200 ${
                    isActive ? "text-[#956966]" : "text-black"
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Contenido dinámico */}
      <div className="mt-10 p-6 bg-white border border-gray-200 rounded shadow-md min-h-[150px]">
        {activeIndex !== null ? (
          stepContent[activeIndex]
        ) : (
          <p className="text-gray-500 italic text-center">
            Selecciona una etapa del proceso.
          </p>
        )}
      </div>
    </div>
  );
}

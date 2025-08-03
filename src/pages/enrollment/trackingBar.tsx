import { useState } from "react";
import Step3_TuitionPayment from "./stepContent/Step3_TuitionPayment";
import { StepProps, CursoSeleccionado, PlanPagos } from "@/types";
import Step0_SelectCourses from "./stepContent/Step0_SelectCourses";
import Step1_PaymentPlan from "./stepContent/Step1_PaymentPlan";
import Step2_Commitment from "./stepContent/Step2_Commitment";
import Step4_Certificate from "./stepContent/Step4_Certificate";

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
    { label: "Pago de matrícula", completed: false, lockedWhenCompleted: true },
    { label: "Constancia de matrícula", completed: false },
  ]);

  const [activeIndex, setActiveIndex] = useState<number | null>(0);
  const [cursosSeleccionados, setCursosSeleccionados] = useState<
    CursoSeleccionado[]
  >([]);
  const [planPagos, setPlanPagos] = useState<PlanPagos | undefined>(undefined);

  const onCompleteStep = (index: number) => {
    setSteps((prev) =>
      prev.map((s, i) => (i === index ? { ...s, completed: true } : s))
    );
    setActiveIndex(index + 1 < steps.length ? index + 1 : null);
  };

  const handleSelectionChange = (seleccion: CursoSeleccionado[]) => {
    setCursosSeleccionados(seleccion);
  };

  const handlePlanChange = (plan: PlanPagos) => {
    setPlanPagos(plan);
  };

  const renderStepContent = (index: number) => {
    const stepProps: StepProps = {
      completed: steps[index].completed,
      locked:
        steps[index].completed && steps[index].lockedWhenCompleted === true,
      onComplete: () => onCompleteStep(index),
    };

    switch (index) {
      case 0:
        return (
          <Step0_SelectCourses
            {...stepProps}
            onSelectionChange={handleSelectionChange}
          />
        );
      case 1:
        return (
          <Step1_PaymentPlan
            {...stepProps}
            cursosSeleccionados={cursosSeleccionados}
            onPlanChange={handlePlanChange}
          />
        );
      case 2:
        return (
          <Step2_Commitment
            {...stepProps}
            cursosSeleccionados={cursosSeleccionados}
            planPagos={planPagos}
          />
        );

      case 3:
        return (
          <Step3_TuitionPayment
            {...stepProps}
            cursosSeleccionados={cursosSeleccionados}
            planPagos={planPagos}
          />
        );

      case 4:
        return (
          <Step4_Certificate
            {...stepProps}
            cursosSeleccionados={cursosSeleccionados}
            planPagos={planPagos}
            alumno={{
              nombre: "Juan Pérez",
              codigo: "20251234",
              carrera: "Ingeniería de Sistemas",
            }}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full px-4 py-12">
      {/* Barra de progreso */}
      <div className="relative w-full">
        <div className="absolute top-[14px] left-0 w-full h-[6px] bg-[#D2D2D2] rounded-full z-0"></div>

        <div className="flex justify-between items-center relative z-10">
          {steps.map((step, index) => {
            const isActive = index === activeIndex;
            const isCompleted = step.completed;

            return (
              <div
                key={index}
                className="flex flex-col items-center flex-1 cursor-pointer group"
                onClick={() => setActiveIndex(index)}
              >
                <div
                  className={`relative w-8 h-8 flex items-center justify-center rounded-full border-2 transition-all duration-300 ${
                    isCompleted
                      ? "bg-green-600 border-green-600"
                      : isActive
                      ? "bg-[#956966] border-[#956966]"
                      : "bg-[#611E1A] border-[#611E1A]"
                  }`}
                >
                  {isCompleted ? (
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2.5}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    <span className="text-white text-sm font-semibold">
                      {index + 1}
                    </span>
                  )}
                </div>

                <span className="mt-2 text-xs text-gray-700 group-hover:text-[#956966] transition-colors duration-200 font-medium">
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Contenido */}
      <div className="mt-12 px-6 py-8 bg-white border border-gray-200 rounded-2xl shadow-sm w-full transition-all duration-300">
        {activeIndex !== null ? (
          renderStepContent(activeIndex)
        ) : (
          <p className="text-center text-gray-400 italic">
            Proceso finalizado o sin selección activa.
          </p>
        )}
      </div>
    </div>
  );
}

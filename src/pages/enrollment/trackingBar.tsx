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
  const [cursosSeleccionados, setCursosSeleccionados] = useState<CursoSeleccionado[]>([]);
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
        return <Step0_SelectCourses {...stepProps} onSelectionChange={handleSelectionChange} />;
      case 1:
        return <Step1_PaymentPlan {...stepProps} cursosSeleccionados={cursosSeleccionados} onPlanChange={handlePlanChange} />;
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
            cursos={[
              {
                codigo: "CUR101",
                nombre: "Programación I",
                creditos: 4,
                docente: "Ing. Quispe",
                horarios: [
                  { dia: "Jueves", inicio: "10:00", fin: "12:00" },
                  { dia: "Viernes", inicio: "13:00", fin: "15:00" },
                ],
              },
              // otros cursos seleccionados...
            ]}
            cuotas={[
              { numero: 1, fecha: "2025-08-10", monto: 250 },
              { numero: 2, fecha: "2025-09-10", monto: 210 },
            ]}
            montoTotal={460}
          />
        );

      case 4:
        return (
          <Step4_Certificate
            {...stepProps}
            alumno={{
              nombre: "Juan Pérez",
              codigo: "20251234",
              carrera: "Ingeniería de Sistemas",
            }}
            cuotas={[
              { numero: 1, fecha: "2025-08-10", monto: 250 },
              { numero: 2, fecha: "2025-09-10", monto: 250 },
            ]}
            cursos={[
              {
                codigo: "CUR101",
                nombre: "Programación I",
                creditos: 4,
                docente: "Ing. Quispe",
                horarios: [
                  { dia: "Jueves", inicio: "10:00", fin: "12:00" },
                  { dia: "Viernes", inicio: "13:00", fin: "15:00" },
                ],
              },
              // otros cursos seleccionados...
            ]}
            montoTotal={500}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full px-4 py-12">
      {/* Barra horizontal */}
      <div className="relative w-full">
        <div className="absolute top-[16px] left-0 w-full h-5 bg-[#D2D2D2] rounded-full z-0"></div>

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
                    className={`w-10 h-10 rounded-full ${
                      isActive
                        ? "bg-[#956966]"
                        : step.completed
                        ? "bg-green-600"
                        : "bg-[#611E1A]"
                    }`}
                  ></div>
                </div>
                <span className="mt-2 text-center text-sm font-medium leading-tight">
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Contenido dinámico */}
      <div className="mt-10 p-6 bg-white border border-gray-200 rounded shadow-md w-full h-auto overflow-auto">
        {activeIndex !== null ? (
          renderStepContent(activeIndex)
        ) : (
          <p className="text-center text-gray-500 italic">
            Proceso finalizado o sin selección activa.
          </p>
        )}
      </div>
    </div>
  );
}

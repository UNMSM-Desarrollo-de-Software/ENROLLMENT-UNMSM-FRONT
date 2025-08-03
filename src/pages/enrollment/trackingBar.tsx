import { useState, useEffect } from "react";
import Step3_TuitionPayment from "./stepContent/Step3_TuitionPayment";
import { StepProps, CursoSeleccionado, PlanPagos } from "@/types";
import Step0_SelectCourses from "./stepContent/Step0_SelectCourses";
import Step1_PaymentPlan from "./stepContent/Step1_PaymentPlan";
import Step2_Commitment from "./stepContent/Step2_Commitment";
import Step4_Certificate from "./stepContent/Step4_Certificate";
import Layout from "../utils/layout";
import FormTitle from "../utils/formTitle";

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

  // Initialize from localStorage on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedEnrollment = localStorage.getItem('currentEnrollment');
        if (savedEnrollment) {
          const enrollment = JSON.parse(savedEnrollment);
          
          // Set active step and completed steps based on enrollment status
          if (enrollment.status === "2") {
            setActiveIndex(1); // Go to Step 1 (Payment Plan)
            setSteps(prev => prev.map((step, index) => ({
              ...step,
              completed: index === 0 // Mark Step 0 as completed
            })));
          } else if (enrollment.status === "3") {
            setActiveIndex(2); // Go to Step 2 (Commitment)
            setSteps(prev => prev.map((step, index) => ({
              ...step,
              completed: index <= 1 // Mark Steps 0-1 as completed
            })));
          } else if (enrollment.status === "4") {
            setActiveIndex(3); // Go to Step 3 (Payment)
            setSteps(prev => prev.map((step, index) => ({
              ...step,
              completed: index <= 2 // Mark Steps 0-2 as completed
            })));
          } else if (enrollment.status === "5") {
            setActiveIndex(4); // Go to Step 4 (Certificate)
            setSteps(prev => prev.map((step, index) => ({
              ...step,
              completed: index <= 3 // Mark Steps 0-3 as completed
            })));
          } else if (enrollment.status === "completed") {
            setActiveIndex(4); // Stay on Step 4 (Certificate)
            setSteps(prev => prev.map((step, index) => ({
              ...step,
              completed: true // Mark all steps as completed
            })));
          }
        }

        // Load other saved data
        const savedCourses = localStorage.getItem('selectedCourses');
        if (savedCourses) {
          setCursosSeleccionados(JSON.parse(savedCourses));
        }

        const savedPaymentPlan = localStorage.getItem('paymentPlan');
        if (savedPaymentPlan) {
          setPlanPagos(JSON.parse(savedPaymentPlan));
        }
      } catch (error) {
        console.error('Error loading enrollment data from localStorage:', error);
      }
    }
  }, []);

  const onCompleteStep = (index: number) => {
    // Update step completion
    setSteps((prev) =>
      prev.map((s, i) => (i === index ? { ...s, completed: true } : s))
    );

    // Move to next step
    const nextIndex = index + 1 < steps.length ? index + 1 : null;
    setActiveIndex(nextIndex);
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
    <Layout>
      <FormTitle text="Matrícula" />
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
    </Layout>
  );
}

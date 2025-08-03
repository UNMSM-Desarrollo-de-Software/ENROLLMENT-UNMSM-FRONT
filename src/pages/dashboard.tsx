import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "./utils/layout";
import FormTitle from "./utils/formTitle";
import TrackingBar from "./enrollment/trackingBar";

interface Student {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  authorities: { authority: string }[];
  accountNonExpired: boolean;
  accountNonLocked: boolean;
  credentialsNonExpired: boolean;
}

interface Payment {
  id: number;
  status: string;
  amount: number;
}

interface Enrollment {
  id: number;
  student: Student;
  payment: Payment;
  status: string;
  period: string;
}

export default function DashboardPage() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const res = await fetch(
          "http://localhost:8080/enrollments?email=jimena.ruizc@unmsm.edu.pe&period=2025-2",
          {
            credentials: "include", // si el endpoint está protegido por token
          }
        );

        if (!res.ok) {
          throw new Error(`Error: ${res.status}`);
        }

        const data = await res.json();
        setEnrollments(data);

        // Actualizar localStorage con los enrollments más recientes
        if (data && data.length > 0) {
          // Buscar el enrollment más reciente o en proceso
          const activeEnrollment = data.find((enrollment: Enrollment) => 
            ["1", "2", "3", "4", "5"].includes(enrollment.status)
          ) || data[0]; // Si no hay uno en proceso, tomar el primero

          // Actualizar localStorage con el enrollment activo
          localStorage.setItem('enrollment', JSON.stringify(activeEnrollment));
          localStorage.setItem('currentEnrollment', JSON.stringify(activeEnrollment));
          
          console.log('localStorage updated with active enrollment:', activeEnrollment);
        } else {
          // Si no hay enrollments, limpiar localStorage
          localStorage.removeItem('enrollment');
          localStorage.removeItem('currentEnrollment');
          localStorage.removeItem('selectedCourses');
          localStorage.removeItem('paymentPlan');
          localStorage.removeItem('studentData');
          
          console.log('No enrollments found, localStorage cleared');
        }
      } catch (error) {
        console.error("Error cargando matrículas:", error);
        setEnrollments([]);
        
        // En caso de error, también limpiar localStorage
        localStorage.removeItem('enrollment');
        localStorage.removeItem('currentEnrollment');
        localStorage.removeItem('selectedCourses');
        localStorage.removeItem('paymentPlan');
        localStorage.removeItem('studentData');
        
        console.log('Error fetching enrollments, localStorage cleared');
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollments();
  }, []);

  const handleStartEnrollment = () => {
    router.push('/enrollment/trackingBar');
  };

  const continueEnrollment = (enrollment: Enrollment) => {
    // Actualizar el enrollment en localStorage para continuar el proceso
    localStorage.setItem('enrollment', JSON.stringify(enrollment));
    localStorage.setItem('currentEnrollment', JSON.stringify(enrollment));
    
    console.log('Continuing enrollment with updated data:', enrollment);
    router.push('/enrollment/trackingBar');
  };

  const renderEnrollmentContent = () => {
    // Si no hay enrollments, mostrar opción para iniciar matrícula
    if (enrollments.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 max-w-md mx-auto">
            <div className="text-blue-600 mb-4">
              <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Matrícula Habilitada
            </h3>
            <p className="text-gray-600 mb-6">
              La matrícula para el período 2025-2 está disponible. Haga clic en el botón para iniciar su proceso de matrícula.
            </p>
            <button
              onClick={handleStartEnrollment}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Iniciar Proceso de Matrícula
            </button>
          </div>
        </div>
      );
    }

    // Buscar enrollment completado (status "5")
    const completedEnrollment = enrollments.find(e => e.status === "5");
    if (completedEnrollment) {
      return (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-start">
            <div className="text-green-600 mr-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-green-800 mb-3">
                ✅ Matrícula Completada
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-semibold text-gray-700 mb-2">Información del Estudiante</h4>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Nombre:</span> {completedEnrollment.student.firstName} {completedEnrollment.student.lastName}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Email:</span> {completedEnrollment.student.email}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Período:</span> {completedEnrollment.period}
                  </p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-semibold text-gray-700 mb-2">Información de Pago</h4>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Estado:</span> {completedEnrollment.payment.status}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Monto:</span> S/ {completedEnrollment.payment.amount.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">ID Matrícula:</span> {completedEnrollment.id}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Buscar enrollment en proceso (status "1" a "4")
    const inProgressEnrollment = enrollments.find(e => ["1", "2", "3", "4"].includes(e.status));
    if (inProgressEnrollment) {
      const getStepInfo = (status: string) => {
        const stepMap: Record<string, { step: number; title: string; description: string }> = {
          "1": { step: 0, title: "Selección de Cursos", description: "Complete la selección de sus cursos" },
          "2": { step: 1, title: "Plan de Pagos", description: "Configure su plan de pagos" },
          "3": { step: 2, title: "Compromiso", description: "Revise y acepte los términos" },
          "4": { step: 3, title: "Pago de Matrícula", description: "Realice el pago de matrícula" }
        };
        return stepMap[status] || { step: 0, title: "Paso Desconocido", description: "Estado no reconocido" };
      };

      const stepInfo = getStepInfo(inProgressEnrollment.status);

      return (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-start">
            <div className="text-yellow-600 mr-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-yellow-800 mb-3">
                🔄 Matrícula en Proceso
              </h3>
              <div className="bg-white rounded-lg p-4 mb-4">
                <h4 className="font-semibold text-gray-700 mb-2">Estado Actual</h4>
                <p className="text-sm text-gray-600 mb-2">
                  <span className="font-medium">Paso:</span> {stepInfo.step + 1} - {stepInfo.title}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  <span className="font-medium">Descripción:</span> {stepInfo.description}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Estudiante:</span> {inProgressEnrollment.student.firstName} {inProgressEnrollment.student.lastName}
                </p>
              </div>
              <button
                onClick={() => continueEnrollment(inProgressEnrollment)}
                className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Continuar Matrícula
              </button>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  if (loading) {
    return (
      <Layout>
        <FormTitle text="Matrículas" />
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Cargando matrículas...</span>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <FormTitle text="Matrículas" />
      {renderEnrollmentContent()}
    </Layout>
  );
}

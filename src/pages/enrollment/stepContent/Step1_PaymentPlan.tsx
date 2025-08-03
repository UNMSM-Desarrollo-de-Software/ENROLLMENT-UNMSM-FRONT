import { Step1Props } from "@/types";
import { useState, useEffect } from "react";

export default function Step1_PaymentPlan({
  completed,
  locked,
  onComplete,
  cursosSeleccionados = [],
  onPlanChange,
}: Step1Props) {
  // Calcular monto total basado en créditos (asumiendo S/. 100 por crédito)
  const PRECIO_POR_CREDITO = 100;
  const totalCreditos = cursosSeleccionados.reduce((sum, curso) => sum + curso.creditos, 0);
  const montoCalculado = totalCreditos * PRECIO_POR_CREDITO;

  const [montoTotal, setMontoTotal] = useState(montoCalculado);
  const [numeroCuotas, setNumeroCuotas] = useState(3);
  const [cuotas, setCuotas] = useState<
    { numero: number; monto: number; vencimiento: string }[]
  >([]);
  const [submitting, setSubmitting] = useState(false);

  // Función para crear el plan de cuotas en el servidor
  const createFeePlan = async () => {
    try {
      const enrollmentStr = localStorage.getItem('enrollment') || localStorage.getItem('currentEnrollment');
      if (!enrollmentStr) {
        throw new Error('No enrollment found in localStorage');
      }

      const enrollment = JSON.parse(enrollmentStr);
      
      // Calcular el monto por cuota
      const feeAmount = (montoTotal / numeroCuotas).toFixed(2);

      const response = await fetch('http://localhost:8080/fee-plans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          enrollment: {
            id: enrollment.id
          },
          feeQuantity: numeroCuotas,
          feeAmount: feeAmount
        })
      });

      if (!response.ok) {
        throw new Error(`Error creating fee plan: ${response.status}`);
      }

      const feePlan = await response.json();
      console.log('Fee plan created successfully:', feePlan);
      
      return feePlan;
    } catch (error) {
      console.error('Error creating fee plan:', error);
      throw error;
    }
  };

  // Función para manejar la confirmación del plan de pagos
  const handleConfirmPaymentPlan = async () => {
    try {
      setSubmitting(true);

      // Validar que tengamos datos necesarios
      if (cuotas.length === 0) {
        alert('Por favor, genere un plan de pagos válido');
        return;
      }

      // Crear el plan de cuotas en el servidor
      await createFeePlan();

      // Si todo sale bien, pasar al siguiente paso
      onComplete();
      
    } catch (error) {
      console.error('Error confirming payment plan:', error);
      alert('Error al confirmar el plan de pagos. Por favor, inténtelo nuevamente.');
    } finally {
      setSubmitting(false);
    }
  };

  // Función para actualizar el status del enrollment a "2"
  const updateEnrollmentStatusToPaymentPlan = async () => {
    try {
      const enrollmentStr = localStorage.getItem('enrollment') || localStorage.getItem('currentEnrollment');
      if (!enrollmentStr) {
        console.warn('No enrollment found in localStorage');
        return;
      }

      const enrollment = JSON.parse(enrollmentStr);
      
      // Solo actualizar si el status no es ya "2" o superior
      if (parseInt(enrollment.status) >= 2) {
        console.log('Enrollment status is already 2 or higher, skipping update');
        return;
      }

      const response = await fetch(`http://localhost:8080/enrollments/${enrollment.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          status: "2",
          payment: {
            id: enrollment.payment.id
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Error updating enrollment status: ${response.status}`);
      }

      const updatedEnrollment = await response.json();
      
      // Actualizar el enrollment en localStorage
      localStorage.setItem('enrollment', JSON.stringify(updatedEnrollment));
      localStorage.setItem('currentEnrollment', JSON.stringify(updatedEnrollment));
      
      console.log('Enrollment status updated to "2" successfully');
      
    } catch (error) {
      console.error('Error updating enrollment status to "2":', error);
    }
  };

  // Actualizar status del enrollment cuando se monta el componente
  useEffect(() => {
    if (!completed && !locked) {
      updateEnrollmentStatusToPaymentPlan();
    }
  }, [completed, locked]);

  // Actualizar monto total cuando cambien los cursos seleccionados
  useEffect(() => {
    if (montoCalculado > 0 && !completed) {
      setMontoTotal(montoCalculado);
    }
  }, [montoCalculado, completed]);

  const generarPlan = () => {
    const hoy = new Date();
    const nuevasCuotas = Array.from({ length: numeroCuotas }, (_, i) => {
      const fecha = new Date(hoy);
      fecha.setMonth(fecha.getMonth() + i);
      return {
        numero: i + 1,
        monto: parseFloat((montoTotal / numeroCuotas).toFixed(2)),
        vencimiento: fecha.toISOString().split("T")[0],
      };
    });
    setCuotas(nuevasCuotas);
  };

  // Generar plan automáticamente cuando cambien el número de cuotas o el monto total
  useEffect(() => {
    if (montoTotal > 0 && numeroCuotas > 0 && !completed) {
      generarPlan();
    }
  }, [montoTotal, numeroCuotas, completed]);

  // Notificar cambios en el plan de pagos
  useEffect(() => {
    if (cuotas.length > 0 && onPlanChange) {
      onPlanChange({
        montoTotal,
        numeroCuotas,
        cuotas: cuotas.map(cuota => ({
          numero: cuota.numero,
          fecha: cuota.vencimiento,
          monto: cuota.monto
        }))
      });
    }
  }, [cuotas, montoTotal, numeroCuotas, onPlanChange]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      {completed ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="text-green-700 font-medium flex items-center">
            <span className="text-green-600 mr-2">✅</span>
            Plan de pago confirmado correctamente
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold mb-2 text-gray-800">Plan de Pagos</h2>
            <p className="text-gray-600 mb-6">Configure su plan de pagos personalizado</p>
          </div>

          {cursosSeleccionados.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-3 text-gray-700">Cursos Seleccionados</h3>
              <div className="space-y-2">
                {cursosSeleccionados.map((curso, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-blue-200 last:border-b-0">
                    <div>
                      <span className="font-medium text-gray-800">{curso.nombre}</span>
                      <span className="text-sm text-gray-600 ml-2">({curso.codigo})</span>
                    </div>
                    <div className="text-right">
                      <span className="font-medium text-gray-800">{curso.creditos} créditos</span>
                      <div className="text-sm text-gray-600">S/. {curso.creditos * PRECIO_POR_CREDITO}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-3 border-t border-blue-300 flex justify-between items-center">
                <span className="font-semibold text-gray-800">Total:</span>
                <div className="text-right">
                  <div className="font-semibold text-gray-800">{totalCreditos} créditos</div>
                  <div className="text-lg font-bold text-blue-600">S/. {montoCalculado}</div>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              <label className="block mb-2 font-semibold text-gray-700">
                Monto total a pagar
              </label>
              <div className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 font-semibold text-lg">
                S/ {montoTotal.toFixed(2)}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Calculado automáticamente según los cursos seleccionados
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              <label className="block mb-3 font-semibold text-gray-700">Número de cuotas</label>
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 4].map((numero) => (
                  <button
                    key={numero}
                    className={`p-3 rounded-lg font-medium text-sm transition-colors border-2 ${
                      numeroCuotas === numero
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                    } ${locked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    onClick={() => !locked && setNumeroCuotas(numero)}
                    disabled={locked}
                  >
                    {numero} {numero === 1 ? 'cuota' : 'cuotas'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {cuotas.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-700">Plan de Pagos Generado</h3>
              </div>
              <div className="overflow-auto">
                <table className="w-full">
                  <thead className="bg-gray-100 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">Cuota</th>
                      <th className="px-4 py-3 text-right font-semibold text-gray-700">Monto (S/)</th>
                      <th className="px-4 py-3 text-center font-semibold text-gray-700">Fecha de vencimiento</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {cuotas.map((cuota) => (
                      <tr key={cuota.numero} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-gray-800 font-medium">#{cuota.numero}</td>
                        <td className="px-4 py-3 text-right text-gray-800 font-semibold">
                          S/. {cuota.monto.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-center text-gray-600">
                          {cuota.vencimiento}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Botón de confirmación */}
      <div className="flex justify-center mt-8">
        <button
          className="bg-[#0F5BA8] hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          onClick={handleConfirmPaymentPlan}
          disabled={locked || cuotas.length === 0 || submitting}
        >
          {submitting ? 'Procesando...' : 'Confirmar plan de pagos'}
        </button>
      </div>

      {locked && !completed && (
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800 text-sm font-medium">
            ⚠️ Este paso ya no se puede modificar.
          </p>
        </div>
      )}
    </div>
  );
}

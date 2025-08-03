import { Step3Props } from "@/types";
import { useState, useEffect } from "react";

// Puedes adaptar estos íconos o logos según tus assets o librerías de íconos
const mediosPago = [
  { nombre: "Visa", icono: "/icons/visa.png" },
  { nombre: "Mastercard", icono: "/icons/mastercard.png" },
  { nombre: "Yape", icono: "/icons/yape.png" },
  { nombre: "Plin", icono: "/icons/plin.png" },
  { nombre: "PayPal", icono: "/icons/paypal.png" },
  { nombre: "MercadoPago", icono: "/icons/mercado-pago.jpg" },
];

export default function Step3_TuitionPayment({
  completed,
  locked,
  onComplete,
  cursosSeleccionados = [],
  planPagos,
}: Step3Props) {
  const [medioSeleccionado, setMedioSeleccionado] = useState<string | null>(
    null
  );
  const [paymentData, setPaymentData] = useState<{
    id: number;
    status: string;
    amount: number;
  } | null>(null);
  const [loadingPayment, setLoadingPayment] = useState(true);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // Función para obtener los datos del payment
  const fetchPaymentData = async () => {
    try {
      setLoadingPayment(true);
      setPaymentError(null);

      const enrollmentStr = localStorage.getItem('enrollment') || localStorage.getItem('currentEnrollment');
      if (!enrollmentStr) {
        throw new Error('No enrollment found in localStorage');
      }

      const enrollment = JSON.parse(enrollmentStr);
      
      if (!enrollment.payment?.id) {
        throw new Error('No payment ID found in enrollment');
      }

      const response = await fetch(`http://localhost:8080/payments/${enrollment.payment.id}`, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Error fetching payment data: ${response.status}`);
      }

      const paymentInfo = await response.json();
      setPaymentData(paymentInfo);
      
      console.log('Payment data loaded:', paymentInfo);
      
    } catch (error) {
      console.error('Error fetching payment data:', error);
      setPaymentError(error instanceof Error ? error.message : 'Error desconocido');
    } finally {
      setLoadingPayment(false);
    }
  };

  // Cargar datos del payment al montar el componente
  useEffect(() => {
    if (!completed && !locked) {
      fetchPaymentData();
    }
  }, [completed, locked]);

  const handleSeleccion = (nombre: string) => {
    setMedioSeleccionado(nombre);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {completed ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="text-green-700 font-medium flex items-center">
            <span className="text-green-600 mr-2">✅</span>
            Matrícula pagada exitosamente
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Validación de datos necesarios */}
          {(!cursosSeleccionados.length || !planPagos || (!paymentData && !loadingPayment)) ? (
            <div className="text-center py-12">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-md mx-auto">
                <div className="text-yellow-600 mb-4 font-medium">
                  ⚠️ Faltan datos necesarios para proceder con el pago
                </div>
                <div className="text-sm text-gray-600 mb-4">
                  {!cursosSeleccionados.length && "• No hay cursos seleccionados"}
                  {!planPagos && "• No hay plan de pagos confirmado"}
                  {!paymentData && !loadingPayment && "• No se pudieron cargar los datos de pago"}
                </div>
                <p className="text-sm text-gray-700">
                  Por favor, complete los pasos anteriores para continuar.
                </p>
              </div>
            </div>
          ) : (
            <>
              <div>
                <h2 className="text-xl font-bold mb-2 text-gray-800">Pago de Matrícula</h2>
                <p className="text-gray-600 mb-6">Seleccione su método de pago preferido</p>
              </div>

              {/* Métodos de pago */}
              <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <h3 className="text-lg font-semibold mb-4 text-gray-700">
                  Métodos de Pago Disponibles
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                  {mediosPago.map((medio) => (
                    <button
                      key={medio.nombre}
                      disabled={locked}
                      onClick={() => handleSeleccion(medio.nombre)}
                      className={`border-2 rounded-lg p-4 flex flex-col items-center gap-3 transition duration-200 hover:border-blue-500 hover:shadow-md ${
                        medioSeleccionado === medio.nombre
                          ? "border-blue-500 bg-blue-50 shadow-md"
                          : "border-gray-200 bg-white"
                      }`}
                    >
                      <img src={medio.icono} alt={medio.nombre} className="h-8 w-auto" />
                      <span className="text-sm font-medium text-gray-800">{medio.nombre}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Resumen de matrícula */}
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-700">Resumen de Matrícula</h3>
                </div>

                <div className="p-4">
                  <div className="overflow-auto">
                    <table className="w-full">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-4 py-3 text-left font-semibold text-gray-700">Curso</th>
                          <th className="px-4 py-3 text-left font-semibold text-gray-700">Código</th>
                          <th className="px-4 py-3 text-left font-semibold text-gray-700">Docente</th>
                          <th className="px-4 py-3 text-center font-semibold text-gray-700">Créditos</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {cursosSeleccionados.map((curso, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-4 py-3 font-medium text-gray-800">{curso.nombre}</td>
                            <td className="px-4 py-3 text-gray-600">{curso.codigo}</td>
                            <td className="px-4 py-3 text-gray-600">{curso.docente}</td>
                            <td className="px-4 py-3 text-center font-semibold text-gray-800">{curso.creditos}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-200 text-right">
                    <span className="text-lg font-semibold text-gray-800">
                      Total créditos: {cursosSeleccionados.reduce((sum, curso) => sum + curso.creditos, 0)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Información del pago de matrícula */}
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-700">Pago de Matrícula</h3>
                </div>
                
                <div className="p-4">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="text-lg font-semibold text-blue-800 mb-3">Información del Pago</h4>
                    {loadingPayment ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                        <span className="text-sm text-gray-600">Cargando información de pago...</span>
                      </div>
                    ) : paymentError ? (
                      <div className="text-red-600 text-sm">
                        Error al cargar información de pago: {paymentError}
                      </div>
                    ) : paymentData ? (
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-700">ID de Pago:</span>
                          <span className="font-medium text-gray-800">#{paymentData.id}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-700">Estado:</span>
                          <span className="font-medium text-gray-800">{paymentData.status}</span>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t border-blue-200">
                          <span className="text-lg font-semibold text-blue-800">Total a Pagar:</span>
                          <span className="text-xl font-bold text-blue-600">S/. {paymentData.amount.toFixed(2)}</span>
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Botón de pago */}
      {!completed && cursosSeleccionados.length > 0 && planPagos && paymentData && (
        <div className="flex justify-center mt-8">
          <button
            className="bg-[#0F5BA8] hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            onClick={onComplete}
            disabled={locked || !medioSeleccionado || loadingPayment}
          >
            {loadingPayment ? 'Cargando...' : `Procesar pago de matrícula (S/. ${paymentData?.amount.toFixed(2)})`}
          </button>
        </div>
      )}

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

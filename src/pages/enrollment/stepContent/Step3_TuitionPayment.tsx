import { Step3Props } from "@/types";
import { useState } from "react";

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
          {(!cursosSeleccionados.length || !planPagos) ? (
            <div className="text-center py-12">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-md mx-auto">
                <div className="text-yellow-600 mb-4 font-medium">
                  ⚠️ Faltan datos necesarios para proceder con el pago
                </div>
                <div className="text-sm text-gray-600 mb-4">
                  {!cursosSeleccionados.length && "• No hay cursos seleccionados"}
                  {!planPagos && "• No hay plan de pagos confirmado"}
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

              {/* Plan de cuotas */}
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-700">Plan de Cuotas</h3>
                </div>
                
                <div className="p-4">
                  <div className="overflow-auto">
                    <table className="w-full">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-4 py-3 text-left font-semibold text-gray-700">Cuota</th>
                          <th className="px-4 py-3 text-center font-semibold text-gray-700">Fecha</th>
                          <th className="px-4 py-3 text-right font-semibold text-gray-700">Monto (S/)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {planPagos.cuotas.map((cuota, idx) => (
                          <tr key={idx} className="hover:bg-gray-50">
                            <td className="px-4 py-3 font-medium text-gray-800">#{cuota.numero}</td>
                            <td className="px-4 py-3 text-center text-gray-600">{cuota.fecha}</td>
                            <td className="px-4 py-3 text-right font-semibold text-gray-800">
                              S/. {cuota.monto.toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-200 text-right">
                    <div className="text-xl font-bold text-blue-600">
                      Total matrícula: S/. {planPagos.montoTotal.toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Botón de pago */}
      {!completed && cursosSeleccionados.length > 0 && planPagos && (
        <div className="flex justify-center mt-8">
          <button
            className="bg-[#0F5BA8] hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            onClick={onComplete}
            disabled={locked || !medioSeleccionado}
          >
            Procesar pago de matrícula
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

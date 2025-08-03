import { Step2Props } from "@/types";
import { useState } from "react";

export default function Step2_Commitment({
  completed,
  locked,
  onComplete,
  cursosSeleccionados = [],
  planPagos,
}: Step2Props) {
  const [accepted, setAccepted] = useState(false);

  const handleCheckbox = () => {
    setAccepted(!accepted);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {completed ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="text-green-700 font-medium flex items-center">
            <span className="text-green-600 mr-2">✅</span>
            Compromiso aceptado correctamente
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold mb-2 text-gray-800">Compromiso de Matrícula</h2>
            <p className="text-gray-600 mb-6">Revise y acepte los términos de su matrícula</p>
          </div>
          
          {/* Información de cursos seleccionados */}
          {cursosSeleccionados.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-3 text-gray-700">Cursos a Matricular</h3>
              <div className="space-y-3">
                {cursosSeleccionados.map((curso, index) => (
                  <div key={index} className="bg-white rounded-lg p-3 border border-blue-200">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <span className="font-semibold text-gray-800">{curso.nombre}</span>
                        <span className="text-gray-600 ml-2 text-sm">({curso.codigo})</span>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-gray-800">{curso.creditos} créditos</div>
                        <div className="text-sm text-gray-600">{curso.docente}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-3 border-t border-blue-300 text-center">
                <span className="font-semibold text-gray-800">
                  Total: {cursosSeleccionados.reduce((sum, curso) => sum + curso.creditos, 0)} créditos
                </span>
              </div>
            </div>
          )}

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-gray-700 leading-relaxed">
              Declaro que toda la información proporcionada durante el proceso de
              matrícula es verdadera y completa. Me comprometo a cumplir con las
              normas académicas y administrativas establecidas por la institución.
            </p>
          </div>

          {planPagos ? (
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-700">Cronograma de Pagos</h3>
              </div>
              
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-blue-50 rounded-lg p-3">
                    <span className="text-sm text-gray-600">Monto total:</span>
                    <div className="text-xl font-bold text-blue-600">S/. {planPagos.montoTotal.toFixed(2)}</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3">
                    <span className="text-sm text-gray-600">Número de cuotas:</span>
                    <div className="text-xl font-bold text-green-600">{planPagos.numeroCuotas}</div>
                  </div>
                </div>

                <div className="overflow-auto">
                  <table className="w-full">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-3 text-left font-semibold text-gray-700">Cuota</th>
                        <th className="px-4 py-3 text-center font-semibold text-gray-700">Fecha límite</th>
                        <th className="px-4 py-3 text-right font-semibold text-gray-700">Monto (S/)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {planPagos.cuotas.map((cuota) => (
                        <tr key={cuota.numero} className="hover:bg-gray-50">
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
              </div>
            </div>
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center">
                <span className="text-yellow-600 mr-2">⚠️</span>
                <p className="text-yellow-800 font-medium">
                  No se ha configurado un plan de pagos. Por favor, complete el paso anterior.
                </p>
              </div>
            </div>
          )}

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-gray-700 mb-4 leading-relaxed">
              Acepto el cronograma de pagos y cuotas definido anteriormente,
              comprometiéndome a cumplir con los montos y fechas establecidas.
            </p>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="commitment"
                checked={accepted}
                onChange={handleCheckbox}
                disabled={locked || !planPagos}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
              />
              <label htmlFor="commitment" className="ml-3 text-gray-700 font-medium">
                Acepto los términos del compromiso de matrícula
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Botón de confirmación */}
      <div className="flex justify-center mt-8">
        <button
          className="bg-[#0F5BA8] hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          onClick={onComplete}
          disabled={locked || !accepted || !planPagos}
        >
          Confirmar compromiso
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

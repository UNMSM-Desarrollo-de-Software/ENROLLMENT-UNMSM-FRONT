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
    <div className="max-w-3xl mx-auto p-6">
      {completed ? (
        <div className="text-green-700 font-medium">
          ✅ Compromiso aceptado.
        </div>
      ) : (
        <>
          <h3 className="text-lg font-semibold mb-4">
            Compromiso de matrícula
          </h3>
          
          {/* Información de cursos seleccionados */}
          {cursosSeleccionados.length > 0 && (
            <div className="mb-6 p-4 bg-blue-50 rounded">
              <h4 className="font-medium mb-3">Cursos a matricular:</h4>
              <div className="space-y-2">
                {cursosSeleccionados.map((curso, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <div>
                      <span className="font-medium">{curso.nombre}</span>
                      <span className="text-gray-600 ml-2">({curso.codigo})</span>
                    </div>
                    <div>
                      <span>{curso.creditos} créditos</span>
                      <span className="text-gray-600 ml-2">- {curso.docente}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-blue-200 font-semibold text-sm">
                Total: {cursosSeleccionados.reduce((sum, curso) => sum + curso.creditos, 0)} créditos
              </div>
            </div>
          )}

          <p className="mb-4 text-sm text-gray-700">
            Declaro que toda la información proporcionada durante el proceso de
            matrícula es verdadera y completa. Me comprometo a cumplir con las
            normas académicas y administrativas establecidas por la institución.
          </p>

          {planPagos && (
            <>
              <p className="mb-2 text-sm text-gray-700 font-medium">
                Cronograma de pagos aceptado:
              </p>

              <div className="mb-4 p-3 bg-gray-50 rounded">
                <p className="text-sm mb-2">
                  <strong>Monto total:</strong> S/. {planPagos.montoTotal.toFixed(2)}
                </p>
                <p className="text-sm mb-3">
                  <strong>Número de cuotas:</strong> {planPagos.numeroCuotas}
                </p>
              </div>

              <table className="w-full mb-4 text-sm border border-gray-300">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-2 py-1 text-left">Cuota</th>
                    <th className="border px-2 py-1 text-left">Fecha límite</th>
                    <th className="border px-2 py-1 text-left">Monto (S/)</th>
                  </tr>
                </thead>
                <tbody>
                  {planPagos.cuotas.map((cuota) => (
                    <tr key={cuota.numero}>
                      <td className="border px-2 py-1">#{cuota.numero}</td>
                      <td className="border px-2 py-1">{cuota.fecha}</td>
                      <td className="border px-2 py-1">{cuota.monto.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}

          {!planPagos && (
            <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
              <p className="text-yellow-800 text-sm">
                ⚠️ No se ha configurado un plan de pagos. Por favor, complete el paso anterior.
              </p>
            </div>
          )}

          <p className="mb-4 text-sm text-gray-700">
            Acepto el cronograma de pagos y cuotas definido anteriormente,
            comprometiéndome a cumplir con los montos y fechas establecidas.
          </p>

          <div className="flex items-center mb-6">
            <input
              type="checkbox"
              id="commitment"
              checked={accepted}
              onChange={handleCheckbox}
              disabled={locked || !planPagos}
              className="mr-2"
            />
            <label htmlFor="commitment" className="text-sm">
              Acepto los términos del compromiso.
            </label>
          </div>

          <div className="flex justify-center">
            <button
              className="w-auto px-6 py-2 bg-[#0F5BA8] text-white rounded-lg disabled:opacity-50"
              onClick={onComplete}
              disabled={locked || !accepted || !planPagos}
            >
              Confirmar compromiso
            </button>
          </div>

          {locked && !completed && (
            <p className="text-red-600 mt-4 text-sm">
              Este paso ya no se puede modificar.
            </p>
          )}
        </>
      )}
    </div>
  );
}

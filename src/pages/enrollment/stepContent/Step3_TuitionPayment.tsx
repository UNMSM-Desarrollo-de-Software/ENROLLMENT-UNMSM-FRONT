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
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {completed ? (
        <div className="text-green-700 font-medium">
          ✅ Matrícula pagada exitosamente.
        </div>
      ) : (
        <>
          {/* Validación de datos necesarios */}
          {(!cursosSeleccionados.length || !planPagos) ? (
            <div className="text-center py-8">
              <div className="text-yellow-600 mb-4">
                ⚠️ Faltan datos necesarios para proceder con el pago
              </div>
              <div className="text-sm text-gray-600">
                {!cursosSeleccionados.length && "• No hay cursos seleccionados"}
                {!planPagos && "• No hay plan de pagos confirmado"}
              </div>
              <p className="mt-4 text-sm">
                Por favor, complete los pasos anteriores para continuar.
              </p>
            </div>
          ) : (
            <>
              {/* Métodos de pago */}
              <section>
                <h3 className="text-lg font-semibold mb-4">
                  Selecciona un medio de pago
                </h3>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
                  {mediosPago.map((medio) => (
                    <button
                      key={medio.nombre}
                      disabled={locked}
                      onClick={() => handleSeleccion(medio.nombre)}
                      className={`border rounded-lg p-3 flex flex-col items-center gap-2 transition duration-200 hover:border-blue-600 ${
                        medioSeleccionado === medio.nombre
                          ? "border-blue-600 bg-blue-50"
                          : ""
                      }`}
                    >
                      <img src={medio.icono} alt={medio.nombre} className="h-10" />
                      <span className="text-sm font-medium">{medio.nombre}</span>
                    </button>
                  ))}
                </div>
              </section>

              {/* Resumen de selección */}
              <section>
                <h3 className="text-lg font-semibold mt-8 mb-2">
                  Resumen de matrícula
                </h3>

                <div className="overflow-auto border rounded-lg">
                  <table className="min-w-full text-sm">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-2 text-left">Curso</th>
                        <th className="px-4 py-2 text-left">Código</th>
                        <th className="px-4 py-2 text-left">Docente</th>
                        <th className="px-4 py-2 text-left">Créditos</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cursosSeleccionados.map((curso, index) => (
                        <tr key={index} className="border-t">
                          <td className="px-4 py-2">{curso.nombre}</td>
                          <td className="px-4 py-2">{curso.codigo}</td>
                          <td className="px-4 py-2">{curso.docente}</td>
                          <td className="px-4 py-2">{curso.creditos}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-3 text-right text-sm font-medium">
                  Total créditos: {cursosSeleccionados.reduce((sum, curso) => sum + curso.creditos, 0)}
                </div>
              </section>

              {/* Plan de cuotas */}
              <section>
                <h3 className="text-md font-semibold mt-6 mb-2">
                  Plan de cuotas aceptado
                </h3>
                <div className="overflow-auto border rounded-lg">
                  <table className="min-w-full text-sm">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-2 text-left">N°</th>
                        <th className="px-4 py-2 text-left">Fecha</th>
                        <th className="px-4 py-2 text-left">Monto (S/)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {planPagos.cuotas.map((cuota, idx) => (
                        <tr key={idx} className="border-t">
                          <td className="px-4 py-2">{cuota.numero}</td>
                          <td className="px-4 py-2">{cuota.fecha}</td>
                          <td className="px-4 py-2">S/ {cuota.monto.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 text-right text-base font-semibold">
                  Total matrícula:{" "}
                  <span className="text-blue-700">S/ {planPagos.montoTotal.toFixed(2)}</span>
                </div>
              </section>

              <div className="flex justify-center mt-6">
                <button
                  className="w-auto px-6 py-2 bg-[#0F5BA8] text-white rounded-lg disabled:opacity-50"
                  onClick={onComplete}
                  disabled={locked || !medioSeleccionado}
                >
                  Pagar matrícula
                </button>
              </div>
            </>
          )}

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

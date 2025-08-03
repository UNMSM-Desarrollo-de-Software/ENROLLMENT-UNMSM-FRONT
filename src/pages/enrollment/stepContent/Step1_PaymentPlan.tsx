import { Step1Props } from "@/types";
import { useState, useEffect } from "react";

export default function Step1_PaymentPlan({
  completed,
  locked,
  onComplete,
  cursosSeleccionados = [],
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

  return (
    <div className="w-full">
      {completed ? (
        <div className="text-green-700 font-medium">
          ✅ Plan de pago confirmado.
        </div>
      ) : (
        <div>
          <h3 className="text-lg font-semibold mb-2">
            Configuración del plan de pagos:
          </h3>

          {cursosSeleccionados.length > 0 && (
            <div className="mb-4 p-4 bg-gray-50 rounded">
              <h4 className="font-medium mb-2">Cursos seleccionados:</h4>
              <div className="space-y-2">
                {cursosSeleccionados.map((curso, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>{curso.nombre}</span>
                    <span>{curso.creditos} créditos - S/. {curso.creditos * PRECIO_POR_CREDITO}</span>
                  </div>
                ))}
              </div>
              <div className="mt-2 pt-2 border-t border-gray-300 font-semibold">
                Total: {totalCreditos} créditos - S/. {montoCalculado}
              </div>
            </div>
          )}

          <div className="mb-4">
            <label className="block mb-1 font-medium">
              Monto total a pagar (S/):
            </label>
            <input
              type="number"
              className="border rounded p-2 w-full"
              value={montoTotal}
              disabled={locked}
              onChange={(e) => setMontoTotal(parseFloat(e.target.value))}
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1 font-medium">Número de cuotas:</label>
            <input
              type="number"
              className="border rounded p-2 w-full"
              value={numeroCuotas}
              disabled={locked}
              min={1}
              onChange={(e) => setNumeroCuotas(parseInt(e.target.value))}
            />
          </div>

          <div className="mb-4">
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
              onClick={generarPlan}
              disabled={locked || montoTotal <= 0 || numeroCuotas <= 0}
            >
              Generar plan de pagos
            </button>
          </div>

          {cuotas.length > 0 && (
            <div className="overflow-auto">
              <table className="w-full border">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border p-2">#</th>
                    <th className="border p-2">Monto (S/)</th>
                    <th className="border p-2">Fecha de vencimiento</th>
                  </tr>
                </thead>
                <tbody>
                  {cuotas.map((cuota) => (
                    <tr key={cuota.numero}>
                      <td className="border p-2 text-center">{cuota.numero}</td>
                      <td className="border p-2 text-right">
                        {cuota.monto.toFixed(2)}
                      </td>
                      <td className="border p-2 text-center">
                        {cuota.vencimiento}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      <div className="flex justify-center mt-6">
        <button
          className="w-auto px-6 py-2 bg-[#0F5BA8] text-white rounded-lg disabled:opacity-50"
          onClick={onComplete}
          disabled={locked || cuotas.length === 0}
        >
          Confirmar plan de pagos
        </button>
      </div>

      {locked && !completed && (
        <p className="text-red-600 mt-4 text-sm">
          Este paso ya no se puede modificar.
        </p>
      )}
    </div>
  );
}

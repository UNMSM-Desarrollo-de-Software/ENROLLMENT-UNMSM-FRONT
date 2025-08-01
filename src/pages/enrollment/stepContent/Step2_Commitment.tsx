import { StepProps } from "@/types";
import { useState } from "react";

type Cuota = {
  numero: number;
  fecha: string;
  monto: number;
};

interface Props extends StepProps {
  cuotas: Cuota[];
}

export default function Step2_Commitment({
  completed,
  locked,
  onComplete,
  cuotas,
}: Props) {
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
          <p className="mb-4 text-sm text-gray-700">
            Declaro que toda la información proporcionada durante el proceso de
            matrícula es verdadera y completa. Me comprometo a cumplir con las
            normas académicas y administrativas establecidas por la institución.
          </p>

          <p className="mb-2 text-sm text-gray-700 font-medium">
            Cronograma de pagos aceptado:
          </p>

          <table className="w-full mb-4 text-sm border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-2 py-1 text-left">Cuota</th>
                <th className="border px-2 py-1 text-left">Fecha límite</th>
                <th className="border px-2 py-1 text-left">Monto (S/)</th>
              </tr>
            </thead>
            <tbody>
              {cuotas.map((cuota) => (
                <tr key={cuota.numero}>
                  <td className="border px-2 py-1">#{cuota.numero}</td>
                  <td className="border px-2 py-1">{cuota.fecha}</td>
                  <td className="border px-2 py-1">{cuota.monto.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

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
              disabled={locked}
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
              disabled={locked || !accepted}
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

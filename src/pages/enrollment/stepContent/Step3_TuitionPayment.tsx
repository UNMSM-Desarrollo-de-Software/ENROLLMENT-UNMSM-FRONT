// Step3_TuitionPayment.tsx
import { StepProps } from "@/types";

export default function Step3_TuitionPayment({
  completed,
  locked,
  onComplete,
}: StepProps) {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Pago de matrícula</h2>

      {completed ? (
        <div className="text-green-700 font-medium">
          ✅ Pago registrado. N° de comprobante: 123456789
        </div>
      ) : (
        <>
          <input
            type="text"
            placeholder="N° de comprobante"
            className="border p-2 rounded w-full"
            disabled={locked}
          />
          <button
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50"
            onClick={onComplete}
            disabled={locked}
          >
            Confirmar pago
          </button>
        </>
      )}

      {locked && (
        <p className="text-red-600 mt-2 text-sm">
          Este paso ya no se puede modificar.
        </p>
      )}
    </div>
  );
}

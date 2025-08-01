import { StepProps } from "@/types";
import { useState } from "react";

type Horario = {
  dia: "Lunes" | "Martes" | "Miércoles" | "Jueves" | "Viernes";
  inicio: string; // "08:00"
  fin: string; // "10:00"
};

type Docente = {
  nombre: string;
  horarios: Horario[];
};

type Curso = {
  codigo: string;
  nombre: string;
  creditos: number;
  opciones: Docente[];
};

// Datos simulados
const cursos: Curso[] = [
  {
    codigo: "CUR101",
    nombre: "Programación I",
    creditos: 4,
    opciones: [
      {
        nombre: "Ing. Quispe",
        horarios: [
          { dia: "Jueves", inicio: "10:00", fin: "12:00" },
          { dia: "Viernes", inicio: "13:00", fin: "15:00" },
        ],
      },
      {
        nombre: "Dr. Salazar",
        horarios: [
          { dia: "Viernes", inicio: "16:00", fin: "18:00" },
          { dia: "Lunes", inicio: "08:00", fin: "10:00" },
        ],
      },
    ],
  },
  {
    codigo: "CUR102",
    nombre: "Cálculo II",
    creditos: 4,
    opciones: [
      {
        nombre: "Ing. Ramos",
        horarios: [
          { dia: "Miércoles", inicio: "08:00", fin: "10:00" },
          { dia: "Viernes", inicio: "17:00", fin: "19:00" },
        ],
      },
      {
        nombre: "Ing. Chávez",
        horarios: [{ dia: "Miércoles", inicio: "10:00", fin: "12:00" }],
      },
      {
        nombre: "Lic. López",
        horarios: [{ dia: "Martes", inicio: "08:00", fin: "10:00" }],
      },
    ],
  },
  {
    codigo: "CUR103",
    nombre: "Física I",
    creditos: 5,
    opciones: [
      {
        nombre: "Ing. Chávez",
        horarios: [
          { dia: "Jueves", inicio: "11:00", fin: "13:00" },
          { dia: "Jueves", inicio: "11:00", fin: "13:00" },
        ],
      },
      {
        nombre: "Dr. Salazar",
        horarios: [
          { dia: "Jueves", inicio: "15:00", fin: "17:00" },
          { dia: "Jueves", inicio: "11:00", fin: "13:00" },
        ],
      },
      {
        nombre: "Ing. Rodríguez",
        horarios: [{ dia: "Martes", inicio: "15:00", fin: "17:00" }],
      },
    ],
  },
];

const dias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];
const horas = Array.from(
  { length: 14 },
  (_, i) => `${String(i + 7).padStart(2, "0")}:00`
); // 07:00 - 20:00

export default function Step0_SelectCourses({
  completed,
  locked,
  onComplete,
}: StepProps) {
  const [selecciones, setSelecciones] = useState<Record<string, number>>({});

  const handleSeleccion = (codigo: string, index: number) => {
    setSelecciones((prev) => ({ ...prev, [codigo]: index }));
  };

  const bloquesSeleccionados = Object.entries(selecciones).flatMap(
    ([codigo, idx]) => {
      const curso = cursos.find((c) => c.codigo === codigo);
      const docente = curso?.opciones[idx];
      return (
        docente?.horarios.map((h) => ({
          ...h,
          curso: curso?.nombre,
          docente: docente?.nombre,
        })) || []
      );
    }
  );

  return (
    <div>
      {completed ? (
        <div className="text-green-700 font-medium">
          ✅ Selección registrada.
        </div>
      ) : (
        <div className="flex flex-row gap-2 w-full">
          <div className="w-1/3">
            <h3 className="text-md font-semibold mb-2">
              Seleccione cursos y docentes:
            </h3>
            {cursos.map((curso) => (
              <div key={curso.codigo} className="border rounded p-4 mb-4">
                <h3 className="font-semibold">
                  {curso.nombre} ({curso.creditos} créditos)
                </h3>
                <select
                  disabled={locked}
                  className="mt-2 p-2 border rounded w-full"
                  value={selecciones[curso.codigo] ?? ""}
                  onChange={(e) =>
                    handleSeleccion(curso.codigo, parseInt(e.target.value))
                  }
                >
                  <option value="">-- Seleccionar docente --</option>
                  {curso.opciones.map((docente, idx) => (
                    <option key={idx} value={idx}>
                      {docente.nombre} (
                      {docente.horarios
                        .map((h) => `${h.dia} ${h.inicio}-${h.fin}`)
                        .join(", ")}
                      )
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          {/* Horario visual tipo grilla */}
          <div className="w-full md:w-2/3">
            <h3 className="text-md font-semibold mb-2">Horario semanal:</h3>
            <div className="overflow-auto">
              <div className="grid grid-cols-[80px_repeat(5,minmax(150px,1fr))] border">
                {/* Cabecera */}
                <div className="border p-2 font-bold bg-gray-100">Hora</div>
                {dias.map((dia) => (
                  <div
                    key={dia}
                    className="border p-2 font-bold bg-gray-100 text-center"
                  >
                    {dia}
                  </div>
                ))}

                {/* Celdas */}
                {horas.map((hora) => (
                  <>
                    <div className="border p-2 text-sm bg-gray-50">{hora}</div>
                    {dias.map((dia) => {
                      const bloque = bloquesSeleccionados.find(
                        (b) => b.dia === dia && b.inicio === hora
                      );
                      return (
                        <div
                          key={`${dia}-${hora}`}
                          className={`border p-1 text-xs text-center h-[48px] ${
                            bloque
                              ? "bg-blue-100 text-blue-900 font-medium"
                              : ""
                          }`}
                        >
                          {bloque && (
                            <>
                              {bloque.curso}
                              <br />
                              <span className="text-[11px]">
                                {bloque.docente}
                              </span>
                            </>
                          )}
                        </div>
                      );
                    })}
                  </>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="flex justify-center mt-6">
        <button
          className="w-auto px-6 py-2 bg-[#0F5BA8] text-white rounded-lg disabled:opacity-50"
          onClick={onComplete}
          disabled={locked || Object.keys(selecciones).length < cursos.length}
        >
          Confirmar selección
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

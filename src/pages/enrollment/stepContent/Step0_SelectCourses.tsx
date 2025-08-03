import { StepProps } from "@/types";
import { useState, useEffect } from "react";

type Horario = {
  dia: "Lunes" | "Martes" | "Miércoles" | "Jueves" | "Viernes";
  inicio: string; // "08:00"
  fin: string; // "10:00"
};

// Tipos para la API
type ApiCourse = {
  id: number;
  code: string;
  name: string;
};

type ApiCourseResponse = {
  course: ApiCourse;
};

type ApiTeacher = {
  id: number;
  firstName: string;
  lastName: string;
};

type ApiEnrollmentOption = {
  id: number;
  teacher: ApiTeacher;
  code: string;
  period: string;
  schedule: string;
};

// Tipos internos
type Docente = {
  id: number;
  nombre: string;
  codigo: string;
  horarios: Horario[];
};

type Curso = {
  id: number;
  codigo: string;
  nombre: string;
  creditos: number;
  opciones: Docente[];
};

// Función para parsear el horario de la API
const parseSchedule = (schedule: string): Horario[] => {
  // Parsear formato "11:00 - 14:00"
  const [inicio, fin] = schedule.split(' - ').map(time => time.trim());
  
  // Asignar días aleatorios para simular horarios completos
  const diasDisponibles: Array<"Lunes" | "Martes" | "Miércoles" | "Jueves" | "Viernes"> = 
    ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];
  
  // Seleccionar 1-2 días aleatorios
  const numDias = Math.floor(Math.random() * 2) + 1;
  const diasSeleccionados: Array<"Lunes" | "Martes" | "Miércoles" | "Jueves" | "Viernes"> = [];
  
  for (let i = 0; i < numDias; i++) {
    const diaIndex = Math.floor(Math.random() * diasDisponibles.length);
    diasSeleccionados.push(diasDisponibles[diaIndex]);
    diasDisponibles.splice(diaIndex, 1);
  }
  
  return diasSeleccionados.map(dia => ({
    dia,
    inicio,
    fin
  }));
};

// Función para obtener cursos desde la API
const fetchCourses = async (): Promise<ApiCourse[]> => {
  try {
    const response = await fetch(
      "http://localhost:8080/enrollment-courses?email=jimena.ruizc@unmsm.edu.pe&status=NTA",
      {
        credentials: "include", // si el endpoint está protegido por token
      }
    );
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data: ApiCourseResponse[] = await response.json();
    return data.map(item => item.course);
  } catch (error) {
    console.error('Error fetching courses:', error);
    // Datos de fallback para desarrollo
    return [
      { id: 9, code: "CURS009", name: "GESTIÓN DE LA CALIDAD DEL SOFTWARE" },
      { id: 10, code: "CURS010", name: "ENTORNOS METODOLÓGICOS DE DESARROLLO DE SOFTWARE" },
      { id: 11, code: "CURS011", name: "DIRECCIÓN DE TESIS II" },
      { id: 12, code: "CURS012", name: "HABILIDADES DIRECTIVAS EN GESTIÓN" }
    ];
  }
};

// Función para obtener opciones de matrícula por curso
const fetchEnrollmentOptions = async (courseId: number): Promise<ApiEnrollmentOption[]> => {
  try {
    const response = await fetch(`http://localhost:8080/sections?courseId=${courseId}`, {
      credentials: "include", // si el endpoint está protegido por token
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data: ApiEnrollmentOption[] = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching enrollment options:', error);
    // Datos de fallback para desarrollo
    return [
      {
        id: Math.floor(Math.random() * 1000),
        teacher: {
          id: Math.floor(Math.random() * 100),
          firstName: "Luis",
          lastName: "Fernández"
        },
        code: `${courseId}-A`,
        period: "2025-01",
        schedule: "08:00 - 10:00"
      },
      {
        id: Math.floor(Math.random() * 1000),
        teacher: {
          id: Math.floor(Math.random() * 100),
          firstName: "María",
          lastName: "González"
        },
        code: `${courseId}-B`,
        period: "2025-01", 
        schedule: "14:00 - 16:00"
      }
    ];
  }
};

// Función para convertir datos de API a formato interno
const transformApiDataToCourses = async (apiCourses: ApiCourse[]): Promise<Curso[]> => {
  const courses: Curso[] = [];
  
  for (const apiCourse of apiCourses) {
    const enrollmentOptions = await fetchEnrollmentOptions(apiCourse.id);
    
    const opciones: Docente[] = enrollmentOptions.map(option => ({
      id: option.id,
      nombre: `${option.teacher.firstName} ${option.teacher.lastName}`,
      codigo: option.code,
      horarios: parseSchedule(option.schedule)
    }));
    
    courses.push({
      id: apiCourse.id,
      codigo: apiCourse.code,
      nombre: apiCourse.name,
      creditos: Math.floor(Math.random() * 3) + 3, // 3-5 créditos aleatorios
      opciones
    });
  }
  
  return courses;
};

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
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar datos al montar el componente
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const apiCourses = await fetchCourses();
        if (apiCourses.length === 0) {
          setError('No se pudieron cargar los cursos');
          return;
        }
        
        const transformedCourses = await transformApiDataToCourses(apiCourses);
        setCursos(transformedCourses);
        
      } catch (err) {
        console.error('Error loading course data:', err);
        setError('Error al cargar los datos de cursos');
      } finally {
        setLoading(false);
      }
    };

    if (!completed && !locked) {
      loadData();
    }
  }, [completed, locked]);

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

  // Agrupar por celda para detectar conflictos
  const celdasMap = new Map<string, { curso: string; docente: string }[]>();
  bloquesSeleccionados.forEach((bloque) => {
    const clave = `${bloque.dia}-${bloque.inicio}`;
    if (!celdasMap.has(clave)) {
      celdasMap.set(clave, []);
    }
    celdasMap.get(clave)!.push({
      curso: bloque.curso!,
      docente: bloque.docente!,
    });
  });

  // Mostrar estado de carga
  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Cargando cursos...</span>
      </div>
    );
  }

  // Mostrar error
  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-4">{error}</div>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div>
      {completed ? (
        <div className="text-green-700 font-medium">
          ✅ Selección registrada.
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-4 w-full">
          <div className="md:w-1/3 w-full">
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
                      {docente.nombre} ({docente.codigo}) - (
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
                  <div key={hora} className="contents">
                    <div className="border p-2 text-sm bg-gray-50">{hora}</div>
                    {dias.map((dia) => {
                      const clave = `${dia}-${hora}`;
                      const bloques = celdasMap.get(clave) || [];

                      const isConflict = bloques.length > 1;

                      return (
                        <div
                          key={clave}
                          className={`border p-1 text-xs text-center h-[48px] overflow-hidden ${
                            bloques.length
                              ? isConflict
                                ? "bg-red-100 text-red-900 font-bold"
                                : "bg-blue-100 text-blue-900 font-medium"
                              : ""
                          }`}
                        >
                          {bloques.map((b, i) => (
                            <div key={i}>
                              {b.curso}
                              <br />
                              <span className="text-[11px]">{b.docente}</span>
                            </div>
                          ))}
                        </div>
                      );
                    })}
                  </div>
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
          disabled={loading || locked || Object.keys(selecciones).length < cursos.length}
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

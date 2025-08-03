import { Step0Props, CursoSeleccionado } from "@/types";
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
      { id: 11, code: "CURS011", name: "DIRECCIÓN DE TESIS III" },
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
  onSelectionChange,
}: Step0Props) {
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

  // Crear array de cursos seleccionados cuando cambie la selección
  useEffect(() => {
    const cursosSeleccionados: CursoSeleccionado[] = Object.entries(selecciones).map(
      ([codigo, idx]) => {
        const curso = cursos.find((c) => c.codigo === codigo);
        const docente = curso?.opciones[idx];
        return {
          codigo: curso?.codigo || "",
          nombre: curso?.nombre || "",
          creditos: curso?.creditos || 0,
          docente: docente?.nombre || "",
          horarios: docente?.horarios || []
        };
      }
    ).filter(curso => curso.codigo !== ""); // Filtrar cursos válidos

    if (onSelectionChange) {
      onSelectionChange(cursosSeleccionados);
    }
  }, [selecciones, cursos, onSelectionChange]);

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
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Cargando cursos...</span>
        </div>
      </div>
    );
  }

  // Mostrar error
  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="text-red-600 mb-4 font-medium">{error}</div>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-screen-2xl mx-auto p-6">
      {completed ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="text-green-700 font-medium flex items-center">
            <span className="text-green-600 mr-2">✅</span>
            Selección registrada correctamente
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold mb-2 text-gray-800">Selección de Cursos</h2>
            <p className="text-gray-600 mb-6">Seleccione los cursos y docentes para su matrícula</p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            {/* Panel de selección de cursos */}
            <div className="xl:col-span-1">
              <h3 className="text-lg font-semibold mb-4 text-gray-700">
                Cursos Disponibles
              </h3>
              <div className="space-y-4">
                {cursos.map((curso) => (
                  <div key={curso.codigo} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                    <h4 className="font-semibold text-gray-800 mb-2">
                      {curso.nombre}
                    </h4>
                    <p className="text-sm text-gray-600 mb-3">
                      {curso.codigo} • {curso.creditos} créditos
                    </p>
                    <select
                      disabled={locked}
                      className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
            </div>

            {/* Horario visual tipo grilla */}
            <div className="xl:col-span-3">
              <h3 className="text-lg font-semibold mb-4 text-gray-700">Horario Semanal</h3>
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                <div className="p-4">
                  {/* Contenedor con scroll horizontal */}
                  <div className="overflow-x-auto overflow-y-hidden">
                    <div className="min-w-[1000px]"> {/* Ancho mínimo aumentado */}
                      <div className="grid grid-cols-[120px_repeat(5,1fr)] border border-gray-200 rounded-lg overflow-hidden">
                        {/* Cabecera */}
                        <div className="bg-gray-100 border-r border-gray-200 p-3 font-bold text-gray-700 text-center sticky left-0 z-10">
                          Hora
                        </div>
                        {dias.map((dia) => (
                          <div
                            key={dia}
                            className="bg-gray-100 border-r border-gray-200 last:border-r-0 p-3 font-bold text-gray-700 text-center min-w-[180px]"
                          >
                            {dia}
                          </div>
                        ))}

                        {/* Celdas */}
                        {horas.map((hora) => (
                          <div key={hora} className="contents">
                            <div className="bg-gray-50 border-r border-b border-gray-200 p-2 text-sm text-gray-600 text-center sticky left-0 z-10">
                              {hora}
                            </div>
                            {dias.map((dia) => {
                              const clave = `${dia}-${hora}`;
                              const bloques = celdasMap.get(clave) || [];
                              const isConflict = bloques.length > 1;

                              return (
                                <div
                                  key={clave}
                                  className={`border-r border-b border-gray-200 last:border-r-0 p-3 text-xs text-center h-[52px] overflow-hidden min-w-[180px] ${
                                    bloques.length
                                      ? isConflict
                                        ? "bg-red-100 text-red-900 font-bold border-red-300"
                                        : "bg-blue-100 text-blue-900 font-medium border-blue-300"
                                      : "bg-white"
                                  }`}
                                >
                                  {bloques.map((b, i) => (
                                    <div key={i} className="leading-tight">
                                      <div className="font-medium text-[11px] truncate" title={b.curso}>
                                        {b.curso}
                                      </div>
                                      <div className="text-[10px] text-gray-600 truncate" title={b.docente}>
                                        {b.docente}
                                      </div>
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
                  
                  {/* Indicador de scroll */}
                  <div className="mt-2 text-xs text-gray-500 text-center">
                    💡 Desplace horizontalmente para ver todos los días de la semana
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Botón de confirmación */}
      <div className="flex justify-center mt-8">
        <button
          className="bg-[#0F5BA8] hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          onClick={onComplete}
          disabled={loading || locked || Object.keys(selecciones).length === 0}
        >
          Confirmar selección
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

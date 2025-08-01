// types.ts
export interface StepProps {
  completed: boolean;
  locked: boolean;
  onComplete: () => void;
}

// types.ts
export type Horario = {
  dia: "Lunes" | "Martes" | "Miércoles" | "Jueves" | "Viernes";
  inicio: string;
  fin: string;
};

export type Docente = {
  nombre: string;
  horarios: Horario[];
};

export type Curso = {
  codigo: string;
  nombre: string;
  creditos: number;
  opciones: Docente[];
};


export type CursoSeleccionado = {
  codigo: string;
  nombre: string;
  creditos: number;
  docente: string;
  horarios: Horario[];
};

export type Cuota = {
  numero: number;
  fecha: string; // formato ISO o "YYYY-MM-DD"
  monto: number;
};

export type Props = StepProps & {
  cursos: CursoSeleccionado[];
  cuotas: Cuota[];
  montoTotal: number;
  alumno: DatosAlumno;
};

export type DatosAlumno = {
  nombre: string;
  codigo: string;
  carrera: string;
};
// types.ts
export interface StepProps {
  completed: boolean;
  locked: boolean;
  onComplete: () => void;
}

export interface Step0Props extends StepProps {
  onSelectionChange?: (seleccion: CursoSeleccionado[]) => void;
}

export interface Step1Props extends StepProps {
  cursosSeleccionados?: CursoSeleccionado[];
  onPlanChange?: (plan: PlanPagos) => void;
}

export interface Step2Props extends StepProps {
  cursosSeleccionados?: CursoSeleccionado[];
  planPagos?: PlanPagos;
}

export type PlanPagos = {
  montoTotal: number;
  numeroCuotas: number;
  cuotas: Cuota[];
};

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
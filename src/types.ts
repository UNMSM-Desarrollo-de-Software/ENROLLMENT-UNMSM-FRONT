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

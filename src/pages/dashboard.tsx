import { useEffect, useState } from "react";

interface Enrollment {
  id: number;
  status: string;
  period: number;
  // agrega más propiedades según tu entidad
}

export default function DashboardPage() {
  const [enrollments, setEnrollments] = useState<Enrollment[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const res = await fetch(
          "http://localhost:8080/enrollments?email=jimena.ruizc@unmsm.edu.pe&period=2025-2",
          {
            credentials: "include", // si el endpoint está protegido por token
          }
        );

        if (!res.ok) {
          throw new Error(`Error: ${res.status}`);
        }

        const data = await res.json();
        setEnrollments(data);
      } catch (error) {
        console.error("Error cargando matrículas:", error);
        setEnrollments(null);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollments();
  }, []);

  if (loading) return <p>Cargando...</p>;
  if (!enrollments || enrollments.length === 0) return <p>No hay resultados</p>;
  return (
    <div>
      <h2>Matrículas encontradas:</h2>
      <ul>
        {enrollments.map((e, index) => (
          <li key={index}>
            Curso: {e.status}, Créditos: {e.period}
          </li>
        ))}
      </ul>
    </div>
  );
}

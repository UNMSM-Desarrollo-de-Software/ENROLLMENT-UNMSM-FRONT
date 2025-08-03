import { useEffect, useState } from "react";
import Layout from "./utils/layout";
import FormTitle from "./utils/formTitle";
import TrackingBar from "./enrollment/trackingBar";

interface Enrollment {
  id: number;
  status: string;
  period: number;
  // agrega más propiedades según tu entidad
}

export default function DashboardPage() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
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
        setEnrollments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollments();
  }, []);

  if (loading) return <p>Cargando...</p>;
  return (
    <>
      <Layout>
        <FormTitle text="Matrículas" />
       {
        enrollments.length > 0 ?  <ul>
          {enrollments.map((e, index) => (
            <li key={index}>
              Curso: {e.status}, Créditos: {e.period}
            </li>
          ))}
        </ul>
        : <TrackingBar />
       }
      </Layout>
    </>
  );
}

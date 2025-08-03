import { Step4Props } from "@/types";
import { useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function Step4_Certificate({
  completed,
  locked,
  cursosSeleccionados = [],
  planPagos,
  alumno,
}: Step4Props) {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const generarPDF = async (descargar = true) => {
    // Validar que tengamos los datos necesarios
    if (!cursosSeleccionados.length || !planPagos || !alumno) {
      alert("Faltan datos necesarios para generar la constancia");
      return;
    }

    const doc = new jsPDF();
    const logo = await fetch("/logo.png").then((res) =>
      res.blob().then((blob) => URL.createObjectURL(blob))
    );

    doc.addImage(logo, "PNG", 10, 10, 30, 30);
    doc.setFontSize(16);
    doc.text("CONSTANCIA DE MATRÍCULA", 105, 20, { align: "center" });

    doc.setFontSize(11);
    doc.text(`Nombre: ${alumno.nombre}`, 10, 50);
    doc.text(`Código: ${alumno.codigo}`, 10, 58);
    doc.text(`Carrera: ${alumno.carrera}`, 10, 66);
    doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 10, 74);

    autoTable(doc, {
      startY: 85,
      head: [["Código", "Curso", "Créditos", "Docente", "Horario"]],
      body: cursosSeleccionados.map((c) => [
        c.codigo,
        c.nombre,
        c.creditos,
        c.docente,
        c.horarios.map((h) => `${h.dia} ${h.inicio}-${h.fin}`).join(", "),
      ]),
    });

    autoTable(doc, {
      startY: doc.lastAutoTable!.finalY + 10,
      head: [["#", "Fecha", "Monto"]],
      body: planPagos.cuotas.map((q) => [q.numero, q.fecha, `S/ ${q.monto}`]),
      foot: [["", "Total", `S/ ${planPagos.montoTotal}`]],
    });

    doc.setFontSize(10);
    doc.text(
      "_____________________________",
      140,
      doc.lastAutoTable!.finalY + 40
    );
    doc.text("Coordinación Académica", 150, doc.lastAutoTable!.finalY + 45);

    if (descargar) {
      doc.save("constancia_matricula.pdf");
    } else {
      const pdfBlob = doc.output("blob");
      const url = URL.createObjectURL(pdfBlob);
      setPdfUrl(url);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* Validación de datos necesarios */}
      {(!cursosSeleccionados.length || !planPagos || !alumno) ? (
        <div className="text-center py-8">
          <div className="text-yellow-600 mb-4">
            ⚠️ Faltan datos necesarios para generar la constancia
          </div>
          <div className="text-sm text-gray-600">
            {!cursosSeleccionados.length && "• No hay cursos seleccionados"}
            {!planPagos && "• No hay plan de pagos confirmado"}
            {!alumno && "• No hay información del alumno"}
          </div>
          <p className="mt-4 text-sm">
            Por favor, complete todos los pasos anteriores para continuar.
          </p>
        </div>
      ) : (
        <>
          <h2 className="text-xl font-bold mb-4 text-green-700">
            🎓 Matrícula completada exitosamente
          </h2>

          {/* Resumen de la matrícula */}
          <div className="mb-6 p-4 bg-green-50 rounded-lg">
            <h3 className="font-semibold mb-3">Resumen de tu matrícula:</h3>
            
            <div className="mb-4">
              <h4 className="font-medium text-sm mb-2">Datos del estudiante:</h4>
              <p className="text-sm"><strong>Nombre:</strong> {alumno.nombre}</p>
              <p className="text-sm"><strong>Código:</strong> {alumno.codigo}</p>
              <p className="text-sm"><strong>Carrera:</strong> {alumno.carrera}</p>
            </div>

            <div className="mb-4">
              <h4 className="font-medium text-sm mb-2">Cursos matriculados:</h4>
              <div className="space-y-1">
                {cursosSeleccionados.map((curso, index) => (
                  <p key={index} className="text-sm">
                    • {curso.nombre} ({curso.creditos} créditos) - {curso.docente}
                  </p>
                ))}
              </div>
              <p className="text-sm font-medium mt-2">
                Total créditos: {cursosSeleccionados.reduce((sum, curso) => sum + curso.creditos, 0)}
              </p>
            </div>

            <div>
              <h4 className="font-medium text-sm mb-2">Plan de pagos:</h4>
              <p className="text-sm"><strong>Monto total:</strong> S/. {planPagos.montoTotal.toFixed(2)}</p>
              <p className="text-sm"><strong>Cuotas:</strong> {planPagos.numeroCuotas}</p>
            </div>
          </div>

          <p className="text-sm mb-6 text-gray-700">
            A continuación puedes descargar tu constancia de matrícula:
          </p>

          <div className="flex gap-4 mb-6">
            <button
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              onClick={() => generarPDF(true)}
            >
              Descargar constancia PDF
            </button>
            <button
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              onClick={() => generarPDF(false)}
            >
              Ver constancia en línea
            </button>
          </div>

          {pdfUrl && (
            <iframe
              src={pdfUrl}
              className="w-full h-[600px] border rounded-lg"
              title="Constancia de matrícula"
            ></iframe>
          )}
        </>
      )}

      {locked && !completed && (
        <p className="text-red-600 text-sm">
          Este paso ya no se puede modificar.
        </p>
      )}
    </div>
  );
}

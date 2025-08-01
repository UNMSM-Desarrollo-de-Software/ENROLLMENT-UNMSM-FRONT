import { Props } from "@/types";
import { useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function Step4_Certificate({
  completed,
  locked,
  cursos,
  cuotas,
  montoTotal,
  alumno,
}: Props) {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const generarPDF = async (descargar = true) => {
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
      body: cursos.map((c) => [
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
      body: cuotas.map((q) => [q.numero, q.fecha, `S/ ${q.monto}`]),
      foot: [["", "Total", `S/ ${montoTotal}`]],
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
      <h2 className="text-xl font-bold mb-4 text-green-700">
        🎓 Matrícula completada exitosamente
      </h2>

      <p className="text-sm mb-6 text-gray-700">
        A continuación puedes descargar tu constancia de matrícula:
      </p>

      <div className="flex gap-4 mb-6">
        <button
          className="px-6 py-2 bg-blue-600 text-white rounded-lg"
          onClick={() => generarPDF(true)}
        >
          Descargar constancia PDF
        </button>
        <button
          className="px-6 py-2 bg-green-600 text-white rounded-lg"
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

      {locked && !completed && (
        <p className="text-red-600 text-sm">
          Este paso ya no se puede modificar.
        </p>
      )}
    </div>
  );
}

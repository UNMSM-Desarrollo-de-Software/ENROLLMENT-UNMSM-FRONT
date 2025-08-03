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
    <div className="max-w-4xl mx-auto p-6">
      {/* Validación de datos necesarios */}
      {(!cursosSeleccionados.length || !planPagos || !alumno) ? (
        <div className="text-center py-12">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-md mx-auto">
            <div className="text-yellow-600 mb-4 font-medium">
              ⚠️ Faltan datos necesarios para generar la constancia
            </div>
            <div className="text-sm text-gray-600 mb-4">
              {!cursosSeleccionados.length && "• No hay cursos seleccionados"}
              {!planPagos && "• No hay plan de pagos confirmado"}
              {!alumno && "• No hay información del alumno"}
            </div>
            <p className="text-sm text-gray-700">
              Por favor, complete todos los pasos anteriores para continuar.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-3 text-green-700">
              🎓 ¡Matrícula Completada Exitosamente!
            </h2>
            <p className="text-gray-600">Su proceso de matrícula ha sido finalizado correctamente</p>
          </div>

          {/* Resumen de la matrícula */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Resumen de su Matrícula</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Datos del estudiante */}
              <div className="bg-white rounded-lg p-4 border border-green-200">
                <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
                  <span className="text-blue-600 mr-2">👤</span>
                  Datos del Estudiante
                </h4>
                <div className="space-y-2">
                  <p className="text-sm"><span className="font-medium">Nombre:</span> {alumno.nombre}</p>
                  <p className="text-sm"><span className="font-medium">Código:</span> {alumno.codigo}</p>
                  <p className="text-sm"><span className="font-medium">Carrera:</span> {alumno.carrera}</p>
                </div>
              </div>

              {/* Cursos matriculados */}
              <div className="bg-white rounded-lg p-4 border border-green-200">
                <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
                  <span className="text-purple-600 mr-2">📚</span>
                  Cursos Matriculados
                </h4>
                <div className="space-y-2">
                  {cursosSeleccionados.map((curso, index) => (
                    <div key={index} className="text-sm">
                      <div className="font-medium text-gray-800">{curso.nombre}</div>
                      <div className="text-gray-600">{curso.creditos} créditos • {curso.docente}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-3 pt-2 border-t border-green-200">
                  <span className="text-sm font-semibold text-green-700">
                    Total: {cursosSeleccionados.reduce((sum, curso) => sum + curso.creditos, 0)} créditos
                  </span>
                </div>
              </div>

              {/* Plan de pagos */}
              <div className="bg-white rounded-lg p-4 border border-green-200">
                <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
                  <span className="text-green-600 mr-2">💰</span>
                  Plan de Pagos
                </h4>
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="font-medium">Monto total:</span> 
                    <span className="text-green-600 font-bold ml-1">S/. {planPagos.montoTotal.toFixed(2)}</span>
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Cuotas:</span> {planPagos.numeroCuotas}
                  </p>
                  <div className="mt-2 pt-2 border-t border-green-200">
                    <div className="text-xs text-gray-600">
                      {planPagos.cuotas.map((cuota, index) => (
                        <div key={index}>
                          Cuota {cuota.numero}: S/. {cuota.monto.toFixed(2)} - {cuota.fecha}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Constancia */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-700">Constancia de Matrícula</h3>
              <p className="text-sm text-gray-600 mt-1">
                Descargue o visualice su constancia oficial de matrícula
              </p>
            </div>

            <div className="p-6">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
                  onClick={() => generarPDF(true)}
                >
                  <span className="mr-2">📄</span>
                  Descargar Constancia PDF
                </button>
                <button
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
                  onClick={() => generarPDF(false)}
                >
                  <span className="mr-2">👁️</span>
                  Ver Constancia en Línea
                </button>
              </div>

              {pdfUrl && (
                <div className="mt-6">
                  <h4 className="font-semibold text-gray-700 mb-3">Vista previa de la constancia:</h4>
                  <div className="border border-gray-300 rounded-lg overflow-hidden">
                    <iframe
                      src={pdfUrl}
                      className="w-full h-[600px]"
                      title="Constancia de matrícula"
                    ></iframe>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

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

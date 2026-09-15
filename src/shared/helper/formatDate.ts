const DIAS = [ 
    "Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado",
]

const MESES = [
  "Enero", "Febrero", "Marzo",
  "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre",
  "Octubre", "Noviembre", "Diciembre",
]


export function formatDate(fecha: Date) {
    const date = typeof fecha === "string" ? new Date(fecha) : fecha

  const diaSemana = DIAS[date.getDay()]
  const dia = String(date.getDate()).padStart(2, "0")
  const mes = MESES[date.getMonth()]

  return `${diaSemana} ${dia} de ${mes}`
}
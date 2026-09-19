export function formatDate(fecha: Date | string): string {
  if (!fecha) return '';

  let date: Date;
  let year: number;
  let monthIndex: number;
  let day: number;

  if (typeof fecha === 'string') {
    const match = fecha.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (match) {
      year = Number(match[1]);
      monthIndex = Number(match[2]) - 1; // Meses en JS son 0-11
      day = Number(match[3]);
    } else {
      const parsedDate = new Date(fecha);
      if (isNaN(parsedDate.getTime())) return '';
      year = parsedDate.getUTCFullYear();
      monthIndex = parsedDate.getUTCMonth();
      day = parsedDate.getUTCDate();
    }
  } else {
    if (isNaN(fecha.getTime())) return '';
    year = fecha.getUTCFullYear();
    monthIndex = fecha.getUTCMonth();
    day = fecha.getUTCDate();
  }

  const localDate = new Date(year, monthIndex, day);

  // Formatea automáticamente a "Martes 01 de Septiembre" en español
  const formatted = new Intl.DateTimeFormat('es-ES', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
  }).format(localDate);

  // Capitalizamos la primera letra (ej. "martes 01 de septiembre" -> "Martes 01 de Septiembre")
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}
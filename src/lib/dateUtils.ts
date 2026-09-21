export function formatTripDate(dateIso: string) {
  const date = new Date(dateIso + "T12:00:00");

  if (Number.isNaN(date.getTime())) return dateIso;

  return new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  }).format(date);
}

export function getWeekdayLabel(dateIso: string) {
  const date = new Date(dateIso + "T12:00:00");

  if (Number.isNaN(date.getTime())) return dateIso;

  const label = new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
  }).format(date);

  return label.charAt(0).toUpperCase() + label.slice(1);
}

export function toLocalDateIso(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return year + "-" + month + "-" + day;
}

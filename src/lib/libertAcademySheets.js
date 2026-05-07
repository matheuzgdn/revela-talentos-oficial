const DEFAULT_GOOGLE_SHEETS_WEBHOOK_URL =
  "https://script.google.com/macros/s/AKfycbxn7yRY60VH-yNNwobvs9Mcpo9-Y9qa01Mhr7aBwKrZvoLBAvfEBhnnJn39kW-RKFkn/exec";

const GOOGLE_SHEETS_WEBHOOK_URL =
  import.meta.env.VITE_GOOGLE_SHEETS_LIBERTACADEMY_WEBHOOK_URL ||
  import.meta.env.VITE_GOOGLE_SHEETS_SCHOOL_PARTNER_WEBHOOK_URL ||
  DEFAULT_GOOGLE_SHEETS_WEBHOOK_URL;

const normalizeText = (value = "") => String(value).trim().replace(/\s+/g, " ");

function buildLibertAcademySheetsPayload(payload = {}) {
  const schoolName = normalizeText(payload.school_name);

  return {
    submitted_at: new Date().toISOString(),
    page: "libertacademy",
    flow: "athlete_registration",
    event_name: "LibertAcademy - Campeonato de Escuelas",
    event_city: "Buenos Aires",
    event_country: "Argentina",
    event_dates: "21 a 25 de julho",
    school_name: schoolName,
    school: schoolName,
    school_group_key: schoolName.toLowerCase(),
    athlete_full_name: normalizeText(payload.athlete_full_name),
    full_name: normalizeText(payload.athlete_full_name),
    birth_date: payload.birth_date,
    document_id: normalizeText(payload.document_id),
    cpf: normalizeText(payload.document_id),
    category: payload.category,
    language: payload.language,
    source: "libertacademy-public-page",
  };
}

export async function syncLibertAcademyRegistrationToSheets(payload) {
  if (!GOOGLE_SHEETS_WEBHOOK_URL) {
    return { skipped: true, reason: "missing_webhook_url" };
  }

  await fetch(GOOGLE_SHEETS_WEBHOOK_URL, {
    method: "POST",
    mode: "no-cors",
    headers: {
      "Content-Type": "text/plain;charset=utf-8",
    },
    body: JSON.stringify(buildLibertAcademySheetsPayload(payload)),
  });

  return { skipped: false };
}

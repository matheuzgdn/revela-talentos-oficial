const DEFAULT_GOOGLE_SHEETS_WEBHOOK_URL =
  "https://script.google.com/macros/s/AKfycbxn7yRY60VH-yNNwobvs9Mcpo9-Y9qa01Mhr7aBwKrZvoLBAvfEBhnnJn39kW-RKFkn/exec";

const GOOGLE_SHEETS_WEBHOOK_URL =
  import.meta.env.VITE_GOOGLE_SHEETS_SCHOOL_PARTNER_WEBHOOK_URL ||
  DEFAULT_GOOGLE_SHEETS_WEBHOOK_URL;

function buildSchoolPartnerSheetsPayload({ flow, payload, page = "escolas-parceiras" }) {
  const submittedAt = new Date().toISOString();
  const isParentsAthletesTraffic = page === "pais-atletas";
  const source = isParentsAthletesTraffic ? "trafego" : "revela-talentos";

  return {
    submitted_at: submittedAt,
    flow,
    full_name: payload.full_name,
    email: payload.email,
    phone: payload.phone,
    school: payload.school,
    source,
    local_trafego: isParentsAthletesTraffic ? "trafego" : "",
    page,
  };
}

export function hasSchoolPartnerSheetsWebhook() {
  return Boolean(GOOGLE_SHEETS_WEBHOOK_URL);
}

export async function syncSchoolPartnerLeadToSheets({ flow, payload, page }) {
  if (!GOOGLE_SHEETS_WEBHOOK_URL) {
    return { skipped: true, reason: "missing_webhook_url" };
  }

  await fetch(GOOGLE_SHEETS_WEBHOOK_URL, {
    method: "POST",
    mode: "no-cors",
    headers: {
      "Content-Type": "text/plain;charset=utf-8",
    },
    body: JSON.stringify(buildSchoolPartnerSheetsPayload({ flow, payload, page })),
  });

  return { skipped: false };
}

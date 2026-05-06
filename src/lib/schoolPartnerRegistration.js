const SCHOOL_PARTNER_PREREG_STORAGE_KEY = "school_partner_pre_registration_v1";

export function normalizeSchoolPartnerPhone(value = "") {
  return String(value).replace(/\D/g, "").slice(0, 11);
}

export function formatSchoolPartnerPhone(value = "") {
  const digits = normalizeSchoolPartnerPhone(value);
  if (digits.length <= 2) return digits;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export function createSchoolPartnerFormState(value = {}) {
  return {
    full_name: value?.full_name || "",
    phone: formatSchoolPartnerPhone(value?.phone || ""),
    email: value?.email || "",
    school: value?.school || "",
  };
}

export function readSchoolPartnerPreRegistration() {
  if (typeof window === "undefined") return null;

  try {
    const rawValue = window.localStorage.getItem(SCHOOL_PARTNER_PREREG_STORAGE_KEY);
    if (!rawValue) return null;

    const parsed = JSON.parse(rawValue);
    if (!parsed || typeof parsed !== "object") return null;

    return {
      full_name: typeof parsed.full_name === "string" ? parsed.full_name : "",
      phone: normalizeSchoolPartnerPhone(parsed.phone || ""),
      email: typeof parsed.email === "string" ? parsed.email : "",
      school: typeof parsed.school === "string" ? parsed.school : "",
      last_choice: typeof parsed.last_choice === "string" ? parsed.last_choice : "",
      last_choice_at: typeof parsed.last_choice_at === "string" ? parsed.last_choice_at : "",
      pre_registered_at: typeof parsed.pre_registered_at === "string" ? parsed.pre_registered_at : "",
    };
  } catch {
    return null;
  }
}

export function writeSchoolPartnerPreRegistration(value = {}) {
  if (typeof window === "undefined") return;

  try {
    const normalizedValue = {
      full_name: typeof value.full_name === "string" ? value.full_name.trim() : "",
      phone: normalizeSchoolPartnerPhone(value.phone || ""),
      email: typeof value.email === "string" ? value.email.trim() : "",
      school: typeof value.school === "string" ? value.school.trim() : "",
      last_choice: typeof value.last_choice === "string" ? value.last_choice : "",
      last_choice_at: typeof value.last_choice_at === "string" ? value.last_choice_at : "",
      pre_registered_at: typeof value.pre_registered_at === "string" ? value.pre_registered_at : "",
    };

    window.localStorage.setItem(
      SCHOOL_PARTNER_PREREG_STORAGE_KEY,
      JSON.stringify(normalizedValue)
    );
  } catch {
    // Ignora falhas de storage em navegadores restritos.
  }
}

export function hasCompleteSchoolPartnerPreRegistration(value = {}) {
  return Boolean(
    value?.full_name &&
    value?.email &&
    normalizeSchoolPartnerPhone(value?.phone || "").length >= 10 &&
    value?.school
  );
}

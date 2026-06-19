import { supabase } from "@/api/supabaseClient";

export const LIBERT_ACADEMY_CATEGORIES = ["Sub10", "Sub12", "Sub14"];
export const LIBERT_ACADEMY_ACCESS_SLUG = "acesso";

export const normalizeLibertAcademySlug = (value = "") =>
  String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const getLibertAcademyRegistrationUrl = (slug, origin = window.location.origin) => {
  const normalizedSlug = normalizeLibertAcademySlug(slug);
  return normalizedSlug
    ? `${origin}/libertacademy?school=${encodeURIComponent(normalizedSlug)}`
    : `${origin}/libertacademy`;
};

export const getLibertAcademyAccessUrl = (origin = window.location.origin) =>
  `${origin}/libertacademy/escola/${LIBERT_ACADEMY_ACCESS_SLUG}`;

export const getLibertAcademyPortalUrl = (slug, accessKey, origin = window.location.origin) => {
  const normalizedSlug = normalizeLibertAcademySlug(slug);
  if (!normalizedSlug || normalizedSlug === LIBERT_ACADEMY_ACCESS_SLUG) {
    const keySuffix = accessKey ? `?senha=${encodeURIComponent(accessKey)}` : "";
    return `${getLibertAcademyAccessUrl(origin)}${keySuffix}`;
  }

  const keySuffix = accessKey ? `?key=${encodeURIComponent(accessKey)}` : "";
  return `${origin}/libertacademy/escola/${encodeURIComponent(normalizedSlug)}${keySuffix}`;
};

export async function getLibertAcademyPublicSchool(slug) {
  const normalizedSlug = normalizeLibertAcademySlug(slug);
  if (!normalizedSlug) return null;

  const { data, error } = await supabase
    .rpc("libertacademy_get_public_school", { p_school_slug: normalizedSlug })
    .maybeSingle();

  if (error) throw error;
  return data || null;
}

export async function submitLibertAcademyRegistration(payload = {}) {
  const { data, error } = await supabase
    .rpc("libertacademy_submit_registration", {
      p_school_slug: payload.school_slug || null,
      p_school_name: payload.school_name,
      p_athlete_full_name: payload.athlete_full_name,
      p_birth_date: payload.birth_date || null,
      p_document_id: payload.document_id || null,
      p_category: payload.category,
      p_language: payload.language || "pt",
      p_contact_name: payload.contact_name || null,
      p_contact_email: payload.contact_email || null,
      p_contact_phone: payload.contact_phone || null,
      p_source: payload.source || "libertacademy-public-page",
    })
    .single();

  if (error) throw error;
  return data;
}

export async function getLibertAcademySchoolPortal(slug, accessKey) {
  const normalizedSlug = normalizeLibertAcademySlug(slug);
  if (!accessKey) {
    throw new Error("Informe a senha da escola.");
  }

  const { data, error } = await supabase
    .rpc("libertacademy_get_school_portal", {
      p_school_slug: normalizedSlug && normalizedSlug !== LIBERT_ACADEMY_ACCESS_SLUG ? normalizedSlug : null,
      p_access_key: accessKey,
    })
    .single();

  if (error) throw error;
  return {
    ...data,
    registrations: Array.isArray(data?.registrations) ? data.registrations : [],
    category_counts: data?.category_counts || {},
  };
}

export async function updateLibertAcademySchoolRegistration(slug, accessKey, registrationId, payload = {}) {
  const normalizedSlug = normalizeLibertAcademySlug(slug);
  if (!accessKey || !registrationId) {
    throw new Error("Dados de acesso da escola invalidos.");
  }

  const { data, error } = await supabase.rpc("libertacademy_update_school_registration", {
    p_school_slug: normalizedSlug || null,
    p_access_key: accessKey,
    p_registration_id: registrationId,
    p_athlete_full_name: payload.athlete_full_name,
    p_birth_date: payload.birth_date || null,
    p_document_id: payload.document_id || null,
    p_category: payload.category || null,
  });

  if (error) throw error;
  return data;
}

export async function createLibertAcademySchoolRegistration(slug, accessKey, payload = {}) {
  const normalizedSlug = normalizeLibertAcademySlug(slug);
  if (!normalizedSlug || !accessKey) {
    throw new Error("Dados de acesso da escola invalidos.");
  }

  const { data, error } = await supabase.rpc("libertacademy_create_school_registration", {
    p_school_slug: normalizedSlug,
    p_access_key: accessKey,
    p_athlete_full_name: payload.athlete_full_name,
    p_birth_date: payload.birth_date || null,
    p_document_id: payload.document_id || null,
    p_category: payload.category || null,
  });

  if (error) throw error;
  return data;
}

export async function deleteLibertAcademySchoolRegistration(slug, accessKey, registrationId) {
  const normalizedSlug = normalizeLibertAcademySlug(slug);
  if (!normalizedSlug || !accessKey || !registrationId) {
    throw new Error("Dados de acesso da escola invalidos.");
  }

  const { data, error } = await supabase.rpc("libertacademy_delete_school_registration", {
    p_school_slug: normalizedSlug,
    p_access_key: accessKey,
    p_registration_id: registrationId,
  });

  if (error) throw error;
  return data;
}

export async function getLibertAcademyAdminPortal() {
  const { data, error } = await supabase
    .rpc("libertacademy_get_admin_portal");

  if (error) throw error;
  return {
    ...data,
    schools: Array.isArray(data?.schools) ? data.schools : [],
  };
}

import { supabase } from "@/api/supabaseClient";

export const LIBERT_ACADEMY_CATEGORIES = ["Sub10", "Sub12", "Sub14"];

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

export const getLibertAcademyPortalUrl = (slug, accessKey, origin = window.location.origin) => {
  const normalizedSlug = normalizeLibertAcademySlug(slug);
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
  if (!normalizedSlug || !accessKey) {
    throw new Error("Informe a escola e a chave de acesso.");
  }

  const { data, error } = await supabase
    .rpc("libertacademy_get_school_portal", {
      p_school_slug: normalizedSlug,
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

import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  CalendarDays,
  CheckCircle2,
  Clipboard,
  Globe2,
  LockKeyhole,
  MapPin,
  ShieldCheck,
  Trophy,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { syncLibertAcademyRegistrationToSheets } from "@/lib/libertAcademySheets";
import {
  LIBERT_ACADEMY_CATEGORIES,
  getLibertAcademyPortalUrl,
  getLibertAcademyPublicSchool,
  getLibertAcademyRegistrationUrl,
  normalizeLibertAcademySlug,
  submitLibertAcademyRegistration,
} from "@/lib/libertAcademySupabase";

const copy = {
  pt: {
    langLabel: "PT",
    otherLang: "ES",
    title: "LibertAcademy",
    eyebrow: "Campeonato de Escolas",
    location: "Buenos Aires, Argentina",
    dates: "21 a 25 de julho",
    heroTitle: "Cadastro oficial de atletas por escola",
    heroText:
      "Cada escola participante tem seu proprio link de cadastro e um painel privado para acompanhar apenas os seus alunos.",
    cta: "Cadastrar atleta",
    portalCta: "Acesso da escola",
    formTitle: "Ficha do atleta",
    formText: "Preencha os dados do atleta. A inscricao fica vinculada automaticamente a escola correta.",
    newSchoolText:
      "Para escolas novas, preencha o nome da escola e cadastre o primeiro atleta. O sistema cria os links da escola automaticamente.",
    fullName: "Nome completo",
    fullNamePlaceholder: "Nome completo do atleta",
    birthDate: "Data de nascimento",
    documentId: "CPF (opcional)",
    documentPlaceholder: "CPF do atleta, se tiver",
    schoolName: "Nome da escola",
    schoolPlaceholder: "Nome da escola participante",
    contactDetails: "Dados da escola (opcional)",
    contactDetailsText: "Use somente se quiser deixar um contato para a organizacao ou receber os links depois.",
    contactName: "Responsavel da escola",
    contactNamePlaceholder: "Nome do responsavel",
    contactEmail: "E-mail do responsavel (opcional)",
    contactPhone: "WhatsApp do responsavel (opcional)",
    category: "Categoria",
    categoryPlaceholder: "Selecione a categoria",
    submit: "Cadastrar atleta",
    submitting: "Enviando...",
    loadingSchool: "Carregando escola...",
    schoolNotFound: "Escola nao encontrada. O formulario foi aberto em modo geral.",
    success: "Cadastro enviado com sucesso.",
    newSchoolSuccess: "Escola criada. Guarde o link do painel e a senha da escola.",
    errorRequired: "Preencha nome completo, data de nascimento, escola e categoria.",
    errorGeneral: "Nao foi possivel enviar o cadastro agora. Tente novamente.",
    copy: "Copiar",
    copied: "Copiado.",
    registrationLink: "Link de cadastro da escola",
    portalLink: "Link privado do painel",
    portalPassword: "Senha da escola",
    portalWarning: "Compartilhe o link do painel e a senha apenas com o responsavel da escola.",
    ruleOne: "Categorias Sub10, Sub12 e Sub14.",
    ruleTwo: "Disputa em Buenos Aires, Argentina.",
    ruleThree: "Painel privado por escola, sem acesso aos dados de outras equipes.",
    footer: "LibertAcademy - Campeonato de Escolas",
  },
  es: {
    langLabel: "ES",
    otherLang: "PT",
    title: "LibertAcademy",
    eyebrow: "Campeonato de Escuelas",
    location: "Buenos Aires, Argentina",
    dates: "21 al 25 de julio",
    heroTitle: "Registro oficial de atletas por escuela",
    heroText:
      "Cada escuela participante tiene su propio enlace de registro y un panel privado para acompanhar solo a sus alumnos.",
    cta: "Registrar atleta",
    portalCta: "Acceso de la escuela",
    formTitle: "Ficha del atleta",
    formText: "Completa los datos del atleta. La inscripcion queda vinculada automaticamente a la escuela correcta.",
    newSchoolText:
      "Para nuevas escuelas, completa el nombre de la escuela y registra el primer atleta. El sistema crea los enlaces automaticamente.",
    fullName: "Nombre completo",
    fullNamePlaceholder: "Nombre completo del atleta",
    birthDate: "Fecha de nacimiento",
    documentId: "CPF (opcional)",
    documentPlaceholder: "CPF del atleta, si tiene",
    schoolName: "Nombre de la escuela",
    schoolPlaceholder: "Nombre de la escuela participante",
    contactDetails: "Datos de la escuela (opcional)",
    contactDetailsText: "Usa solo si quieres dejar un contacto para la organizacion o recibir los enlaces despues.",
    contactName: "Responsable de la escuela",
    contactNamePlaceholder: "Nombre del responsable",
    contactEmail: "E-mail del responsable (opcional)",
    contactPhone: "WhatsApp del responsable (opcional)",
    category: "Categoria",
    categoryPlaceholder: "Selecciona la categoria",
    submit: "Registrar atleta",
    submitting: "Enviando...",
    loadingSchool: "Cargando escuela...",
    schoolNotFound: "Escuela no encontrada. El formulario se abrio en modo general.",
    success: "Registro enviado con exito.",
    newSchoolSuccess: "Escuela creada. Guarda el enlace del panel y la contrasena de la escuela.",
    errorRequired: "Completa nombre, fecha de nacimiento, escuela y categoria.",
    errorGeneral: "No fue posible enviar el registro ahora. Intentalo nuevamente.",
    copy: "Copiar",
    copied: "Copiado.",
    registrationLink: "Enlace de registro de la escuela",
    portalLink: "Enlace privado del panel",
    portalPassword: "Contrasena de la escuela",
    portalWarning: "Comparte el enlace del panel y la contrasena solamente con el responsable de la escuela.",
    ruleOne: "Categorias Sub10, Sub12 y Sub14.",
    ruleTwo: "Competencia en Buenos Aires, Argentina.",
    ruleThree: "Panel privado por escuela, sin acceso a datos de otros equipos.",
    footer: "LibertAcademy - Campeonato de Escuelas",
  },
};

const initialForm = {
  athlete_full_name: "",
  birth_date: "",
  document_id: "",
  school_name: "",
  contact_name: "",
  contact_email: "",
  contact_phone: "",
  category: "",
};

function normalizeValue(value = "") {
  return String(value).trim().replace(/\s+/g, " ");
}

function LinkBox({ label, value, onCopy, warning }) {
  if (!value) return null;

  return (
    <div className="rounded-lg border border-white/10 bg-black/20 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#f2c94c]">{label}</p>
          <a
            href={value}
            target="_blank"
            rel="noreferrer"
            className="mt-2 block break-all text-sm font-semibold leading-6 text-white/82 hover:text-white"
          >
            {value}
          </a>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onCopy(value)}
          className="shrink-0 rounded-md border-white/15 bg-white/5 text-white hover:bg-white/10"
        >
          <Clipboard className="mr-2 h-4 w-4" />
          Copiar
        </Button>
      </div>
      {warning && <p className="mt-3 text-xs leading-5 text-amber-100/70">{warning}</p>}
    </div>
  );
}

function SecretBox({ label, value, onCopy }) {
  if (!value) return null;

  return (
    <div className="rounded-lg border border-white/10 bg-black/20 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#f2c94c]">{label}</p>
          <code className="mt-2 block break-all text-base font-black leading-6 text-white">{value}</code>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onCopy(value)}
          className="shrink-0 rounded-md border-white/15 bg-white/5 text-white hover:bg-white/10"
        >
          <Clipboard className="mr-2 h-4 w-4" />
          Copiar
        </Button>
      </div>
    </div>
  );
}

export default function LibertAcademy() {
  const [searchParams] = useSearchParams();
  const schoolSlugParam = normalizeLibertAcademySlug(
    searchParams.get("school") || searchParams.get("escola") || ""
  );
  const [language, setLanguage] = useState("pt");
  const [formData, setFormData] = useState(initialForm);
  const [linkedSchool, setLinkedSchool] = useState(null);
  const [isLoadingSchool, setIsLoadingSchool] = useState(Boolean(schoolSlugParam));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState(null);
  const t = copy[language];

  const statItems = useMemo(
    () => [
      { icon: MapPin, label: t.location },
      { icon: CalendarDays, label: t.dates },
      { icon: Users, label: LIBERT_ACADEMY_CATEGORIES.join(" / ") },
    ],
    [t]
  );

  const isSchoolLocked = Boolean(linkedSchool?.slug);
  const schoolRegistrationUrl = submitResult?.school_slug
    ? getLibertAcademyRegistrationUrl(submitResult.school_slug)
    : linkedSchool?.slug
      ? getLibertAcademyRegistrationUrl(linkedSchool.slug)
      : "";
  const schoolPortalUrl = submitResult?.school_created
    ? getLibertAcademyPortalUrl(submitResult.school_slug)
    : "";
  const schoolPortalPassword = submitResult?.school_created ? submitResult.school_portal_password : "";

  useEffect(() => {
    document.title = `${t.title} - ${t.location}`;
  }, [t]);

  useEffect(() => {
    let isMounted = true;

    const loadSchool = async () => {
      if (!schoolSlugParam) {
        setIsLoadingSchool(false);
        return;
      }

      setIsLoadingSchool(true);
      try {
        const school = await getLibertAcademyPublicSchool(schoolSlugParam);
        if (!isMounted) return;

        if (school) {
          setLinkedSchool(school);
          setFormData((current) => ({ ...current, school_name: school.name }));
        } else {
          toast.info(t.schoolNotFound);
        }
      } catch (error) {
        console.error("LibertAcademy school lookup error:", error);
        if (isMounted) toast.error(t.schoolNotFound);
      } finally {
        if (isMounted) setIsLoadingSchool(false);
      }
    };

    loadSchool();

    return () => {
      isMounted = false;
    };
  }, [schoolSlugParam, t.schoolNotFound]);

  const handleCopy = async (value) => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success(t.copied);
    } catch {
      toast.error(value);
    }
  };

  const handleFieldChange = (field, value) => {
    setSubmitResult(null);
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const validateForm = () =>
    Boolean(
      normalizeValue(formData.athlete_full_name) &&
      formData.birth_date &&
      normalizeValue(formData.school_name) &&
      formData.category
    );

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      toast.error(t.errorRequired);
      return;
    }

    setIsSubmitting(true);

    const payload = {
      ...formData,
      athlete_full_name: normalizeValue(formData.athlete_full_name),
      document_id: normalizeValue(formData.document_id),
      school_name: isSchoolLocked ? linkedSchool.name : normalizeValue(formData.school_name),
      contact_name: normalizeValue(formData.contact_name),
      contact_email: normalizeValue(formData.contact_email).toLowerCase(),
      contact_phone: normalizeValue(formData.contact_phone),
      school_slug: linkedSchool?.slug || null,
      language,
      source: "libertacademy-public-page",
    };

    try {
      const result = await submitLibertAcademyRegistration(payload);

      syncLibertAcademyRegistrationToSheets({
        ...payload,
        school_slug: result.school_slug,
      }).catch((error) => {
        console.warn("LibertAcademy sheets sync failed:", error);
      });

      setSubmitResult(result);
      setFormData((current) => ({
        ...initialForm,
        school_name: isSchoolLocked ? current.school_name : "",
      }));
      toast.success(result.school_created ? t.newSchoolSuccess : t.success);
    } catch (error) {
      console.error("LibertAcademy registration error:", error);
      toast.error(error?.message || t.errorGeneral);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#080806] text-white">
      <div className="relative z-10">
        <header className="sticky top-0 z-40 border-b border-white/10 bg-[#080806]/92 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-[#f2c94c]/50 bg-[#f2c94c]/12">
                <Trophy className="h-5 w-5 text-[#f2c94c]" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[#f2c94c]">{t.eyebrow}</p>
                <h1 className="text-lg font-black tracking-tight">{t.title}</h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {linkedSchool?.slug && (
                <Button asChild variant="outline" className="hidden rounded-md border-white/15 bg-white/5 text-white hover:bg-white/10 sm:inline-flex">
                  <Link to={`/libertacademy/escola/${linkedSchool.slug}`}>
                    <LockKeyhole className="mr-2 h-4 w-4" />
                    {t.portalCta}
                  </Link>
                </Button>
              )}
              <Button
                type="button"
                variant="outline"
                onClick={() => setLanguage((current) => (current === "pt" ? "es" : "pt"))}
                className="h-10 gap-2 rounded-md border-white/15 bg-white/5 px-4 text-white hover:bg-white/10"
              >
                <Globe2 className="h-4 w-4" />
                {t.otherLang}
              </Button>
            </div>
          </div>
        </header>

        <section className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 sm:py-14 lg:grid-cols-[1fr_0.95fr] lg:px-8">
          <div className="flex flex-col justify-center">
            <Badge className="mb-5 w-fit rounded-md border border-[#f2c94c]/30 bg-[#f2c94c]/12 px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.22em] text-[#f2c94c]">
              {linkedSchool?.name || t.location}
            </Badge>
            <h2 className="max-w-3xl text-4xl font-black leading-[1.02] tracking-tight text-white sm:text-5xl lg:text-6xl">
              {t.heroTitle}
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-7 text-white/70 sm:text-lg">
              {t.heroText}
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {statItems.map((item) => (
                <div key={item.label} className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
                  <item.icon className="h-5 w-5 text-[#f2c94c]" />
                  <p className="mt-3 text-sm font-bold leading-5 text-white/86">{item.label}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 grid gap-3 text-sm leading-6 text-white/72">
              <div className="flex gap-3 rounded-lg border border-white/10 bg-white/[0.04] p-4">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-300" />
                <span>{isSchoolLocked ? t.formText : t.newSchoolText}</span>
              </div>
            </div>
          </div>

          <section id="inscricao" className="rounded-lg border border-white/12 bg-[#11110d]/95 p-5 shadow-[0_24px_70px_rgba(0,0,0,0.32)] sm:p-7">
            <div className="mb-6">
              <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#f2c94c]">{t.formTitle}</p>
              <h3 className="mt-3 text-2xl font-black text-white sm:text-3xl">{t.cta}</h3>
              <p className="mt-2 text-sm leading-6 text-white/60">
                {isLoadingSchool ? t.loadingSchool : t.formText}
              </p>
            </div>

            {submitResult && (
              <div className="mb-5 space-y-3 rounded-lg border border-emerald-400/25 bg-emerald-400/10 p-4 text-sm text-emerald-100">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-300" />
                  <span>{submitResult.school_created ? t.newSchoolSuccess : t.success}</span>
                </div>
                <LinkBox label={t.registrationLink} value={schoolRegistrationUrl} onCopy={handleCopy} />
                <LinkBox label={t.portalLink} value={schoolPortalUrl} onCopy={handleCopy} warning={t.portalWarning} />
                <SecretBox label={t.portalPassword} value={schoolPortalPassword} onCopy={handleCopy} />
              </div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="libert-full-name" className="text-white/82">{t.fullName}</Label>
                <Input
                  id="libert-full-name"
                  value={formData.athlete_full_name}
                  onChange={(event) => handleFieldChange("athlete_full_name", event.target.value)}
                  placeholder={t.fullNamePlaceholder}
                  autoComplete="name"
                  className="h-12 rounded-md border-white/12 bg-white/[0.04] text-white placeholder:text-white/35"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="libert-birth-date" className="text-white/82">{t.birthDate}</Label>
                  <Input
                    id="libert-birth-date"
                    type="date"
                    value={formData.birth_date}
                    onChange={(event) => handleFieldChange("birth_date", event.target.value)}
                    className="h-12 rounded-md border-white/12 bg-white/[0.04] text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="libert-document" className="text-white/82">{t.documentId}</Label>
                  <Input
                    id="libert-document"
                    value={formData.document_id}
                    onChange={(event) => handleFieldChange("document_id", event.target.value)}
                    placeholder={t.documentPlaceholder}
                    inputMode="numeric"
                    className="h-12 rounded-md border-white/12 bg-white/[0.04] text-white placeholder:text-white/35"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="libert-school" className="text-white/82">{t.schoolName}</Label>
                  <Input
                    id="libert-school"
                    value={formData.school_name}
                    onChange={(event) => handleFieldChange("school_name", event.target.value)}
                    placeholder={t.schoolPlaceholder}
                    autoComplete="organization"
                    readOnly={isSchoolLocked}
                    className="h-12 rounded-md border-white/12 bg-white/[0.04] text-white placeholder:text-white/35 read-only:bg-white/[0.08]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="libert-category" className="text-white/82">{t.category}</Label>
                  <select
                    id="libert-category"
                    value={formData.category}
                    onChange={(event) => handleFieldChange("category", event.target.value)}
                    className="h-12 w-full rounded-md border border-white/12 bg-[#15150f] px-3 text-sm text-white outline-none ring-offset-background focus:ring-2 focus:ring-[#f2c94c]/50"
                  >
                    <option value="" className="bg-[#11110d]">{t.categoryPlaceholder}</option>
                    {LIBERT_ACADEMY_CATEGORIES.map((category) => (
                      <option key={category} value={category} className="bg-[#11110d]">{category}</option>
                    ))}
                  </select>
                </div>
              </div>

              {!isSchoolLocked && (
                <details className="rounded-md border border-white/10 bg-white/[0.025] p-4">
                  <summary className="cursor-pointer text-sm font-bold text-white/82">{t.contactDetails}</summary>
                  <p className="mt-2 text-xs leading-5 text-white/52">{t.contactDetailsText}</p>
                  <div className="mt-4 grid gap-4 sm:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="libert-contact-name" className="text-white/82">{t.contactName}</Label>
                      <Input
                        id="libert-contact-name"
                        value={formData.contact_name}
                        onChange={(event) => handleFieldChange("contact_name", event.target.value)}
                        placeholder={t.contactNamePlaceholder}
                        autoComplete="name"
                        className="h-12 rounded-md border-white/12 bg-white/[0.04] text-white placeholder:text-white/35"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="libert-contact-email" className="text-white/82">{t.contactEmail}</Label>
                      <Input
                        id="libert-contact-email"
                        type="email"
                        value={formData.contact_email}
                        onChange={(event) => handleFieldChange("contact_email", event.target.value)}
                        placeholder="email@escola.com"
                        autoComplete="email"
                        className="h-12 rounded-md border-white/12 bg-white/[0.04] text-white placeholder:text-white/35"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="libert-contact-phone" className="text-white/82">{t.contactPhone}</Label>
                      <Input
                        id="libert-contact-phone"
                        value={formData.contact_phone}
                        onChange={(event) => handleFieldChange("contact_phone", event.target.value)}
                        placeholder="+55 31 99999-9999"
                        autoComplete="tel"
                        className="h-12 rounded-md border-white/12 bg-white/[0.04] text-white placeholder:text-white/35"
                      />
                    </div>
                  </div>
                </details>
              )}

              <Button
                type="submit"
                disabled={isSubmitting || isLoadingSchool}
                className="h-12 w-full rounded-md bg-[#f2c94c] text-sm font-black text-black hover:bg-[#ffe078]"
              >
                {isSubmitting ? t.submitting : t.submit}
              </Button>
            </form>
          </section>
        </section>

        <section className="mx-auto grid max-w-7xl gap-4 px-4 pb-12 sm:px-6 lg:grid-cols-3 lg:px-8">
          {[t.ruleOne, t.ruleTwo, t.ruleThree].map((rule) => (
            <div key={rule} className="rounded-lg border border-white/10 bg-white/[0.035] p-5 text-sm font-semibold leading-6 text-white/74">
              {rule}
            </div>
          ))}
        </section>

        <footer className="border-t border-white/10 px-4 py-8 text-center text-sm text-white/42 sm:px-6">
          {t.footer} - {new Date().getFullYear()}
        </footer>
      </div>
    </main>
  );
}

import { useEffect, useMemo, useState } from "react";
import { CalendarDays, CheckCircle2, Globe2, MapPin, ShieldCheck, Trophy, Users } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { syncLibertAcademyRegistrationToSheets } from "@/lib/libertAcademySheets";

const categories = ["Sub10", "Sub12", "Sub14"];

const copy = {
  pt: {
    langLabel: "PT",
    otherLang: "ES",
    title: "LibertAcademy",
    eyebrow: "Campeonato de Escolas",
    location: "Buenos Aires, Argentina",
    dates: "21 a 25 de julho",
    heroTitle: "Campeonato escolar em Buenos Aires",
    heroText:
      "Cadastro oficial dos atletas por escola para a disputa da LibertAcademy. Cada inscricao fica vinculada ao nome da escola informada.",
    cta: "Inscrever atleta",
    formTitle: "Ficha do atleta",
    formText: "Preencha os dados essenciais para atrelar o atleta a escola participante.",
    fullName: "Nome completo",
    fullNamePlaceholder: "Nome completo do atleta",
    birthDate: "Data de nascimento",
    documentId: "CPF",
    documentPlaceholder: "CPF do atleta",
    schoolName: "Nome da escola",
    schoolPlaceholder: "Nome da escola participante",
    category: "Categoria",
    categoryPlaceholder: "Selecione a categoria",
    submit: "Cadastrar atleta",
    submitting: "Enviando...",
    success: "Cadastro enviado para a planilha.",
    errorRequired: "Preencha nome completo, data de nascimento, CPF, escola e categoria.",
    errorGeneral: "Nao foi possivel enviar o cadastro agora. Tente novamente.",
    ruleOne: "Categorias Sub10, Sub12 e Sub14.",
    ruleTwo: "Disputa em Buenos Aires, Argentina.",
    ruleThree: "Periodo oficial de 21 a 25 de julho.",
    sheetNote: "Os registros sao organizados pelo nome da escola na planilha.",
    footer: "LibertAcademy - Campeonato de Escolas",
  },
  es: {
    langLabel: "ES",
    otherLang: "PT",
    title: "LibertAcademy",
    eyebrow: "Campeonato de Escuelas",
    location: "Buenos Aires, Argentina",
    dates: "21 al 25 de julio",
    heroTitle: "Campeonato escolar en Buenos Aires",
    heroText:
      "Registro oficial de atletas por escuela para competir en LibertAcademy. Cada inscripcion queda vinculada al nombre de la escuela informada.",
    cta: "Registrar atleta",
    formTitle: "Ficha del atleta",
    formText: "Completa los datos esenciales para vincular el atleta a la escuela participante.",
    fullName: "Nombre completo",
    fullNamePlaceholder: "Nombre completo del atleta",
    birthDate: "Fecha de nacimiento",
    documentId: "CPF",
    documentPlaceholder: "CPF del atleta",
    schoolName: "Nombre de la escuela",
    schoolPlaceholder: "Nombre de la escuela participante",
    category: "Categoria",
    categoryPlaceholder: "Selecciona la categoria",
    submit: "Registrar atleta",
    submitting: "Enviando...",
    success: "Registro enviado a la planilla.",
    errorRequired: "Completa nombre completo, fecha de nacimiento, CPF, escuela y categoria.",
    errorGeneral: "No fue posible enviar el registro ahora. Intentalo nuevamente.",
    ruleOne: "Categorias Sub10, Sub12 y Sub14.",
    ruleTwo: "Competencia en Buenos Aires, Argentina.",
    ruleThree: "Periodo oficial del 21 al 25 de julio.",
    sheetNote: "Los registros se organizan por nombre de escuela en la planilla.",
    footer: "LibertAcademy - Campeonato de Escuelas",
  },
};

const initialForm = {
  athlete_full_name: "",
  birth_date: "",
  document_id: "",
  school_name: "",
  category: "",
};

function normalizeValue(value = "") {
  return String(value).trim().replace(/\s+/g, " ");
}

export default function LibertAcademy() {
  const [language, setLanguage] = useState("pt");
  const [formData, setFormData] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const t = copy[language];

  const statItems = useMemo(
    () => [
      { icon: MapPin, label: t.location },
      { icon: CalendarDays, label: t.dates },
      { icon: Users, label: categories.join(" / ") },
    ],
    [t]
  );

  useEffect(() => {
    document.title = `${t.title} - ${t.location}`;
  }, [t]);

  const handleFieldChange = (field, value) => {
    setIsSubmitted(false);
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const validateForm = () =>
    Boolean(
      normalizeValue(formData.athlete_full_name) &&
      formData.birth_date &&
      normalizeValue(formData.document_id) &&
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

    try {
      await syncLibertAcademyRegistrationToSheets({
        ...formData,
        athlete_full_name: normalizeValue(formData.athlete_full_name),
        document_id: normalizeValue(formData.document_id),
        school_name: normalizeValue(formData.school_name),
        language,
      });

      setFormData(initialForm);
      setIsSubmitted(true);
      toast.success(t.success);
    } catch (error) {
      console.error("LibertAcademy registration error:", error);
      toast.error(t.errorGeneral);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#080806] text-white">
      <div className="absolute inset-0 -z-0 bg-[radial-gradient(circle_at_top_left,rgba(242,201,76,0.20),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(52,126,74,0.24),transparent_34%)]" />
      <div className="relative z-10">
        <header className="sticky top-0 z-40 border-b border-white/10 bg-[#080806]/88 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#f2c94c]/60 bg-[#f2c94c]/12">
                <Trophy className="h-5 w-5 text-[#f2c94c]" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[#f2c94c]">{t.eyebrow}</p>
                <h1 className="text-lg font-black tracking-tight">{t.title}</h1>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => setLanguage((current) => (current === "pt" ? "es" : "pt"))}
              className="h-10 gap-2 rounded-full border-white/15 bg-white/5 px-4 text-white hover:bg-white/10"
            >
              <Globe2 className="h-4 w-4" />
              {t.otherLang}
            </Button>
          </div>
        </header>

        <section className="mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 sm:py-14 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-18">
          <div className="flex flex-col justify-center">
            <Badge className="mb-5 w-fit border border-[#f2c94c]/30 bg-[#f2c94c]/12 px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.22em] text-[#f2c94c]">
              {t.location}
            </Badge>
            <h2 className="max-w-3xl text-4xl font-black leading-[0.98] tracking-tight text-white sm:text-5xl lg:text-7xl">
              {t.heroTitle}
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-7 text-white/68 sm:text-lg">
              {t.heroText}
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {statItems.map((item) => (
                <div key={item.label} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <item.icon className="h-5 w-5 text-[#f2c94c]" />
                  <p className="mt-3 text-sm font-bold leading-5 text-white/86">{item.label}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="#inscricao"
                className="inline-flex h-12 items-center justify-center rounded-full bg-[#f2c94c] px-6 text-sm font-black text-black shadow-[0_18px_40px_rgba(242,201,76,0.18)] transition hover:bg-[#ffe078]"
              >
                {t.cta}
              </a>
              <div className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-5 text-sm font-semibold text-white/78">
                <ShieldCheck className="h-4 w-4 text-emerald-300" />
                {t.sheetNote}
              </div>
            </div>
          </div>

          <section id="inscricao" className="rounded-[2rem] border border-white/12 bg-[#11110d]/92 p-5 shadow-[0_30px_90px_rgba(0,0,0,0.38)] sm:p-7">
            <div className="mb-6">
              <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#f2c94c]">{t.formTitle}</p>
              <h3 className="mt-3 text-2xl font-black text-white sm:text-3xl">{t.cta}</h3>
              <p className="mt-2 text-sm leading-6 text-white/60">{t.formText}</p>
            </div>

            {isSubmitted && (
              <div className="mb-5 flex items-start gap-3 rounded-2xl border border-emerald-400/25 bg-emerald-400/10 p-4 text-sm text-emerald-100">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-300" />
                <span>{t.success}</span>
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
                  className="h-12 border-white/12 bg-white/[0.04] text-white placeholder:text-white/35"
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
                    className="h-12 border-white/12 bg-white/[0.04] text-white"
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
                    className="h-12 border-white/12 bg-white/[0.04] text-white placeholder:text-white/35"
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
                    className="h-12 border-white/12 bg-white/[0.04] text-white placeholder:text-white/35"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="libert-category" className="text-white/82">{t.category}</Label>
                  <select
                    id="libert-category"
                    value={formData.category}
                    onChange={(event) => handleFieldChange("category", event.target.value)}
                    className="h-12 w-full rounded-md border border-white/12 bg-white/[0.04] px-3 text-sm text-white outline-none ring-offset-background focus:ring-2 focus:ring-[#f2c94c]/50"
                  >
                    <option value="" className="bg-[#11110d]">{t.categoryPlaceholder}</option>
                    {categories.map((category) => (
                      <option key={category} value={category} className="bg-[#11110d]">{category}</option>
                    ))}
                  </select>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-12 w-full rounded-full bg-[#f2c94c] text-sm font-black text-black hover:bg-[#ffe078]"
              >
                {isSubmitting ? t.submitting : t.submit}
              </Button>
            </form>
          </section>
        </section>

        <section className="mx-auto grid max-w-7xl gap-4 px-4 pb-12 sm:px-6 lg:grid-cols-3 lg:px-8">
          {[t.ruleOne, t.ruleTwo, t.ruleThree].map((rule) => (
            <div key={rule} className="rounded-2xl border border-white/10 bg-white/[0.035] p-5 text-sm font-semibold leading-6 text-white/74">
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

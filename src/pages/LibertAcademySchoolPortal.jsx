import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import {
  Building2,
  CalendarDays,
  Clipboard,
  Download,
  KeyRound,
  LockKeyhole,
  RefreshCcw,
  Search,
  ShieldCheck,
  Trophy,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/AuthContext";
import { buildPlatformLoginUrl, isAdminUser } from "@/lib/auth-routing";
import {
  LIBERT_ACADEMY_ACCESS_SLUG,
  getLibertAcademyAccessUrl,
  getLibertAcademyAdminPortal,
  getLibertAcademyRegistrationUrl,
  getLibertAcademySchoolPortal,
  normalizeLibertAcademySlug,
} from "@/lib/libertAcademySupabase";

const portalCopy = {
  title: "Acesso LibertAcademy",
  schoolTitle: "Painel da escola",
  subtitle: "Digite a senha da escola para ver os alunos cadastrados.",
  keyLabel: "Senha da escola",
  keyPlaceholder: "Digite a senha da escola",
  load: "Acessar painel",
  loading: "Carregando...",
  invalid: "Nao foi possivel abrir o painel. Verifique a senha da escola.",
  accessLink: "Link unico de acesso",
  registrationLink: "Link de cadastro",
  copy: "Copiar",
  copied: "Copiado.",
  refresh: "Atualizar",
  exportCsv: "Exportar CSV",
  total: "Total de atletas",
  empty: "Ainda nao existem alunos cadastrados para esta escola.",
  athlete: "Atleta",
  birthDate: "Nascimento",
  document: "Documento",
  category: "Categoria",
  submittedAt: "Enviado em",
  adminTitle: "Admin LibertAcademy",
  adminSubtitle: "Escolas, senhas, links e alunos em um painel unico.",
  adminLogin: "Entrar como admin",
  adminBlocked: "Entre com uma conta admin para ver senhas e todos os alunos.",
  schools: "Escolas",
  password: "Senha",
  search: "Buscar escola ou atleta",
};

function formatDate(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(date);
}

function formatBirthDate(value) {
  if (!value) return "-";
  const [year, month, day] = String(value).split("-");
  return year && month && day ? `${day}/${month}/${year}` : value;
}

function csvEscape(value) {
  const text = String(value ?? "");
  return `"${text.replace(/"/g, '""')}"`;
}

function downloadRowsAsCsv(rows, filename) {
  const csv = rows.map((row) => row.map(csvEscape).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function SchoolTable({ registrations }) {
  return (
    <div className="overflow-hidden rounded-lg border border-white/10 bg-[#11110d]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="border-b border-white/10 bg-white/[0.04] text-[11px] uppercase tracking-[0.16em] text-white/48">
            <tr>
              <th className="px-4 py-3">{portalCopy.athlete}</th>
              <th className="px-4 py-3">{portalCopy.birthDate}</th>
              <th className="px-4 py-3">{portalCopy.document}</th>
              <th className="px-4 py-3">{portalCopy.category}</th>
              <th className="px-4 py-3">{portalCopy.submittedAt}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/8">
            {registrations.map((registration) => (
              <tr key={registration.id} className="text-white/76">
                <td className="px-4 py-3 font-semibold text-white">{registration.athlete_full_name}</td>
                <td className="px-4 py-3">{formatBirthDate(registration.birth_date)}</td>
                <td className="px-4 py-3">{registration.document_id || "-"}</td>
                <td className="px-4 py-3">{registration.category || "-"}</td>
                <td className="px-4 py-3">{formatDate(registration.submitted_at)}</td>
              </tr>
            ))}
            {registrations.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-white/52">{portalCopy.empty}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function LibertAcademySchoolPortal() {
  const { schoolSlug = "" } = useParams();
  const [searchParams] = useSearchParams();
  const { user, isLoadingAuth } = useAuth();
  const rawSlug = normalizeLibertAcademySlug(schoolSlug);
  const isUnifiedAccess = !rawSlug || rawSlug === LIBERT_ACADEMY_ACCESS_SLUG || rawSlug === "painel";
  const normalizedSlug = isUnifiedAccess ? "" : rawSlug;
  const storageKey = isUnifiedAccess
    ? "libertacademy-school-password"
    : `libertacademy-school-password:${normalizedSlug}`;
  const initialKey = searchParams.get("senha") || searchParams.get("key") || sessionStorage.getItem(storageKey) || "";
  const [accessKey, setAccessKey] = useState(initialKey);
  const [portalData, setPortalData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [adminData, setAdminData] = useState(null);
  const [isLoadingAdmin, setIsLoadingAdmin] = useState(false);
  const [adminError, setAdminError] = useState("");
  const [adminSearch, setAdminSearch] = useState("");
  const [selectedSchoolSlug, setSelectedSchoolSlug] = useState("");

  const isAdmin = isAdminUser(user);
  const accessUrl = getLibertAcademyAccessUrl();
  const loadedSchoolSlug = portalData?.school_slug || normalizedSlug;
  const registrationUrl = loadedSchoolSlug ? getLibertAcademyRegistrationUrl(loadedSchoolSlug) : "";
  const registrations = useMemo(
    () => (Array.isArray(portalData?.registrations) ? portalData.registrations : []),
    [portalData]
  );
  const adminSchools = useMemo(
    () => (Array.isArray(adminData?.schools) ? adminData.schools : []),
    [adminData]
  );
  const filteredSchools = useMemo(() => {
    const query = adminSearch.trim().toLowerCase();
    if (!query) return adminSchools;

    return adminSchools.filter((school) => {
      const schoolText = [school.name, school.slug, school.portal_password]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      const athleteText = (school.registrations || [])
        .map((registration) => registration.athlete_full_name)
        .join(" ")
        .toLowerCase();
      return `${schoolText} ${athleteText}`.includes(query);
    });
  }, [adminSchools, adminSearch]);
  const selectedSchool = useMemo(() => {
    if (!filteredSchools.length) return null;
    return filteredSchools.find((school) => school.slug === selectedSchoolSlug) || filteredSchools[0];
  }, [filteredSchools, selectedSchoolSlug]);
  const adminLoginUrl = typeof window !== "undefined" ? buildPlatformLoginUrl(window.location.href) : "/login";

  const loadPortal = async (keyValue = accessKey) => {
    const trimmedKey = keyValue.trim();
    if (!trimmedKey) return;

    setIsLoading(true);
    setErrorMessage("");
    try {
      const data = await getLibertAcademySchoolPortal(normalizedSlug, trimmedKey);
      sessionStorage.setItem(storageKey, trimmedKey);
      setPortalData(data);
    } catch (error) {
      console.error("LibertAcademy school portal error:", error);
      setPortalData(null);
      setErrorMessage(portalCopy.invalid);
    } finally {
      setIsLoading(false);
    }
  };

  const loadAdminPortal = async () => {
    if (!isAdmin) return;

    setIsLoadingAdmin(true);
    setAdminError("");
    try {
      const data = await getLibertAcademyAdminPortal();
      setAdminData(data);
      const schools = Array.isArray(data?.schools) ? data.schools : [];
      setSelectedSchoolSlug((current) => current || schools[0]?.slug || "");
    } catch (error) {
      console.error("LibertAcademy admin portal error:", error);
      setAdminError("Nao foi possivel carregar o painel admin.");
    } finally {
      setIsLoadingAdmin(false);
    }
  };

  useEffect(() => {
    document.title = "LibertAcademy - Acesso das escolas";
    if (initialKey) {
      loadPortal(initialKey);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [normalizedSlug]);

  useEffect(() => {
    if (!isLoadingAuth && isAdmin) {
      loadAdminPortal();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoadingAuth, isAdmin]);

  const handleCopy = async (value) => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success(portalCopy.copied);
    } catch {
      toast.error(value);
    }
  };

  const handleSchoolExportCsv = () => {
    const rows = [
      ["Atleta", "Nascimento", "Documento", "Categoria", "Status", "Enviado em"],
      ...registrations.map((registration) => [
        registration.athlete_full_name,
        registration.birth_date,
        registration.document_id,
        registration.category,
        registration.status,
        registration.submitted_at,
      ]),
    ];
    downloadRowsAsCsv(rows, `libertacademy-${loadedSchoolSlug || "escola"}-alunos.csv`);
  };

  const handleAdminExportCsv = () => {
    const rows = [
      ["Escola", "Slug", "Senha", "Atleta", "Nascimento", "Documento", "Categoria", "Status", "Enviado em"],
      ...adminSchools.flatMap((school) => {
        const schoolRegistrations = school.registrations || [];
        if (!schoolRegistrations.length) {
          return [[school.name, school.slug, school.portal_password, "", "", "", "", "", ""]];
        }

        return schoolRegistrations.map((registration) => [
          school.name,
          school.slug,
          school.portal_password,
          registration.athlete_full_name,
          registration.birth_date,
          registration.document_id,
          registration.category,
          registration.status,
          registration.submitted_at,
        ]);
      }),
    ];
    downloadRowsAsCsv(rows, "libertacademy-admin-escolas-alunos.csv");
  };

  return (
    <main className="min-h-screen bg-[#080806] text-white">
      <header className="border-b border-white/10 bg-[#080806]/94">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/libertacademy" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-[#f2c94c]/50 bg-[#f2c94c]/12">
              <Trophy className="h-5 w-5 text-[#f2c94c]" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[#f2c94c]">LibertAcademy</p>
              <h1 className="text-lg font-black tracking-tight">{portalCopy.title}</h1>
            </div>
          </Link>
          <Button asChild variant="outline" className="rounded-md border-white/15 bg-white/5 text-white hover:bg-white/10">
            <Link to="/libertacademy">
              <Users className="mr-2 h-4 w-4" />
              Cadastro
            </Link>
          </Button>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 rounded-lg border border-[#f2c94c]/22 bg-[#f2c94c]/10 p-4">
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#f2c94c]">{portalCopy.accessLink}</p>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <a href={accessUrl} target="_blank" rel="noreferrer" className="break-all text-sm font-bold text-white/86 hover:text-white">
              {accessUrl}
            </a>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleCopy(accessUrl)}
              className="w-fit rounded-md border-white/15 bg-white/5 text-white hover:bg-white/10"
            >
              <Clipboard className="mr-2 h-4 w-4" />
              {portalCopy.copy}
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.86fr_1.14fr]">
          <section className="rounded-lg border border-white/10 bg-[#11110d] p-5 sm:p-6">
            <div className="flex items-start gap-3">
              <LockKeyhole className="mt-1 h-6 w-6 text-[#f2c94c]" />
              <div>
                <h2 className="text-2xl font-black">{portalCopy.schoolTitle}</h2>
                <p className="mt-2 text-sm leading-6 text-white/62">{portalCopy.subtitle}</p>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <Label htmlFor="school-password" className="text-white/82">{portalCopy.keyLabel}</Label>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Input
                  id="school-password"
                  type="password"
                  value={accessKey}
                  onChange={(event) => setAccessKey(event.target.value)}
                  placeholder={portalCopy.keyPlaceholder}
                  className="h-12 rounded-md border-white/12 bg-white/[0.04] text-white placeholder:text-white/35"
                />
                <Button
                  type="button"
                  onClick={() => loadPortal()}
                  disabled={isLoading || !accessKey}
                  className="h-12 rounded-md bg-[#f2c94c] px-6 font-black text-black hover:bg-[#ffe078]"
                >
                  <KeyRound className="mr-2 h-4 w-4" />
                  {isLoading ? portalCopy.loading : portalCopy.load}
                </Button>
              </div>
              {errorMessage && <p className="text-sm text-red-200">{errorMessage}</p>}
            </div>

            {portalData && (
              <div className="mt-6 space-y-4">
                <div className="rounded-lg border border-white/10 bg-black/18 p-4">
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#f2c94c]">{portalCopy.registrationLink}</p>
                  <a href={registrationUrl} target="_blank" rel="noreferrer" className="mt-2 block break-all text-sm font-semibold leading-6 text-white/82 hover:text-white">
                    {registrationUrl}
                  </a>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopy(registrationUrl)}
                    className="mt-3 rounded-md border-white/15 bg-white/5 text-white hover:bg-white/10"
                  >
                    <Clipboard className="mr-2 h-4 w-4" />
                    {portalCopy.copy}
                  </Button>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => loadPortal()}
                    className="rounded-md border-white/15 bg-white/5 text-white hover:bg-white/10"
                  >
                    <RefreshCcw className="mr-2 h-4 w-4" />
                    {portalCopy.refresh}
                  </Button>
                  <Button
                    type="button"
                    onClick={handleSchoolExportCsv}
                    disabled={registrations.length === 0}
                    className="rounded-md bg-[#f2c94c] font-black text-black hover:bg-[#ffe078]"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    {portalCopy.exportCsv}
                  </Button>
                </div>
              </div>
            )}
          </section>

          <section className="space-y-5">
            {portalData ? (
              <>
                <div className="grid gap-3 sm:grid-cols-4">
                  <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4 sm:col-span-2">
                    <ShieldCheck className="h-5 w-5 text-emerald-300" />
                    <p className="mt-3 text-[11px] font-bold uppercase tracking-[0.18em] text-white/42">Escola</p>
                    <h2 className="mt-1 text-xl font-black">{portalData.school_name}</h2>
                  </div>
                  <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
                    <Users className="h-5 w-5 text-[#f2c94c]" />
                    <p className="mt-3 text-[11px] font-bold uppercase tracking-[0.18em] text-white/42">{portalCopy.total}</p>
                    <div className="mt-1 text-3xl font-black">{portalData.registration_count}</div>
                  </div>
                  <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
                    <CalendarDays className="h-5 w-5 text-[#f2c94c]" />
                    <p className="mt-3 text-[11px] font-bold uppercase tracking-[0.18em] text-white/42">Categorias</p>
                    <p className="mt-1 text-sm font-bold text-white/82">
                      Sub10 {portalData.category_counts?.Sub10 || 0} / Sub12 {portalData.category_counts?.Sub12 || 0} / Sub14 {portalData.category_counts?.Sub14 || 0}
                    </p>
                  </div>
                </div>
                <SchoolTable registrations={registrations} />
              </>
            ) : (
              <div className="rounded-lg border border-white/10 bg-white/[0.04] p-8 text-center">
                <LockKeyhole className="mx-auto h-8 w-8 text-[#f2c94c]" />
                <h2 className="mt-4 text-2xl font-black">Digite a senha para abrir o painel</h2>
                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-white/58">
                  Esse painel mostra somente os alunos da escola vinculada a senha.
                </p>
              </div>
            )}
          </section>
        </div>

        <section className="mt-6 rounded-lg border border-white/10 bg-[#10100c] p-5 sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-1 h-6 w-6 text-emerald-300" />
              <div>
                <h2 className="text-2xl font-black">{portalCopy.adminTitle}</h2>
                <p className="mt-2 text-sm leading-6 text-white/62">{portalCopy.adminSubtitle}</p>
              </div>
            </div>
            {isAdmin ? (
              <div className="flex flex-wrap gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={loadAdminPortal}
                  disabled={isLoadingAdmin}
                  className="rounded-md border-white/15 bg-white/5 text-white hover:bg-white/10"
                >
                  <RefreshCcw className="mr-2 h-4 w-4" />
                  {isLoadingAdmin ? portalCopy.loading : portalCopy.refresh}
                </Button>
                <Button
                  type="button"
                  onClick={handleAdminExportCsv}
                  disabled={!adminSchools.length}
                  className="rounded-md bg-[#f2c94c] font-black text-black hover:bg-[#ffe078]"
                >
                  <Download className="mr-2 h-4 w-4" />
                  CSV geral
                </Button>
              </div>
            ) : (
              <Button asChild className="w-fit rounded-md bg-[#f2c94c] font-black text-black hover:bg-[#ffe078]">
                <a href={adminLoginUrl}>{portalCopy.adminLogin}</a>
              </Button>
            )}
          </div>

          {!isAdmin && (
            <p className="mt-5 rounded-lg border border-white/10 bg-white/[0.035] p-4 text-sm leading-6 text-white/62">
              {portalCopy.adminBlocked}
            </p>
          )}

          {adminError && <p className="mt-5 text-sm text-red-200">{adminError}</p>}

          {isAdmin && adminData && (
            <div className="mt-6 space-y-5">
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
                  <Building2 className="h-5 w-5 text-[#f2c94c]" />
                  <p className="mt-3 text-[11px] font-bold uppercase tracking-[0.18em] text-white/42">Escolas</p>
                  <div className="mt-1 text-3xl font-black">{adminData.total_schools || 0}</div>
                </div>
                <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
                  <Users className="h-5 w-5 text-[#f2c94c]" />
                  <p className="mt-3 text-[11px] font-bold uppercase tracking-[0.18em] text-white/42">Alunos</p>
                  <div className="mt-1 text-3xl font-black">{adminData.total_registrations || 0}</div>
                </div>
                <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
                  <LockKeyhole className="h-5 w-5 text-[#f2c94c]" />
                  <p className="mt-3 text-[11px] font-bold uppercase tracking-[0.18em] text-white/42">Acesso unico</p>
                  <button type="button" onClick={() => handleCopy(accessUrl)} className="mt-1 break-all text-left text-sm font-bold text-white/82 hover:text-white">
                    {accessUrl}
                  </button>
                </div>
              </div>

              <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
                <div className="rounded-lg border border-white/10 bg-black/16 p-4">
                  <Label htmlFor="admin-school-search" className="text-white/82">{portalCopy.search}</Label>
                  <div className="relative mt-2">
                    <Search className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-white/35" />
                    <Input
                      id="admin-school-search"
                      value={adminSearch}
                      onChange={(event) => setAdminSearch(event.target.value)}
                      placeholder="Nome da escola, senha ou atleta"
                      className="h-12 rounded-md border-white/12 bg-white/[0.04] pl-10 text-white placeholder:text-white/35"
                    />
                  </div>

                  <div className="mt-4 max-h-[520px] space-y-2 overflow-y-auto pr-1">
                    {filteredSchools.map((school) => (
                      <button
                        key={school.slug}
                        type="button"
                        onClick={() => setSelectedSchoolSlug(school.slug)}
                        className={`w-full rounded-lg border p-3 text-left transition ${
                          selectedSchool?.slug === school.slug
                            ? "border-[#f2c94c]/60 bg-[#f2c94c]/10"
                            : "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-black text-white">{school.name}</p>
                            <p className="mt-1 text-xs text-white/50">{school.registration_count || 0} alunos</p>
                          </div>
                          <span className="rounded-md bg-black/30 px-2 py-1 text-[11px] font-bold text-white/64">{school.slug}</span>
                        </div>
                      </button>
                    ))}
                    {filteredSchools.length === 0 && (
                      <p className="rounded-lg border border-white/10 bg-white/[0.03] p-4 text-sm text-white/52">
                        Nenhuma escola encontrada.
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  {selectedSchool ? (
                    <>
                      <div className="rounded-lg border border-white/10 bg-black/16 p-4">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#f2c94c]">Escola selecionada</p>
                            <h3 className="mt-2 text-2xl font-black">{selectedSchool.name}</h3>
                            <p className="mt-1 text-sm text-white/52">{selectedSchool.registration_count || 0} alunos cadastrados</p>
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => handleCopy(selectedSchool.portal_password)}
                            className="w-fit rounded-md border-white/15 bg-white/5 text-white hover:bg-white/10"
                          >
                            <Clipboard className="mr-2 h-4 w-4" />
                            Copiar senha
                          </Button>
                        </div>

                        <div className="mt-4 grid gap-3 md:grid-cols-3">
                          <div className="rounded-lg border border-white/10 bg-white/[0.035] p-3">
                            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/42">{portalCopy.password}</p>
                            <code className="mt-2 block break-all text-sm font-black text-white">{selectedSchool.portal_password}</code>
                          </div>
                          <div className="rounded-lg border border-white/10 bg-white/[0.035] p-3 md:col-span-2">
                            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/42">{portalCopy.registrationLink}</p>
                            <button
                              type="button"
                              onClick={() => handleCopy(getLibertAcademyRegistrationUrl(selectedSchool.slug))}
                              className="mt-2 break-all text-left text-sm font-bold text-white/82 hover:text-white"
                            >
                              {getLibertAcademyRegistrationUrl(selectedSchool.slug)}
                            </button>
                          </div>
                        </div>
                      </div>

                      <SchoolTable registrations={selectedSchool.registrations || []} />
                    </>
                  ) : (
                    <div className="rounded-lg border border-white/10 bg-white/[0.035] p-8 text-center text-white/52">
                      Nenhuma escola selecionada.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </section>
      </section>
    </main>
  );
}

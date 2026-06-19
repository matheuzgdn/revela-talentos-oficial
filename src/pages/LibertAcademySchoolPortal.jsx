import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import {
  Building2,
  CalendarDays,
  Clipboard,
  Download,
  FilePenLine,
  KeyRound,
  LockKeyhole,
  Plus,
  RefreshCcw,
  Search,
  ShieldCheck,
  Trash2,
  Trophy,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/lib/AuthContext";
import { buildPlatformLoginUrl, isAdminUser } from "@/lib/auth-routing";
import {
  LIBERT_ACADEMY_ACCESS_SLUG,
  createLibertAcademySchoolRegistration,
  deleteLibertAcademySchoolRegistration,
  getLibertAcademyAccessUrl,
  getLibertAcademyAdminPortal,
  getLibertAcademyRegistrationUrl,
  getLibertAcademySchoolPortal,
  normalizeLibertAcademySlug,
  updateLibertAcademySchoolRegistration,
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
  actions: "Acoes",
  completeData: "Completar dados",
  editData: "Editar dados",
  submittedAt: "Enviado em",
  adminTitle: "Admin LibertAcademy",
  adminSubtitle: "Escolas, senhas, links e alunos em um painel unico.",
  adminLogin: "Entrar como admin",
  adminBlocked: "Entre com uma conta admin para ver senhas e todos os alunos.",
  schools: "Escolas",
  password: "Senha",
  search: "Buscar escola ou atleta",
  addAthlete: "Cadastrar atleta",
};

const emptyRegistrationForm = {
  athlete_full_name: "",
  birth_date: "",
  document_id: "",
  category: "",
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

function SchoolTable({ registrations, onEdit, onDelete }) {
  return (
    <div className="overflow-hidden rounded-lg border border-white/10 bg-[#11110d]">
      <div className="divide-y divide-white/8 md:hidden">
        {registrations.map((registration) => (
          <div key={registration.id} className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-black text-white">{registration.athlete_full_name}</p>
                <p className="mt-1 text-xs text-white/42">Enviado em {formatDate(registration.submitted_at)}</p>
              </div>
              <span className="rounded-md bg-white/[0.06] px-2 py-1 text-xs font-bold text-white/68">
                {registration.category || "Sem categoria"}
              </span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-[10px] font-bold uppercase text-white/38">Nascimento</p>
                <p className="mt-1 text-white/78">{formatBirthDate(registration.birth_date)}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase text-white/38">Documento</p>
                <p className="mt-1 text-white/78">{registration.document_id || "-"}</p>
              </div>
            </div>
            {(onEdit || onDelete) && (
              <div className="mt-4 flex gap-2">
                {onEdit && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onEdit(registration)}
                    className="flex-1 rounded-md border-[#f2c94c]/35 bg-[#f2c94c]/10 text-[#f7d76e] hover:bg-[#f2c94c]/20 hover:text-white"
                  >
                    <FilePenLine className="mr-2 h-4 w-4" />
                    {registration.birth_date && registration.category ? portalCopy.editData : portalCopy.completeData}
                  </Button>
                )}
                {onDelete && (
                  <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    onClick={() => onDelete(registration)}
                    aria-label={`Excluir ${registration.athlete_full_name}`}
                    title={`Excluir ${registration.athlete_full_name}`}
                    className="shrink-0 rounded-md border-red-400/30 bg-red-400/10 text-red-200 hover:bg-red-400/20 hover:text-white"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            )}
          </div>
        ))}
        {registrations.length === 0 && (
          <p className="p-8 text-center text-sm text-white/52">{portalCopy.empty}</p>
        )}
      </div>

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[880px] text-left text-sm">
          <thead className="border-b border-white/10 bg-white/[0.04] text-[11px] uppercase tracking-[0.16em] text-white/48">
            <tr>
              <th className="px-4 py-3">{portalCopy.athlete}</th>
              <th className="px-4 py-3">{portalCopy.birthDate}</th>
              <th className="px-4 py-3">{portalCopy.document}</th>
              <th className="px-4 py-3">{portalCopy.category}</th>
              <th className="px-4 py-3">{portalCopy.submittedAt}</th>
              {(onEdit || onDelete) && (
                <th className="sticky right-0 z-10 bg-[#191914] px-4 py-3 text-right shadow-[-12px_0_18px_rgba(0,0,0,0.28)]">
                  {portalCopy.actions}
                </th>
              )}
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
                {(onEdit || onDelete) && (
                  <td className="sticky right-0 bg-[#11110d] px-4 py-3 text-right shadow-[-12px_0_18px_rgba(0,0,0,0.28)]">
                    <div className="flex items-center justify-end gap-2">
                      {onEdit && (
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => onEdit(registration)}
                          className="rounded-md border-[#f2c94c]/35 bg-[#f2c94c]/10 text-[#f7d76e] hover:bg-[#f2c94c]/20 hover:text-white"
                        >
                          <FilePenLine className="mr-2 h-4 w-4" />
                          {registration.birth_date && registration.category
                            ? portalCopy.editData
                            : portalCopy.completeData}
                        </Button>
                      )}
                      {onDelete && (
                        <Button
                          type="button"
                          size="icon"
                          variant="outline"
                          onClick={() => onDelete(registration)}
                          aria-label={`Excluir ${registration.athlete_full_name}`}
                          title={`Excluir ${registration.athlete_full_name}`}
                          className="rounded-md border-red-400/30 bg-red-400/10 text-red-200 hover:bg-red-400/20 hover:text-white"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
            {registrations.length === 0 && (
              <tr>
                <td colSpan={onEdit || onDelete ? 6 : 5} className="px-4 py-8 text-center text-white/52">{portalCopy.empty}</td>
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
  const [registrationDialog, setRegistrationDialog] = useState(null);
  const [deletionDialog, setDeletionDialog] = useState(null);
  const [editForm, setEditForm] = useState(emptyRegistrationForm);
  const [isSavingRegistration, setIsSavingRegistration] = useState(false);
  const [isDeletingRegistration, setIsDeletingRegistration] = useState(false);

  const isAdmin = isAdminUser(user);
  const accessUrl = getLibertAcademyAccessUrl();
  const loadedSchoolSlug = portalData?.school_slug || normalizedSlug;
  const registrationUrl = loadedSchoolSlug ? getLibertAcademyRegistrationUrl(loadedSchoolSlug) : "";
  const registrations = useMemo(
    () => (Array.isArray(portalData?.registrations) ? portalData.registrations : []),
    [portalData]
  );
  const incompleteRegistrations = useMemo(
    () => registrations.filter((registration) => !registration.birth_date || !registration.category),
    [registrations]
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

  const handleCreateRegistration = (context) => {
    setRegistrationDialog({ mode: "create", ...context });
    setEditForm(emptyRegistrationForm);
  };

  const handleEditRegistration = (registration, context) => {
    setRegistrationDialog({ mode: "edit", registration, ...context });
    setEditForm({
      athlete_full_name: registration.athlete_full_name || "",
      birth_date: registration.birth_date || "",
      document_id: registration.document_id || "",
      category: registration.category || "",
    });
  };

  const handleDeleteRegistration = (registration, context) => {
    setDeletionDialog({ registration, ...context });
  };

  const handleConfirmDeleteRegistration = async () => {
    if (!deletionDialog) return;

    setIsDeletingRegistration(true);
    try {
      await deleteLibertAcademySchoolRegistration(
        deletionDialog.schoolSlug,
        deletionDialog.schoolAccessKey,
        deletionDialog.registration.id
      );

      if (deletionDialog.source === "admin") {
        await loadAdminPortal();
      } else {
        await loadPortal(deletionDialog.schoolAccessKey);
      }

      setDeletionDialog(null);
      toast.success("Atleta excluido da lista.");
    } catch (error) {
      console.error("LibertAcademy registration delete error:", error);
      toast.error("Nao foi possivel excluir o atleta.");
    } finally {
      setIsDeletingRegistration(false);
    }
  };

  const handleSaveRegistration = async () => {
    if (!registrationDialog) return;
    if (!editForm.athlete_full_name.trim() || !editForm.birth_date || !editForm.category) {
      toast.error("Informe nome, data de nascimento e categoria.");
      return;
    }

    setIsSavingRegistration(true);
    try {
      const payload = { ...editForm, athlete_full_name: editForm.athlete_full_name.trim() };
      if (registrationDialog.mode === "create") {
        await createLibertAcademySchoolRegistration(
          registrationDialog.schoolSlug,
          registrationDialog.schoolAccessKey,
          payload
        );
      } else {
        await updateLibertAcademySchoolRegistration(
          registrationDialog.schoolSlug,
          registrationDialog.schoolAccessKey,
          registrationDialog.registration.id,
          payload
        );
      }

      if (registrationDialog.source === "admin") {
        await loadAdminPortal();
      } else {
        await loadPortal(registrationDialog.schoolAccessKey);
      }

      setRegistrationDialog(null);
      toast.success(registrationDialog.mode === "create" ? "Atleta cadastrado." : "Dados do atleta atualizados.");
    } catch (error) {
      console.error("LibertAcademy registration update error:", error);
      toast.error("Nao foi possivel salvar. Tente novamente.");
    } finally {
      setIsSavingRegistration(false);
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
                    onClick={() => handleCreateRegistration({
                      schoolSlug: loadedSchoolSlug,
                      schoolAccessKey: accessKey.trim(),
                      source: "school",
                    })}
                    className="rounded-md bg-[#f2c94c] font-black text-black hover:bg-[#ffe078]"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    {portalCopy.addAthlete}
                  </Button>
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
                    className="rounded-md border-white/15 bg-white/5 font-black text-white hover:bg-white/10"
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
                {incompleteRegistrations.length > 0 && (
                  <div className="rounded-lg border border-amber-300/25 bg-amber-300/10 p-4 text-sm text-amber-50">
                    <p className="font-black">
                      {incompleteRegistrations.length} {incompleteRegistrations.length === 1 ? "atleta precisa" : "atletas precisam"} completar os dados.
                    </p>
                    <p className="mt-1 text-amber-50/72">
                      Use o botao ao lado de cada nome para informar nascimento, documento e categoria sem criar outro cadastro.
                    </p>
                  </div>
                )}
                <SchoolTable
                  registrations={registrations}
                  onEdit={(registration) => handleEditRegistration(registration, {
                    schoolSlug: loadedSchoolSlug,
                    schoolAccessKey: accessKey.trim(),
                    source: "school",
                  })}
                  onDelete={(registration) => handleDeleteRegistration(registration, {
                    schoolSlug: loadedSchoolSlug,
                    schoolAccessKey: accessKey.trim(),
                    source: "school",
                  })}
                />
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
                          <div className="flex flex-wrap gap-2">
                            <Button
                              type="button"
                              onClick={() => handleCreateRegistration({
                                schoolSlug: selectedSchool.slug,
                                schoolAccessKey: selectedSchool.portal_password,
                                source: "admin",
                              })}
                              className="w-fit rounded-md bg-[#f2c94c] font-black text-black hover:bg-[#ffe078]"
                            >
                              <Plus className="mr-2 h-4 w-4" />
                              {portalCopy.addAthlete}
                            </Button>
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

                      <SchoolTable
                        registrations={selectedSchool.registrations || []}
                        onEdit={(registration) => handleEditRegistration(registration, {
                          schoolSlug: selectedSchool.slug,
                          schoolAccessKey: selectedSchool.portal_password,
                          source: "admin",
                        })}
                        onDelete={(registration) => handleDeleteRegistration(registration, {
                          schoolSlug: selectedSchool.slug,
                          schoolAccessKey: selectedSchool.portal_password,
                          source: "admin",
                        })}
                      />
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

      <Dialog
        open={Boolean(registrationDialog)}
        onOpenChange={(open) => {
          if (!open && !isSavingRegistration) setRegistrationDialog(null);
        }}
      >
        <DialogContent className="border-white/12 bg-[#11110d] text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-black">
              {registrationDialog?.mode === "create" ? "Cadastrar atleta" : "Editar atleta"}
            </DialogTitle>
            <DialogDescription className="text-white/58">
              {registrationDialog?.mode === "create"
                ? "O atleta sera incluido diretamente na lista desta escola."
                : "Altere os dados e salve no mesmo cadastro."} O documento e opcional.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="registration-athlete-name" className="text-white/82">Nome completo</Label>
              <Input
                id="registration-athlete-name"
                value={editForm.athlete_full_name}
                onChange={(event) => setEditForm((current) => ({ ...current, athlete_full_name: event.target.value }))}
                placeholder="Nome completo do atleta"
                className="h-12 rounded-md border-white/12 bg-white/[0.04] text-white placeholder:text-white/35"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="registration-birth-date" className="text-white/82">Data de nascimento</Label>
              <Input
                id="registration-birth-date"
                type="date"
                value={editForm.birth_date}
                onChange={(event) => setEditForm((current) => ({ ...current, birth_date: event.target.value }))}
                className="h-12 rounded-md border-white/12 bg-white/[0.04] text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="registration-document" className="text-white/82">Documento do atleta (opcional)</Label>
              <Input
                id="registration-document"
                value={editForm.document_id}
                onChange={(event) => setEditForm((current) => ({ ...current, document_id: event.target.value }))}
                placeholder="DNI, RG ou CPF"
                className="h-12 rounded-md border-white/12 bg-white/[0.04] text-white placeholder:text-white/35"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white/82">Categoria</Label>
              <Select
                value={editForm.category}
                onValueChange={(value) => setEditForm((current) => ({ ...current, category: value }))}
              >
                <SelectTrigger className="h-12 border-white/12 bg-white/[0.04] text-white">
                  <SelectValue placeholder="Selecione a categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sub10">Sub10</SelectItem>
                  <SelectItem value="Sub12">Sub12</SelectItem>
                  <SelectItem value="Sub14">Sub14</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setRegistrationDialog(null)}
              disabled={isSavingRegistration}
              className="rounded-md border-white/15 bg-white/5 text-white hover:bg-white/10"
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={handleSaveRegistration}
              disabled={isSavingRegistration}
              className="rounded-md bg-[#f2c94c] font-black text-black hover:bg-[#ffe078]"
            >
              {isSavingRegistration
                ? "Salvando..."
                : registrationDialog?.mode === "create" ? "Cadastrar atleta" : "Salvar alteracoes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={Boolean(deletionDialog)}
        onOpenChange={(open) => {
          if (!open && !isDeletingRegistration) setDeletionDialog(null);
        }}
      >
        <AlertDialogContent className="border-white/12 bg-[#11110d] text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-black">Excluir atleta?</AlertDialogTitle>
            <AlertDialogDescription className="leading-6 text-white/60">
              <strong className="text-white">{deletionDialog?.registration.athlete_full_name}</strong> sera removido da lista desta escola. Esta acao exige confirmacao.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={isDeletingRegistration}
              className="rounded-md border-white/15 bg-white/5 text-white hover:bg-white/10"
            >
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(event) => {
                event.preventDefault();
                handleConfirmDeleteRegistration();
              }}
              disabled={isDeletingRegistration}
              className="rounded-md bg-red-600 font-black text-white hover:bg-red-500"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {isDeletingRegistration ? "Excluindo..." : "Excluir atleta"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}

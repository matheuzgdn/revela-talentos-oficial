import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import {
  CalendarDays,
  Clipboard,
  Download,
  KeyRound,
  LockKeyhole,
  RefreshCcw,
  ShieldCheck,
  Trophy,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  getLibertAcademyRegistrationUrl,
  getLibertAcademySchoolPortal,
  normalizeLibertAcademySlug,
} from "@/lib/libertAcademySupabase";

const portalCopy = {
  title: "Painel da escola",
  subtitle: "Acompanhe os atletas cadastrados para a LibertAcademy.",
  keyLabel: "Chave de acesso",
  keyPlaceholder: "Cole a chave da escola",
  load: "Acessar painel",
  loading: "Carregando...",
  invalid: "Nao foi possivel abrir o painel. Verifique a chave de acesso.",
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

export default function LibertAcademySchoolPortal() {
  const { schoolSlug = "" } = useParams();
  const [searchParams] = useSearchParams();
  const normalizedSlug = normalizeLibertAcademySlug(schoolSlug);
  const storageKey = `libertacademy-school-key:${normalizedSlug}`;
  const initialKey = searchParams.get("key") || sessionStorage.getItem(storageKey) || "";
  const [accessKey, setAccessKey] = useState(initialKey);
  const [portalData, setPortalData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const registrations = useMemo(
    () => (Array.isArray(portalData?.registrations) ? portalData.registrations : []),
    [portalData]
  );
  const registrationUrl = normalizedSlug ? getLibertAcademyRegistrationUrl(normalizedSlug) : "";

  const loadPortal = async (keyValue = accessKey) => {
    if (!normalizedSlug || !keyValue) return;

    setIsLoading(true);
    setErrorMessage("");
    try {
      const data = await getLibertAcademySchoolPortal(normalizedSlug, keyValue.trim());
      sessionStorage.setItem(storageKey, keyValue.trim());
      setPortalData(data);
    } catch (error) {
      console.error("LibertAcademy school portal error:", error);
      setPortalData(null);
      setErrorMessage(portalCopy.invalid);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    document.title = "LibertAcademy - Painel da escola";
    if (initialKey) {
      loadPortal(initialKey);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [normalizedSlug]);

  const handleCopy = async (value) => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success(portalCopy.copied);
    } catch {
      toast.error(value);
    }
  };

  const handleExportCsv = () => {
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
    const csv = rows.map((row) => row.map(csvEscape).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `libertacademy-${normalizedSlug || "escola"}-alunos.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
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
            <Link to={`/libertacademy?school=${normalizedSlug}`}>
              <Users className="mr-2 h-4 w-4" />
              Cadastro
            </Link>
          </Button>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <section className="rounded-lg border border-white/10 bg-[#11110d] p-5 sm:p-6">
            <div className="flex items-start gap-3">
              <LockKeyhole className="mt-1 h-6 w-6 text-[#f2c94c]" />
              <div>
                <h2 className="text-2xl font-black">{portalCopy.title}</h2>
                <p className="mt-2 text-sm leading-6 text-white/62">{portalCopy.subtitle}</p>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <Label htmlFor="school-access-key" className="text-white/82">{portalCopy.keyLabel}</Label>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Input
                  id="school-access-key"
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
                    onClick={handleExportCsv}
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
              </>
            ) : (
              <div className="rounded-lg border border-white/10 bg-white/[0.04] p-8 text-center">
                <LockKeyhole className="mx-auto h-8 w-8 text-[#f2c94c]" />
                <h2 className="mt-4 text-2xl font-black">Digite a chave para abrir o painel</h2>
                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-white/58">
                  Esse painel mostra somente os alunos da escola vinculada ao link.
                </p>
              </div>
            )}
          </section>
        </div>
      </section>
    </main>
  );
}

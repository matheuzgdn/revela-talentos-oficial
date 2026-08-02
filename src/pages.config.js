/**
 * pages.config.js - Page routing configuration
 *
 * This file is AUTO-GENERATED. Do not add imports or modify PAGES manually.
 * THE ONLY EDITABLE VALUE: mainPage
 */
import { lazy } from 'react';

const __Layout = lazy(() => import('./Layout.jsx'));
const Admin = lazy(() => import('./pages/Admin'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AnalisePerformance = lazy(() => import('./pages/AnalisePerformance'));
const AthleteProfile = lazy(() => import('./pages/AthleteProfile'));
const AthleteVideos = lazy(() => import('./pages/AthleteVideos'));
const CasesSucessoAtletas = lazy(() => import('./pages/CasesSucessoAtletas'));
const DatacenterDocumentation = lazy(() => import('./pages/DatacenterDocumentation'));
const Eventos = lazy(() => import('./pages/Eventos'));
const Home = lazy(() => import('./pages/Home'));
const Hub = lazy(() => import('./pages/Hub'));
const LibertAcademy = lazy(() => import('./pages/LibertAcademy'));
const Lives = lazy(() => import('./pages/Lives'));
const MeusServicos = lazy(() => import('./pages/MeusServicos'));
const PlanoCarreira = lazy(() => import('./pages/PlanoCarreira'));
const PlanoInternacional = lazy(() => import('./pages/PlanoInternacional'));
const RenderPage = lazy(() => import('./pages/RenderPage'));
const RevelaTalentos = lazy(() => import('./pages/RevelaTalentos'));
const RevelaAppPremium = lazy(() => import('./pages/RevelaAppPremium'));
const SearchAthletes = lazy(() => import('./pages/SearchAthletes'));
const SeletivaOnline = lazy(() => import('./pages/SeletivaOnline'));
const ZonaMembros = lazy(() => import('./pages/ZonaMembros'));
const EscolaParceira = lazy(() => import('./pages/EscolaParceira'));
const PaisAtletas = lazy(() => import('./pages/PaisAtletas'));
const VSLEscolaParceira = lazy(() => import('./pages/VSLEscolaParceira'));
const Evento = lazy(() => import('./pages/Evento'));
const VSLEvento = lazy(() => import('./pages/VSLEvento'));

export const PAGES = {
    "Admin": Admin,
    "AdminDashboard": AdminDashboard,
    "AnalisePerformance": AnalisePerformance,
    "AthleteProfile": AthleteProfile,
    "AthleteVideos": AthleteVideos,
    "cases-sucesso-atletas": CasesSucessoAtletas,
    "DatacenterDocumentation": DatacenterDocumentation,
    "Eventos": Eventos,
    "Home": Home,
    "Hub": Hub,
    "libertacademy": LibertAcademy,
    "Lives": Lives,
    "MeusServicos": MeusServicos,
    "PlanoCarreira": PlanoCarreira,
    "PlanoInternacional": PlanoInternacional,
    "RenderPage": RenderPage,
    "RevelaTalentos": RevelaTalentos,
    "RevelaAppPremium": RevelaAppPremium,
    "SearchAthletes": SearchAthletes,
    "SeletivaOnline": SeletivaOnline,
    "ZonaMembros": ZonaMembros,
    "escola-parceira": EscolaParceira,
    "escolas-parceiras": EscolaParceira,
    "pais-atletas": PaisAtletas,
    "pais-e-atletas": PaisAtletas,
    "vsl-escola-parceira": VSLEscolaParceira,
    "evento": Evento,
    "vsl-evento": VSLEvento,
}

export const pagesConfig = {
    mainPage: "RevelaTalentos",
    Pages: PAGES,
    Layout: __Layout,
};

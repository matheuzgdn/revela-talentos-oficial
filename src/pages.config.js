/**
 * pages.config.js - Page routing configuration
 * 
 * This file is AUTO-GENERATED. Do not add imports or modify PAGES manually.
 * Pages are auto-registered when you create files in the ./pages/ folder.
 * 
 * THE ONLY EDITABLE VALUE: mainPage
 * This controls which page is the landing page (shown when users visit the app).
 * 
 * Example file structure:
 * 
 *   import HomePage from './pages/HomePage';
 *   import Dashboard from './pages/Dashboard';
 *   import Settings from './pages/Settings';
 *   
 *   export const PAGES = {
 *       "HomePage": HomePage,
 *       "Dashboard": Dashboard,
 *       "Settings": Settings,
 *   }
 *   
 *   export const pagesConfig = {
 *       mainPage: "HomePage",
 *       Pages: PAGES,
 *   };
 * 
 * Example with Layout (wraps all pages):
 *
 *   import Home from './pages/Home';
 *   import Settings from './pages/Settings';
 *   import __Layout from './Layout.jsx';
 *
 *   export const PAGES = {
 *       "Home": Home,
 *       "Settings": Settings,
 *   }
 *
 *   export const pagesConfig = {
 *       mainPage: "Home",
 *       Pages: PAGES,
 *       Layout: __Layout,
 *   };
 *
 * To change the main page from HomePage to Dashboard, use find_replace:
 *   Old: mainPage: "HomePage",
 *   New: mainPage: "Dashboard",
 *
 * The mainPage value must match a key in the PAGES object exactly.
 */
import Admin from './pages/Admin';
import AdminDashboard from './pages/AdminDashboard';
import AnalisePerformance from './pages/AnalisePerformance';
import AthleteProfile from './pages/AthleteProfile';
import AthleteVideos from './pages/AthleteVideos';
import DatacenterDocumentation from './pages/DatacenterDocumentation';
import Eventos from './pages/Eventos';
import Home from './pages/Home';
import Hub from './pages/Hub';
import Lives from './pages/Lives';
import MeusServicos from './pages/MeusServicos';
import PlanoCarreira from './pages/PlanoCarreira';
import PlanoInternacional from './pages/PlanoInternacional';
import RenderPage from './pages/RenderPage';
import RevelaTalentos from './pages/RevelaTalentos';
import SearchAthletes from './pages/SearchAthletes';
import SeletivaOnline from './pages/SeletivaOnline';
import ZonaMembros from './pages/ZonaMembros';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Admin": Admin,
    "AdminDashboard": AdminDashboard,
    "AnalisePerformance": AnalisePerformance,
    "AthleteProfile": AthleteProfile,
    "AthleteVideos": AthleteVideos,
    "DatacenterDocumentation": DatacenterDocumentation,
    "Eventos": Eventos,
    "Home": Home,
    "Hub": Hub,
    "Lives": Lives,
    "MeusServicos": MeusServicos,
    "PlanoCarreira": PlanoCarreira,
    "PlanoInternacional": PlanoInternacional,
    "RenderPage": RenderPage,
    "RevelaTalentos": RevelaTalentos,
    "SearchAthletes": SearchAthletes,
    "SeletivaOnline": SeletivaOnline,
    "ZonaMembros": ZonaMembros,
}

export const pagesConfig = {
    mainPage: "RevelaTalentos",
    Pages: PAGES,
    Layout: __Layout,
};
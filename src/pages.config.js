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
import RevelaTalentos from './pages/RevelaTalentos';
import PlanoCarreira from './pages/PlanoCarreira';
import Hub from './pages/Hub';
import PlanoInternacional from './pages/PlanoInternacional';
import MeusServicos from './pages/MeusServicos';
import AnalisePerformance from './pages/AnalisePerformance';
import DatacenterDocumentation from './pages/DatacenterDocumentation';
import AdminDashboard from './pages/AdminDashboard';
import Admin from './pages/Admin';
import RenderPage from './pages/RenderPage';
import Home from './pages/Home';
import SeletivaOnline from './pages/SeletivaOnline';
import Lives from './pages/Lives';
import __Layout from './Layout.jsx';


export const PAGES = {
    "RevelaTalentos": RevelaTalentos,
    "PlanoCarreira": PlanoCarreira,
    "Hub": Hub,
    "PlanoInternacional": PlanoInternacional,
    "MeusServicos": MeusServicos,
    "AnalisePerformance": AnalisePerformance,
    "DatacenterDocumentation": DatacenterDocumentation,
    "AdminDashboard": AdminDashboard,
    "Admin": Admin,
    "RenderPage": RenderPage,
    "Home": Home,
    "SeletivaOnline": SeletivaOnline,
    "Lives": Lives,
}

export const pagesConfig = {
    mainPage: "RevelaTalentos",
    Pages: PAGES,
    Layout: __Layout,
};
import React, { useState } from "react";
import {
  BarChart,
  LayoutDashboard,
  FileCode,
  Users2
} from "lucide-react";
import AdminDashboardHome from "../components/admin/AdminDashboardHome";
import AdvancedCRM from "../components/admin/AdvancedCRM";
import AdminUsersTab from "../components/admin/AdminUsersTab";
import AdminPagesTab from "../components/admin/AdminPagesTab";

const tabs = [
  { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
  { id: 'crm', name: 'CRM', icon: BarChart },
  { id: 'pages', name: 'Páginas de Captura', icon: FileCode },
  { id: 'athletes', name: 'Atletas', icon: Users2 },
];

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <AdminDashboardHome />;
      case 'crm':
        return <AdvancedCRM />;
      case 'pages':
        return <AdminPagesTab />;
      case 'athletes':
        return <AdminUsersTab />;
      default:
        return <AdminDashboardHome />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <nav className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-6 text-2xl font-bold border-b border-gray-700">
          EC10 Admin
        </div>
        <ul className="flex-1 p-4 space-y-2">
          {tabs.map((tab) => (
            <li key={tab.id}>
              <button
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center p-3 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? "bg-blue-600"
                    : "hover:bg-gray-800"
                }`}
              >
                <tab.icon className="w-5 h-5 mr-3" />
                <span>{tab.name}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <main className="flex-1 p-8 overflow-auto">
        {renderContent()}
      </main>
    </div>
  );
}
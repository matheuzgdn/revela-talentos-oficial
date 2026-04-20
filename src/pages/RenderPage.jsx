import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { appClient } from '@/api/backendClient';
import { toast } from 'sonner';

export default function RenderPage() {
    const [pageContent, setPageContent] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const location = useLocation();

    useEffect(() => {
        const fetchPage = async () => {
            const slug = location.pathname;

            if (!slug) {
                setError("Página não encontrada.");
                setIsLoading(false);
                return;
            }

            try {
                const pages = await appClient.entities.LeadPage.filter({ url_slug: slug, is_active: true });
                if (pages && pages.length > 0) {
                    const pageData = pages[0];
                    setPageContent(pageData);

                    // Adicionar um listener de formulário após o conteúdo ser definido
                    setTimeout(() => {
                        const form = document.querySelector('form');
                        if (form && pageData.form_connection_info) {
                            form.addEventListener('submit', handleFormSubmit(pageData));
                        }
                    }, 100);
                } else {
                    setError("Página não encontrada ou inativa.");
                }
            } catch (err) {
                setError("Erro ao carregar a página.");
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPage();
    }, [location.pathname]);

    const handleFormSubmit = (pageData) => async (event) => {
        event.preventDefault();
        const form = event.target;
        const formData = new FormData(form);
        const submissionData = {};
        const mapping = pageData.form_connection_info.field_mapping || {};

        for (let [name, value] of formData.entries()) {
            const targetField = mapping[name] || name;
            submissionData[targetField] = value;
        }

        // Adiciona a página de origem
        submissionData.source_page = pageData.name;
        submissionData.lgpd_consent = submissionData.lgpd_consent === 'on' || submissionData.lgpd_consent === true;


        try {
            const targetEntity = pageData.form_connection_info.target_entity;
            const Entity = targetEntity === 'InternationalLead' ? appClient.entities.InternationalLead : appClient.entities.Lead;

            await Entity.create(submissionData);

            toast.success("Inscrição enviada com sucesso!");
            form.reset();
            // Lógica de redirecionamento ou mensagem de sucesso aqui
        } catch (err) {
            console.error("Erro ao enviar formulário:", err);
            toast.error("Erro ao enviar. Verifique os campos.");
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-sky-400"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-red-500 mb-4">Erro 404</h1>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    if (pageContent) {
        return <div dangerouslySetInnerHTML={{ __html: pageContent.html_content }} />;
    }

    return null;
}

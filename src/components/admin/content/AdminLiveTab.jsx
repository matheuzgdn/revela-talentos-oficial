import React, { useEffect, useMemo, useState } from 'react';
import { appClient } from '@/api/backendClient';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Radio, Settings2, Video } from 'lucide-react';

const formatDateTime = (value) => {
  if (!value) return 'Nao definido';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString('pt-BR');
};

export default function AdminLiveTab() {
  const [isLoading, setIsLoading] = useState(true);
  const [liveContent, setLiveContent] = useState([]);
  const [status, setStatus] = useState({
    showLiveCard: false,
    isLiveActive: false,
    nextLiveDate: '',
  });

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const [contentItems, platformSettings] = await Promise.all([
          appClient.entities.Content.filter({ category: 'live' }, '-created_date', 12),
          appClient.entities.PlatformSettings.list(),
        ]);

        const getValue = (key, fallback = '') =>
          platformSettings.find((setting) => setting.setting_key === key)?.setting_value || fallback;

        setLiveContent(contentItems || []);
        setStatus({
          showLiveCard: getValue('show_live_card', 'true') === 'true',
          isLiveActive: getValue('is_live_active', 'false') === 'true',
          nextLiveDate: getValue('next_live_date', ''),
        });
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, []);

  const publishedCount = useMemo(
    () => liveContent.filter((item) => item.is_published).length,
    [liveContent]
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-sky-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-gray-800 bg-gray-900">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Radio className="h-5 w-5 text-red-500" />
            Central rapida de lives
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-gray-800 bg-black/20 p-4">
              <p className="text-sm font-medium text-gray-400">Status da transmissao</p>
              <p className="mt-2 text-xl font-black text-white">{status.isLiveActive ? 'Ao vivo' : 'Offline'}</p>
              <p className="mt-1 text-xs text-gray-500">A operacao completa fica na aba Lives do menu lateral.</p>
            </div>
            <div className="rounded-2xl border border-gray-800 bg-black/20 p-4">
              <p className="text-sm font-medium text-gray-400">Card no Hub</p>
              <p className="mt-2 text-xl font-black text-white">{status.showLiveCard ? 'Visivel' : 'Oculto'}</p>
              <p className="mt-1 text-xs text-gray-500">Use a aba Lives para ajustar visibilidade e comunicacao.</p>
            </div>
            <div className="rounded-2xl border border-gray-800 bg-black/20 p-4">
              <p className="text-sm font-medium text-gray-400">Proxima live</p>
              <p className="mt-2 text-base font-bold text-white">{formatDateTime(status.nextLiveDate)}</p>
              <p className="mt-1 text-xs text-gray-500">Horario salvo nas configuracoes globais de lives.</p>
            </div>
          </div>

          <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm font-semibold text-white">Operacao principal agora fica centralizada em Lives</p>
                <p className="mt-1 text-sm text-cyan-100/80">
                  Aqui voce acompanha os conteudos de categoria live. O estudio, diagnostico de dispositivos e conexoes estao na aba Lives do menu lateral.
                </p>
              </div>
              <div className="inline-flex items-center rounded-full border border-cyan-400/30 bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-100">
                <Settings2 className="mr-2 h-4 w-4" />
                Aba Lives organizada
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-gray-800 bg-gray-900">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Video className="h-5 w-5 text-cyan-400" />
            Conteudos de live cadastrados
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge className="bg-cyan-500/15 text-cyan-200 border border-cyan-500/20">
              {liveContent.length} conteudos live
            </Badge>
            <Badge className="bg-emerald-500/15 text-emerald-200 border border-emerald-500/20">
              {publishedCount} publicados
            </Badge>
          </div>

          {liveContent.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-800 bg-black/20 px-4 py-10 text-center">
              <p className="text-sm text-gray-400">Nenhum conteudo da categoria live foi cadastrado ainda.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              {liveContent.map((item) => (
                <div key={item.id} className="rounded-2xl border border-gray-800 bg-black/20 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-white">{item.title}</p>
                      <p className="mt-1 line-clamp-2 text-xs text-gray-500">{item.description || 'Sem descricao informada.'}</p>
                    </div>
                    <Badge className={item.is_published ? 'bg-emerald-600 text-white' : 'bg-gray-700 text-gray-200'}>
                      {item.is_published ? 'Publicado' : 'Rascunho'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

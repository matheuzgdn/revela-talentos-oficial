
import React from 'react';
import { CheckCircle } from 'lucide-react';
import CardVideoPreview from './CardVideoPreview';

const ContentCard = ({ content, progress, onSelect }) => (
  <div className="w-40 flex-shrink-0">
    <CardVideoPreview
      content={content}
      onClick={onSelect}
      progress={progress}
      isLocked={false}
    />
  </div>
);

export default function ContentProgressTracker({ contents, userProgress, onContentSelect, translations }) {
  // 1. Garantir que cada vídeo apareça apenas uma vez (o progresso mais recente)
  const latestProgress = Object.values(userProgress.reduce((acc, p) => {
    if (!p.content_id) return acc; // Ignorar progresso sem content_id

    // Se não houver entrada ou a entrada atual for mais recente, atualize
    // Prioriza entradas com `last_watched` ou a mais recente se ambos tiverem
    const existingLastWatched = acc[p.content_id]?.last_watched ? new Date(acc[p.content_id].last_watched) : null;
    const currentLastWatched = p.last_watched ? new Date(p.last_watched) : null;

    if (!acc[p.content_id] ||
        (currentLastWatched && (!existingLastWatched || currentLastWatched > existingLastWatched)) ||
        (!currentLastWatched && !existingLastWatched && p.progress_percentage > (acc[p.content_id]?.progress_percentage || 0))) {
      acc[p.content_id] = p;
    }
    return acc;
  }, {}));

  // 2. Filtrar para vídeos "em andamento"
  const inProgressContents = latestProgress
    .filter(p => p.progress_percentage > 0 && p.progress_percentage < 95)
    .map(p => {
      const content = contents.find(c => c.id === p.content_id);
      return content ? {
        ...content,
        progress: p.progress_percentage,
        watchTime: p.watch_time_seconds, // Keep watchTime in content object if needed elsewhere, but not passed to card
        lastWatched: p.last_watched
      } : null;
    })
    .filter(Boolean)
    .sort((a, b) => {
      // Handle cases where lastWatched might be null or undefined
      const dateA = a.lastWatched ? new Date(a.lastWatched) : new Date(0); // Use epoch for missing dates
      const dateB = b.lastWatched ? new Date(b.lastWatched) : new Date(0);
      return dateB.getTime() - dateA.getTime();
    });

  // 3. Filtrar para vídeos "concluídos recentemente"
  const recentlyCompletedContents = latestProgress
    .filter(p => {
      // Considerado concluído se progress_percentage >= 95 e tiver um last_watched válido
      if (p.progress_percentage < 95 || !p.last_watched) return false;
      const lastWatchedDate = new Date(p.last_watched);
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      return lastWatchedDate > sevenDaysAgo;
    })
    .map(p => {
        const content = contents.find(c => c.id === p.content_id);
        return content ? { ...content, lastWatched: p.last_watched } : null;
    })
    .filter(Boolean)
    .sort((a, b) => {
      // Handle cases where lastWatched might be null or undefined
      const dateA = a.lastWatched ? new Date(a.lastWatched) : new Date(0);
      const dateB = b.lastWatched ? new Date(b.lastWatched) : new Date(0);
      return dateB.getTime() - dateA.getTime();
    })
    .slice(0, 5);

  if (inProgressContents.length === 0 && recentlyCompletedContents.length === 0) {
    return null;
  }

  const t = translations || { continueWatching: "Continue de Onde Parou", recentlyCompleted: "Concluídos Recentemente" };

  return (
    <div className="space-y-8 my-12">
      {inProgressContents.length > 0 && (
        <section>
          <h2 className="text-xl md:text-2xl font-bold text-white mb-4"
              style={{
                textShadow: '0 0 10px rgba(34, 211, 238, 0.6), 0 0 20px rgba(34, 211, 238, 0.4)'
              }}>
            {t.continueWatching}
          </h2>
          <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide -mx-3 px-3 md:mx-0 md:px-0">
            {inProgressContents.map(content => (
              <ContentCard
                key={content.id}
                content={content}
                progress={content.progress}
                onSelect={onContentSelect}
              />
            ))}
          </div>
        </section>
      )}

      {recentlyCompletedContents.length > 0 && (
         <section>
          <h2 className="text-xl md:text-2xl font-bold text-white mb-4 flex items-center gap-2"
              style={{
                textShadow: '0 0 10px rgba(34, 197, 94, 0.6), 0 0 20px rgba(34, 197, 94, 0.4)'
              }}>
            <CheckCircle className="text-green-400" />
            {t.recentlyCompleted}
          </h2>
          <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide -mx-3 px-3 md:mx-0 md:px-0">
            {recentlyCompletedContents.map(content => (
              <ContentCard
                key={content.id}
                content={content}
                progress={100}
                onSelect={onContentSelect}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

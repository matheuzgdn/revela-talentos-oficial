import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import CardVideoPreview from "./CardVideoPreview";

export default function ContentGrid({ contents, onContentSelect, getProgress, isLoading, user, showRankNumbers = false }) {

  if (isLoading) {
    return (
      <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="w-40 flex-shrink-0">
            <Skeleton className="aspect-[2/3] w-full bg-gray-800 rounded-lg" />
          </div>
        ))}
      </div>
    );
  }

  if (contents.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        Nenhum conteúdo disponível
      </div>
    );
  }

  return (
    <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide -mx-3 px-3 md:mx-0 md:px-0">
      {contents.map((content, index) => {
        const currentContentProgress = getProgress ? getProgress(content.id) : 0;
        const isEliteContent = content.access_level === 'elite';
        const isLocked = isEliteContent && user?.subscription_level !== 'elite';
        
        return (
          <div key={content.id} className="w-40 flex-shrink-0">
            <CardVideoPreview
              content={content}
              onClick={onContentSelect}
              progress={currentContentProgress}
              isLocked={isLocked}
              rankNumber={showRankNumbers && index < 10 ? index + 1 : null}
            />
          </div>
        );
      })}
    </div>
  );
}
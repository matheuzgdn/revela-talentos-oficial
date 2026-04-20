import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, ExternalLink, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export default function StoriesModal({ stories, isOpen, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const videoRef = useRef(null);
  const intervalRef = useRef(null);

  const currentStory = stories[currentIndex];

  useEffect(() => {
    if (!isOpen || !currentStory || isPaused) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    setProgress(0);
    const duration = (currentStory.duration || 10) * 1000;
    const startTime = Date.now();

    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = (elapsed / duration) * 100;

      if (newProgress >= 100) {
        handleNext();
      } else {
        setProgress(newProgress);
      }
    }, 50);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [currentIndex, isOpen, currentStory, isPaused]);

  useEffect(() => {
    if (videoRef.current) {
      if (isPaused) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  }, [isPaused]);

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setProgress(0);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setProgress(0);
    }
  };

  const handleLinkClick = () => {
    if (currentStory?.link_url) {
      window.open(currentStory.link_url, "_blank");
    }
  };

  if (!isOpen || !stories?.length) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] bg-black flex items-center justify-center"
      >
        {/* Progress Bars */}
        <div className="absolute top-4 left-4 right-4 flex gap-1 z-50">
          {stories.map((_, idx) => (
            <div key={idx} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
              <Progress
                value={idx === currentIndex ? progress : idx < currentIndex ? 100 : 0}
                className="h-full"
              />
            </div>
          ))}
        </div>

        {/* Close Button */}
        <Button
          onClick={onClose}
          variant="ghost"
          size="icon"
          className="absolute top-6 right-4 z-50 text-white hover:bg-white/20"
        >
          <X className="w-6 h-6" />
        </Button>

        {/* Story Title */}
        {currentStory?.title && (
          <div className="absolute top-14 left-4 right-4 z-50">
            <h3 className="text-white font-bold text-lg drop-shadow-lg">
              {currentStory.title}
            </h3>
          </div>
        )}

        {/* Video Container */}
        <div className="relative w-full h-full max-w-md mx-auto flex items-center justify-center">
          <video
            ref={videoRef}
            src={currentStory?.video_url}
            className="w-full h-full object-contain"
            autoPlay
            playsInline
            loop
            onClick={() => setIsPaused(!isPaused)}
          />

          {/* Pause Overlay */}
          {isPaused && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-black/50 flex items-center justify-center"
            >
              <Play className="w-20 h-20 text-white" />
            </motion.div>
          )}

          {/* Navigation Areas */}
          <div className="absolute inset-0 flex">
            <button
              onClick={handlePrev}
              className="flex-1 cursor-pointer"
              disabled={currentIndex === 0}
            />
            <button
              onClick={handleNext}
              className="flex-1 cursor-pointer"
            />
          </div>

          {/* Navigation Buttons */}
          {currentIndex > 0 && (
            <Button
              onClick={handlePrev}
              variant="ghost"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
            >
              <ChevronLeft className="w-8 h-8" />
            </Button>
          )}

          {currentIndex < stories.length - 1 && (
            <Button
              onClick={handleNext}
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
            >
              <ChevronRight className="w-8 h-8" />
            </Button>
          )}

          {/* Link Button */}
          {currentStory?.link_url && (
            <Button
              onClick={handleLinkClick}
              className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white text-black hover:bg-gray-200 font-bold"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Saiba Mais
            </Button>
          )}
        </div>

        {/* Counter */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-sm">
          {currentIndex + 1} / {stories.length}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
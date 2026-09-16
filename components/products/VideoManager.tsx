"use client";

import { useRef } from "react";
import { X, Video as VideoIcon } from "lucide-react";

export interface VideoEntry {
  kind: "file" | "url";
  file?: File;
  url?: string;
  preview: string;
}

interface VideoManagerProps {
  video: VideoEntry | null;
  onChange: (video: VideoEntry | null) => void;
}

export default function VideoManager({ video, onChange }: VideoManagerProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    onChange({ kind: "file", file, preview: URL.createObjectURL(file) });
  };

  const handleRemove = () => {
    if (video?.kind === "file" && video.preview.startsWith("blob:")) {
      URL.revokeObjectURL(video.preview);
    }
    onChange(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  if (video) {
    return (
      <div className="relative w-fit">
        <video
          src={video.preview}
          controls
          className="max-h-48 rounded-xl border border-border/50"
        />
        <button
          type="button"
          onClick={handleRemove}
          className="absolute left-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-destructive text-white"
          aria-label="إزالة الفيديو"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor="video-upload"
        className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-border/50 bg-background/60 px-4 py-6 text-sm text-foreground/50 transition-colors hover:bg-background/80"
      >
        <VideoIcon className="h-4 w-4" />
        اضغط لرفع فيديو المنتج (يُرفع عند الحفظ)
      </label>
      <input
        ref={inputRef}
        id="video-upload"
        type="file"
        accept="video/*"
        onChange={(e) => handleFile(e.target.files?.[0])}
        className="hidden"
      />
    </div>
  );
}

export function createVideoEntryFromUrl(url: string): VideoEntry {
  return { kind: "url", url, preview: url };
}
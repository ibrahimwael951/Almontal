"use client";

import { useRef } from "react";
import ProductImage from "@/components/products/productImage";
import { Upload, X, GripVertical } from "lucide-react";

export interface ImageEntry {
  key: string;
  kind: "file" | "url";
  file?: File;
  url?: string;
  preview: string;
}

interface ImageManagerProps {
  images: ImageEntry[];
  onChange: (images: ImageEntry[]) => void;
}

let keyCounter = 0;
const nextKey = () => `img-${Date.now()}-${keyCounter++}`;

export default function ImageManager({ images, onChange }: ImageManagerProps) {
  const dragIndex = useRef<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const newEntries: ImageEntry[] = Array.from(files).map((file) => ({
      key: nextKey(),
      kind: "file",
      file,
      preview: URL.createObjectURL(file),
    }));

    onChange([...images, ...newEntries]);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleRemove = (index: number) => {
    const entry = images[index];
    if (entry.kind === "file" && entry.preview.startsWith("blob:")) {
      URL.revokeObjectURL(entry.preview);
    }
    onChange(images.filter((_, i) => i !== index));
  };

  const handleDrop = (index: number) => {
    if (dragIndex.current === null || dragIndex.current === index) return;
    const updated = [...images];
    const [moved] = updated.splice(dragIndex.current, 1);
    updated.splice(index, 0, moved);
    onChange(updated);
    dragIndex.current = null;
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-3">
        {images.map((img, i) => (
          <div
            key={img.key}
            draggable
            onDragStart={() => (dragIndex.current = i)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop(i)}
            className="group relative h-24 w-24 shrink-0 cursor-grab overflow-hidden rounded-xl border border-border/50 active:cursor-grabbing"
          >
            <ProductImage
              src={img.preview}
              alt={`صورة ${i + 1}`}
              className="h-full w-full object-cover"
            />

            {i === 0 && (
              <span className="absolute right-1 top-1 rounded-full bg-primary px-1.5 py-0.5 text-[9px] font-medium text-primary-foreground">
                رئيسية
              </span>
            )}

            <span className="absolute left-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-background/70 text-foreground/50">
              <GripVertical className="h-3 w-3" />
            </span>

            <button
              type="button"
              onClick={() => handleRemove(i)}
              className="absolute bottom-1 left-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-white opacity-0 transition-opacity group-hover:opacity-100"
              aria-label="إزالة"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}

        <label
          htmlFor="image-upload"
          className="flex h-24 w-24 shrink-0 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-border/50 text-foreground/40 transition-colors hover:bg-background/60"
        >
          <Upload className="h-5 w-5" />
          <span className="text-[10px]">إضافة صورة</span>
        </label>
        <input
          ref={inputRef}
          id="image-upload"
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />
      </div>

      <p className="text-xs text-foreground/40">
        اسحب الصور لإعادة ترتيبها — الصورة الأولى هي الصورة الرئيسية للمنتج،
        وسيتم رفعها عند حفظ المنتج
      </p>
    </div>
  );
}

export function createImageEntryFromUrl(url: string): ImageEntry {
  return { key: nextKey(), kind: "url", url, preview: url };
}

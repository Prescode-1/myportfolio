import React, { useRef, useState } from 'react';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';
import { useContent } from '../context/ContentContext';

interface AdminImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  onUpload: (file: File) => Promise<string>;
  label?: string;
}

export default function AdminImageUpload({ value, onChange, onUpload, label }: AdminImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { getImageUrl } = useContent();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const url = await onUpload(file);
      if (url) {
        onChange(url);
      }
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      {label && <label className="block text-sm font-bold text-slate-600 mb-2">{label}</label>}
      
      <div className="flex flex-col gap-4">
        {value ? (
          <div className="relative group w-full aspect-video rounded-2xl overflow-hidden bg-slate-50 border-2 border-slate-100">
            <img src={getImageUrl(value)} alt="Uploaded" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-dark/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="p-3 bg-white text-dark rounded-xl hover:text-primary transition-all shadow-lg"
                title="Change Image"
              >
                <Upload size={20} />
              </button>
              <button 
                onClick={() => onChange('')}
                className="p-3 bg-white text-red-500 rounded-xl hover:bg-red-50 transition-all shadow-lg"
                title="Remove Image"
              >
                <X size={20} />
              </button>
            </div>
            {isUploading && (
              <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center">
                <Loader2 size={32} className="text-primary animate-spin" />
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="w-full aspect-video rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center gap-3 hover:border-primary/50 hover:bg-primary/5 transition-all group"
          >
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-slate-400 group-hover:text-primary group-hover:scale-110 transition-all shadow-sm">
              {isUploading ? <Loader2 size={24} className="animate-spin" /> : <Upload size={24} />}
            </div>
            <div className="text-center">
              <div className="text-sm font-bold text-slate-600">Click to upload</div>
              <div className="text-xs text-slate-400 font-semibold">PNG, JPG or WEBP (Max 5MB)</div>
            </div>
          </button>
        )}

        <div className="relative">
          <div className="absolute inset-y-0 left-5 flex items-center text-slate-400">
            <ImageIcon size={18} />
          </div>
          <input 
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Or paste an image URL..."
            className="w-full bg-slate-50 border-none rounded-2xl pl-14 pr-6 py-4 text-sm focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      <input 
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
      />
    </div>
  );
}

import { useState, useCallback } from "react";
import { UploadCloud, File, X, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface UploadZoneProps {
  onFileSelect?: (file: File | null) => void;
}

export function UploadZone({ onFileSelect }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (newFile: File | null) => {
    setFile(newFile);
    if (onFileSelect) {
      onFileSelect(newFile);
    }
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <AnimatePresence mode="wait">
        {!file ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`
              relative flex flex-col items-center justify-center p-12 text-center
              border-2 border-dashed rounded-2xl transition-all duration-200
              ${isDragging 
                ? "border-primary bg-primary/5 scale-[1.02]" 
                : "border-border/50 bg-card/20 hover:bg-card/40 hover:border-border"}
            `}
          >
            <div className="p-4 rounded-full bg-secondary/50 mb-4">
              <UploadCloud className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Upload Credential Document</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Drag and drop your PDF here, or click to browse.
            </p>
            <label className="cursor-pointer w-full sm:w-auto">
              <input type="file" className="hidden" onChange={(e) => e.target.files && handleFileChange(e.target.files[0])} accept=".pdf,.png,.jpg" />
              <div className="bg-white text-black px-6 py-3 md:py-2.5 rounded-full font-medium hover:bg-white/90 transition-colors flex items-center justify-center">
                Select File
              </div>
            </label>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-6 rounded-2xl glass-card flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <File className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h4 className="font-medium text-foreground">{file.name}</h4>
                <p className="text-xs text-muted-foreground">
                  {file.size < 1024 * 1024 
                    ? `${(file.size / 1024).toFixed(2)} KB`
                    : `${(file.size / 1024 / 1024).toFixed(2)} MB`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-status-valid" />
              <button 
                onClick={() => handleFileChange(null)}
                className="p-2 hover:bg-secondary rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

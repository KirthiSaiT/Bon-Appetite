import React, { useRef } from "react";
import { Upload } from "lucide-react";
import { getDisplayImageUrl } from "@/lib/imageUtils";

interface ImageUploadProps {
  imageUrl: string;
  onImageUpload: (file: File) => void;
  className?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ 
  imageUrl, 
  onImageUpload,
  className = ""
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const displayImageUrl = getDisplayImageUrl(imageUrl);

  return (
    <div className={`relative h-48 bg-orange-100 flex items-center justify-center group ${className}`}>
      <img 
        src={displayImageUrl}
        alt="Product"
        className="w-full h-full object-cover"
      />
      <button
        onClick={triggerFileInput}
        className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <div className="bg-white rounded-full p-2">
          <Upload className="w-6 h-6 text-orange-600" />
        </div>
      </button>
      
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
      />
    </div>
  );
};

export default ImageUpload;
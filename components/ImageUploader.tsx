import React, { useState, DragEvent, useEffect } from "react";
import { uploadToCloudinary } from "@/services/uploadService";

const MAX_UPLOADS = 5;

interface ImageUploaderProps {
  onChange?: (urls: string[]) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onChange }) => {
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (onChange) onChange(imageUrls);
  }, [imageUrls, onChange]);

  const handleFiles = async (files: FileList | null) => {
    if (!files) return;

    const remainingSlots = MAX_UPLOADS - imageUrls.length;
    const filesToUpload = Array.from(files).slice(0, remainingSlots);

    if (filesToUpload.length === 0) {
      setError(`You can only upload up to ${MAX_UPLOADS} images.`);
      return;
    }

    setUploading(true);
    setError(null);

    const uploads = filesToUpload.map(uploadToCloudinary);
    const results = await Promise.all(uploads);
    const validUrls = results.filter((url): url is string => !!url);

    setImageUrls((prev) => [...prev, ...validUrls]);
    setUploading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  const handleDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleRemove = (index: number) => {
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleChange}
        className="hidden"
        id="image-uploader-input"
      />

      <label
        htmlFor="image-uploader-input"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`flex flex-col items-center justify-center border-2 border-dashed rounded-md p-6 cursor-pointer transition-all ${
          isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"
        }`}
      >
        <p className="text-gray-500">
          Drag & drop images here, or click to select
        </p>
        <p className="text-xs text-gray-400 mt-1">(Max {MAX_UPLOADS} images)</p>
      </label>

      {uploading && (
        <p className="text-sm text-blue-500 animate-pulse">Uploading...</p>
      )}

      {error && <p className="text-sm text-red-500">{error}</p>}

      {imageUrls.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {imageUrls.map((url, index) => (
            <div key={index} className="relative group">
              <img
                src={url}
                alt={`Uploaded ${index}`}
                className="w-full h-32 object-cover rounded shadow"
              />
              <button
                onClick={() => handleRemove(index)}
                className="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUploader;

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud } from "lucide-react";

export default function ImageDropzone({ onDropImage }: { onDropImage: (file: File) => void }) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onDropImage(acceptedFiles[0]);
    }
  }, [onDropImage]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxSize: 5 * 1024 * 1024, // 5MB
    multiple: false,
  });

  return (
    <div
      {...getRootProps()}
      className="border border-dashed border-gray-300 rounded-md p-6 text-center cursor-pointer bg-gray-50 hover:bg-gray-100 transition"
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center gap-2">
        <UploadCloud className="w-6 h-6 text-gray-500" />
        <p className="text-sm text-gray-700">
          {isDragActive ? "Lepaskan untuk mengunggah gambar" : "Letakkan gambar di sini atau"}{" "}
          <span className="text-blue-600 underline">unggah</span>
        </p>
        <p className="text-xs text-gray-400">Max size: 5MB</p>
      </div>
    </div>
  );
}

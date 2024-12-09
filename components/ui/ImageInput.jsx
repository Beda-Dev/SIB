import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";

const DropZone = ({ onChange, defaultValue = [] }) => {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    if (defaultValue.length > 0) {
      const initializedFiles = defaultValue.map((file) => {
        if (file instanceof File || file instanceof Blob) {
          return {
            ...file,
            preview: URL.createObjectURL(file),
          };
        }
        return {
          ...file,
          preview: file.url,
        };
      });

      // Ajout des fichiers initiaux tout en évitant les doublons
      setFiles((prevFiles) => {
        const fileNames = prevFiles.map((f) => f.name || f.url);
        const newFiles = initializedFiles.filter(
          (file) => !fileNames.includes(file.name || file.url)
        );
        const allFiles = [...prevFiles, ...newFiles];
        if (onChange) onChange(allFiles); // Mise à jour des fichiers dans le parent
        return allFiles;
      });
    }
  }, []);

  const { getRootProps, getInputProps, isDragAccept } = useDropzone({
    accept: {
      "image/*": [],
    },
    onDrop: (acceptedFiles) => {
      const validFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );

      const allFiles = [...files, ...validFiles];
      setFiles(allFiles);
      if (onChange) onChange(allFiles);
    },
  });

  const removeFile = (index) => {
    const fileToRemove = files[index];
    if (fileToRemove && !fileToRemove.url) {
      URL.revokeObjectURL(fileToRemove.preview);
    }

    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    if (onChange) onChange(updatedFiles);
  };

  useEffect(() => {
    return () => {
      files.forEach((file) => {
        if (!file.url) {
          URL.revokeObjectURL(file.preview);
        }
      });
    };
  }, [files]);

  return (
    <div className="w-full text-center rounded-md py-4 flex flex-col justify-center items-center">
      <div className="flex flex-wrap gap-4 justify-start">
        {files.map((file, index) => (
          <div
            className="relative w-32 h-32 rounded border p-2 border-slate-200 flex items-center justify-center bg-gray-50"
            key={index}
          >
            <button
              className="absolute top-2 right-2 text-white rounded-full w-6 h-6 flex items-center justify-center"
              onClick={() => removeFile(index)}
              aria-label={`Supprimer ${file.name || "image"}`}
            >
              &times;
            </button>
            <img
              src={file.preview}
              className="object-contain w-full h-full rounded"
              alt={file.name || `Image ${index + 1}`}
            />
          </div>
        ))}
      </div>
      <div
        {...getRootProps({
          className:
            "dropzone mt-4 w-full py-6 border-dashed border-2 border-gray-400 rounded-md hover:bg-gray-100 transition",
        })}
      >
        <input className="hidden" {...getInputProps()} />
        <img
          src="/assets/images/svg/upload.svg"
          alt="upload"
          className="mx-auto mb-2 w-12 h-12"
        />
        {isDragAccept ? (
          <p className="text-sm text-slate-500 dark:text-slate-300">
            Déposez l'image ici...
          </p>
        ) : (
          <p className="text-sm text-slate-500 dark:text-slate-300">
            Cliquez ou glissez vos images ici pour les uploader
          </p>
        )}
      </div>
    </div>
  );
};

export default DropZone;

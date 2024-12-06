import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";

const DropZone = ({ onChange, defaultValue = [] }) => {
  const [files, setFiles] = useState(() =>
    defaultValue.map((file) => ({
      ...file,
      preview: file.url || (file instanceof File ? URL.createObjectURL(file) : null),
    }))
  );

  // Gestion des nouvelles images ajoutées via dropzone
  const { getRootProps, getInputProps, isDragAccept } = useDropzone({
    accept: {
      "image/*": [],
    },
    onDrop: (acceptedFiles) => {
      const newFiles = acceptedFiles.map((file) => ({
        ...file,
        preview: URL.createObjectURL(file),
      }));

      const updatedFiles = [...files, ...newFiles];
      setFiles(updatedFiles);

      if (onChange) onChange(updatedFiles);
    },
  });

  // Supprimer un fichier
  const removeFile = (index) => {
    const fileToRemove = files[index];

    // Révoquer l'URL si elle a été générée localement
    if (fileToRemove && !fileToRemove.url) {
      URL.revokeObjectURL(fileToRemove.preview);
    }

    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);

    if (onChange) onChange(updatedFiles);
  };

  // Nettoyage des URLs générées
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
      {/* Aperçu des fichiers */}
      <div className="flex flex-wrap gap-4 justify-start">
        {files.map((file, index) => (
          <div
            className="relative w-32 h-32 rounded border p-2 border-slate-200 flex items-center justify-center bg-gray-50"
            key={index}
          >
            {/* Bouton supprimer */}
            <button
              className="absolute top-2 right-2 text-white rounded-full w-6 h-6 flex items-center justify-center"
              onClick={() => removeFile(index)}
              aria-label={`Supprimer ${file.name || "image"}`}
            >
              &times;
            </button>
            {/* Aperçu image */}
            <img
              src={file.preview}
              className="object-contain w-full h-full rounded"
              alt={file.name || `Image ${index + 1}`}
            />
          </div>
        ))}
      </div>

      {/* Zone de dépôt */}
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

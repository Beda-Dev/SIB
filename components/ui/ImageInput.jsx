import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";

const DropZone = ({ onChange, defaultValue = [] }) => {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    // Si un defaultValue est fourni, on l'utilise pour initialiser les fichiers
    if (defaultValue.length > 0) {
      const initializedFiles = defaultValue.map((file) => ({
        ...file,
        preview: file.url || URL.createObjectURL(file), // Permet de gérer les fichiers locaux ou les URLs
      }));
      setFiles(initializedFiles);
    }
  }, [defaultValue]);

  const { getRootProps, getInputProps, isDragAccept } = useDropzone({
    accept: {
      "image/*": [],
    },
    onDrop: (acceptedFiles) => {
      const updatedFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );
      setFiles((prev) => [...prev, ...updatedFiles]);
      if (onChange) onChange([...files, ...acceptedFiles]);
    },
  });

  // Supprimer une image
  const removeFile = (index) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    if (onChange) onChange(updatedFiles); // Mettre à jour le parent après suppression
  };

  return (
    <div className="w-full text-center rounded-md py-4 flex flex-col justify-center items-center">
      {/* Zone des images sélectionnées */}
      <div className="flex flex-wrap gap-4 justify-start">
        {files.map((file, index) => (
          <div
            className="relative xl:w-1/5 md:w-1/3 w-1/2 rounded border p-2 border-slate-200"
            key={index}
          >
            {/* Bouton pour supprimer */}
            <button
              className="absolute top-2 right-2 transparent text-white rounded-full w-6 h-6 flex items-center justify-center"
              onClick={() => removeFile(index)}
              aria-label={`Supprimer ${file.name || "image"}`}
            >
              &times;
            </button>
            {/* Aperçu de l'image */}
            <img
              src={file.preview}
              className="object-cover w-full h-full rounded"
              alt={file.name || `Image ${index + 1}`}
              onLoad={() => {
                if (!file.url) URL.revokeObjectURL(file.preview); // Révoquer l'URL si elle a été créée localement
              }}
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

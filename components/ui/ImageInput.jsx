import React, { useState } from "react";
import { useDropzone } from "react-dropzone";

const DropZone = ({ onChange }) => {
  const [files, setFiles] = useState([]);
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
      if (onChange) onChange(acceptedFiles);
    },
  });

  // Supprimer une image
  const removeFile = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  return (
    <div className={`w-full text-center  rounded-md py-4 flex flex-col justify-center items-center`}>
      {/* Zone des images sélectionnées */}
      <div className="flex flex-wrap gap-4 justify-start">
        {files.map((file, index) => (
          <div
            className="relative xl:w-1/5 md:w-1/3 w-1/2 rounded border p-2 border-slate-200"
            key={index}
          >
            {/* Bouton pour supprimer */}
            <button
              className="absolute top-2 right-2 bg-transparent text-white rounded-full w-6 h-6 flex items-center justify-center"
              onClick={() => removeFile(index)}
            >
              x
            </button>
            {/* Aperçu de l'image */}
            <img
              src={file.preview}
              className="object-cover w-full h-full rounded"
              alt={file.name}
              onLoad={() => URL.revokeObjectURL(file.preview)}
            />
          </div>
        ))}
      </div>

      {/* Zone de dépôt */}
      <div
        {...getRootProps({
          className:`dropzone mt-4 w-full py-6 border-dashed border border-gray-400 rounded-md`,
        })}
      >
        <input className="hidden" {...getInputProps()} />
        <img
          src="/assets/images/svg/upload.svg"
          alt="upload"
          className="mx-auto mb-2"
        />
        {isDragAccept ? (
          <p className="text-sm text-slate-500 dark:text-slate-300">
            Déposer l'image...
          </p>
        ) : (
          <p className="text-sm text-slate-500 dark:text-slate-300">
            Déposez l'image produit ici ou cliquez pour uploader
          </p>
        )}
      </div>
    </div>
  );
};

export default DropZone;

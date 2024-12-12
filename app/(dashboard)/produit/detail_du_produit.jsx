import React, { useState, useEffect, Fragment } from "react";
import SimpleBar from "simplebar-react";
import { GetProduitById } from "./api_recherche_produit.jsx";
import { Transition } from "@headlessui/react";

const Voir_produit = ({ id, onChange }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [produit, setProduit] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedImage, setSelectedImage] = useState();

  const handleClose = () => {
    setIsOpen(false);
    if (onChange) {
      onChange(false); // Notifie le parent
    }
  };
  useEffect(() => {
    const fetchProduit = async () => {
      setIsLoading(true);
      try {
        const response = await GetProduitById(id);
        if (response?.data?.data) {
          setProduit(response.data.data);
          setSelectedImage(response.data.data.images?.[0]?.url);
        } else {
          console.error("Aucune donnée trouvée pour le produit.");
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduit();
  }, [id]);

  const VoirProduit = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-64">
          <p className="text-center text-gray-500 text-lg animate-pulse">
            Chargement...
          </p>
        </div>
      );
    }

    if (!produit) {
      return (
        <div className="flex justify-center items-center h-64">
          <p className="text-center text-red-500 text-lg font-medium">
            Produit introuvable.
          </p>
        </div>
      );
    }

    return (
      <>
        <header className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Détails du Produit
          </h1>
          <p className="text-gray-500">
            Découvrez les détails du produit sélectionné.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-8 text-center">
          <section className="space-y-6">
            <div className="flex justify-center items-center">
              {produit.images.length == 0 ? (
                <div className="w-72 h-72 rounded-lg object-cover shadow-md text-lg text-center flex items-center justify-center ">
                  {" "}
                  aucune image trouvée
                </div>
              ) : (
                <img
                  src={selectedImage}
                  alt={produit.label}
                  className="w-72 h-72 object-cover rounded-lg shadow-md transition-transform duration-300 hover:scale-105"
                />
              )}
            </div>

            {produit.images?.length > 0 && (
              <div className="flex justify-center items-center space-x-3">
                {produit.images.map((img, index) => (
                  <img
                    key={index}
                    src={img.url}
                    alt={`Image ${index + 1}`}
                    className={`w-16 h-16 object-cover cursor-pointer border transition-all duration-300 ${
                      selectedImage === img.url
                        ? "border-blue-500 shadow-lg scale-110 shadow-sm"
                        : "border-gray-200 hover:scale-105"
                    }`}
                    onClick={() => setSelectedImage(img.url)}
                  />
                ))}
              </div>
            )}
          </section>
          <section className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800">
              {produit.label}
            </h2>
            <p className="text-md text-gray-500">
              Catégorie :{" "}
              <span className="text-gray-700 font-medium">
                {produit.category?.label || "Catégorie inconnue"}
              </span>
            </p>
            <div className="text-xl font-bold text-gray-800">
              {produit.unit_price.toFixed(2)} FCFA
              <div className="flex space-x-3">
                {produit.sizes?.map((size, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 border rounded-lg transition-colors duration-300 ${
                      selectedSize === size
                        ? "bg-black text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-700">
                Description :
              </h3>
              <p className="text-gray-600 mt-2">
                {produit.description || "Aucune description disponible."}
              </p>
            </div>
          </section>
        </div>
      </>
    );
  };

  return (
    <div>
      <Transition
        as={Fragment}
        show={true}
        enter="transition ease-out duration-300"
        enterFrom="opacity-0 translate-x-full"
        enterTo="opacity-100 translate-x-0"
        leave="transition ease-in duration-200"
        leaveFrom="opacity-100 translate-x-0"
        leaveTo="opacity-0 translate-x-full"
      >
        <div
          className={`setting-wrapper fixed ltr:right-0 rtl:left-0 top-0 md:w-[400px] w-[300px]
         bg-white dark:bg-slate-800 h-screen z-[9999] md:pb-6 pb-[100px] shadow-base2
          dark:shadow-base3 border border-slate-200 dark:border-slate-700 transition-all duration-300 ease-in-out transform
          ${
            isOpen
              ? "translate-x-0 opacity-100 visible"
              : "ltr:translate-x-full rtl:-translate-x-full opacity-0 invisible"
          }`}
        >
          {isOpen && (
            <SimpleBar className="px-6 h-full">
              <button
                className="w-6 rounded-full shadow-lg"
                onClick={handleClose}
                aria-label="Fermer"
              >
                x
              </button>
              {id && <VoirProduit />}
            </SimpleBar>
          )}
        </div>
      </Transition>

      <Transition
        as={Fragment}
        show={isOpen}
        enter="transition-opacity ease-out duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity ease-in duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="overlay bg-black bg-opacity-50 fixed inset-0 z-[998]"></div>
      </Transition>
    </div>
  );
};

export default Voir_produit;

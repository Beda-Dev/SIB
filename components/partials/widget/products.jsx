import React from "react";

const Products = ({ products = [] }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      {products.map((item, index) => {
        const {
          product: { label, unit_price, images, description } = {},
          quantity,
        } = item;
        const imageUrl = images?.[0]?.url || "/placeholder.svg"; // Utilisation d'un placeholder par défaut
        const price = (unit_price || 0).toLocaleString("fr-FR", {
          style: "currency",
          currency: "XOF",
        });

        return (
          <>
            <div
              key={item.id || index}
              className="flex flex-col p-4 bg-gray-50 rounded-lg shadow-sm"
            >
              {/* Image du produit */}
              <div className="h-32 w-full relative bg-white p-2 rounded-lg mb-4">
                <img
                  src={imageUrl}
                  alt={`Image de ${label}`}
                  className="object-contain w-full h-full"
                />
              </div>
              {/* Détails du produit */}
              <div className="flex-1">
                <h3 className="text-lg font-medium mb-2">{label}</h3>
                <p className="text-gray-600 text-sm mb-2">
                  {description || "Description non disponible"}
                </p>
              </div>
              {/* Prix et quantité */}
              <div className="text-right">
                <div className="text-lg font-medium">{price}</div>
                <div className="text-gray-600 text-sm mt-1">
                  Quantité: {quantity}
                </div>
              </div>
            </div>
          </>
        );
      })}
    </div>
  );
};

export default Products;

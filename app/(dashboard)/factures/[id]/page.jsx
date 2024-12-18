"use server"

import React from "react";
import Detail_facture from "./client_facture_page.jsx";


async function fetchFactureDetails(id) {
  try {
    const invoiceResponse = await fetch(
      `https://sibeton-api.vercel.app/api/invoice/${id}`,
      { cache: "no-store" } // `no-store` empêche la mise en cache pour obtenir toujours les données les plus récentes
    );

    if (!invoiceResponse.ok) {
      throw new Error("Erreur lors de la récupération de la facture");
    }

    const invoiceData = await invoiceResponse.json();
    console.log( invoiceData)

    // Récupérer les produits associés si nécessaire
    const orderId = invoiceData.data?.orderId;
    let products = [];
    if (orderId) {
      const productResponse = await fetch(
        `https://sibeton-api.vercel.app/api/order/${orderId}`
      );
      if (productResponse.ok) {
        const productData = await productResponse.json();
        console.log(productData.data?.products)
        products = productData.data?.products || [];
      }
    }

    return {
      facture: invoiceData.data || {},
      products,
    };
  } catch (error) {
    console.error(error);
    throw new Error("Erreur lors de la récupération des données.");
  }
}


export default async function Page({ params }) {
  const { id } = params; 
  const { facture, products } = await fetchFactureDetails(id);

  console.log(`id pour la facture est ${id}`)

  return (
    <div>
      <Detail_facture facture={facture} products={products} />
    </div>
  );
}

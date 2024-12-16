import React from "react";

const TotalTable = ({ product = [] }) => {

  const totalHT = product.reduce((acc, item) => acc + (item.unit_price || 0), 0);
  const tva = totalHT * 0.035;
  const totalTTC = totalHT + tva;
  const acomptesRecus = totalTTC;

  return (
    <div>
      <table className="w-full border-collapse table-fixed dark:border-slate-700 dark:border">
        <thead>
          <tr>
            <th className="bg-slate-50 dark:bg-slate-700 dark:text-slate-300 text-xs font-medium uppercase text-slate-600 px-6 py-5">Produit</th>
            <th className="bg-slate-50 dark:bg-slate-700 dark:text-slate-300 text-xs font-medium uppercase text-slate-600 px-6 py-5">Prix unitaire</th>
            <th className="bg-slate-50 dark:bg-slate-700 dark:text-slate-300 text-xs font-medium uppercase text-slate-600 px-6 py-5">Quantité</th>
            <th className="bg-slate-50 dark:bg-slate-700 dark:text-slate-300 text-xs font-medium uppercase text-slate-600 px-6 py-5">Total</th>
          </tr>
        </thead>
        <tbody>
          {product.length > 0 ? (
            product.map((item, index) => (
              <tr key={item.id || index} className="border-b border-slate-100 dark:border-slate-700">
                <td className="px-6 py-4 text-slate-900 dark:text-slate-300 text-sm">{item.label}</td>
                <td className="px-6 py-4 text-slate-900 dark:text-slate-300 text-sm">{(item.unit_price || 0).toFixed(2)} FCFA</td>
                <td className="px-6 py-4 text-slate-900 dark:text-slate-300 text-sm">1</td>
                <td className="px-6 py-4 text-slate-900 dark:text-slate-300 text-sm">{(item.unit_price || 0).toFixed(2)} FCFA</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="px-6 py-4 text-center text-slate-500 dark:text-slate-300">Aucun produit disponible</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Résumé des totaux */}
      <div className="md:flex px-6 py-6 items-center">
        <div className="flex-none min-w-[270px] space-y-3">
          <div className="flex justify-between">
            <span className="font-medium text-slate-600 text-xs dark:text-slate-300 uppercase">Total HT :</span>
            <span className="text-slate-900 dark:text-slate-300">{totalHT.toFixed(2)} FCFA</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-slate-600 text-xs dark:text-slate-300 uppercase">TVA (3.5%) :</span>
            <span className="text-slate-900 dark:text-slate-300">{tva.toFixed(2)} FCFA</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-slate-600 text-xs dark:text-slate-300 uppercase">Total TTC :</span>
            <span className="text-slate-900 dark:text-slate-300">{totalTTC.toFixed(2)} FCFA</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-slate-600 text-xs dark:text-slate-300 uppercase">Acomptes reçus :</span>
            <span className="text-slate-900 dark:text-slate-300 font-bold">{acomptesRecus.toFixed(2)} FCFA</span>
          </div>

        </div>
      </div>
    </div>
  );
};

export default TotalTable;

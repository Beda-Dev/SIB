import React from "react";

const rows = [
  {
    item: "Headphone",
    qty: 2,
    price: 600.25,
  },
  {
    item: "Headphone",
    qty: 2,
    price: 600.25,
  },
  {
    item: "Headphone",
    qty: 2,
    price: 600.25,
  },
  {
    item: "Headphone",
    qty: 2,
    price: 600.25,
  },
];

const TotalTable = () => {
  // Calculs dynamiques
  const totalHT = rows.reduce((acc, row) => acc + row.qty * row.price, 0);
  const tva = totalHT * 0.035; // 3.5% de TVA
  const totalTTC = totalHT + tva;
  const acomptesRecus = 362.0; // Exemple d'acomptes reçus
  const resteAPayer = totalTTC - acomptesRecus;

  return (
    <div>
      <table className="w-full border-collapse table-fixed dark:border-slate-700 dark:border">
        <thead>
          <tr>
            <th
              colSpan={3}
              className="bg-slate-50 dark:bg-slate-700 dark:text-slate-300 text-xs font-medium leading-4 uppercase text-slate-600 ltr:text-left ltr:last:text-right rtl:text-right rtl:last:text-left"
            >
              <span className="block px-6 py-5 font-semibold">PRODUIT</span>
            </th>
            <th className="bg-slate-50 dark:bg-slate-700 dark:text-slate-300 text-xs font-medium leading-4 uppercase text-slate-600 ltr:text-left ltr:last:text-right rtl:text-right rtl:last:text-left">
              <span className="block px-6 py-5 font-semibold">QUANTITE</span>
            </th>
            <th className="bg-slate-50 dark:bg-slate-700 dark:text-slate-300 text-xs font-medium leading-4 uppercase text-slate-600 ltr:text-left ltr:last:text-right rtl:text-right rtl:last:text-left">
              <span className="block px-6 py-5 font-semibold">PRIX</span>
            </th>
            <th className="bg-slate-50 dark:bg-slate-700 dark:text-slate-300 text-xs font-medium leading-4 uppercase text-slate-600 ltr:text-left ltr:last:text-right rtl:text-right rtl:last:text-left">
              <span className="block px-6 py-5 font-semibold">TOTALE</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((data, index) => (
            <tr
              key={data.item + index}
              className="border-b border-slate-100 dark:border-slate-700"
            >
              <td
                colSpan={3}
                className="text-slate-900 dark:text-slate-300 text-sm font-normal ltr:text-left ltr:last:text-right rtl:text-right rtl:last:text-left px-6 py-4"
              >
                {data.item}
              </td>
              <td className="text-slate-900 dark:text-slate-300 text-sm font-normal ltr:text-left ltr:last:text-right rtl:text-right rtl:last:text-left px-6 py-4">
                {data.qty}
              </td>
              <td className="text-slate-900 dark:text-slate-300 text-sm font-normal ltr:text-left ltr:last:text-right rtl:text-right rtl:last:text-left px-6 py-4">
                {data.price.toFixed(2)} FCFA
              </td>
              <td className="text-slate-900 dark:text-slate-300 text-sm font-normal ltr:text-left ltr:last:text-right rtl:text-right rtl:last:text-left px-6 py-4">
                {(data.qty * data.price).toFixed(2)} FCFA
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="md:flex px-6 py-6 items-center">
        <div className="flex-1 text-slate-500 dark:text-slate-300 text-sm">
          <div className="flex-1 text-slate-500 dark:text-slate-300 text-sm">
            Votre paiement a été traité avec succès. Vous recevrez un e-mail de
            confirmation. Si vous ne recevez pas cet e-mail dans les prochaines
            minutes, veuillez vérifier votre dossier de courrier indésirable.
          </div>
          .
        </div>
        <div className="flex-none min-w-[270px] space-y-3">
          <div className="flex justify-between">
            <span className="font-medium text-slate-600 text-xs dark:text-slate-300 uppercase">
              total HT:
            </span>
            <span className="text-slate-900 dark:text-slate-300">
              {totalHT.toFixed(2)} FCFA
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-slate-600 text-xs dark:text-slate-300 uppercase">
              tva (3.5%):
            </span>
            <span className="text-slate-900 dark:text-slate-300">
              {tva.toFixed(2)} FCFA
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-slate-600 text-xs dark:text-slate-300 uppercase">
              total TTC:
            </span>
            <span className="text-slate-900 dark:text-slate-300">
              {totalTTC.toFixed(2)} FCFA
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-slate-600 text-xs dark:text-slate-300 uppercase">
              acomptes recu:
            </span>
            <span className="text-slate-900 dark:text-slate-300 font-bold">
              {acomptesRecus.toFixed(2)} FCFA
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-slate-600 text-xs dark:text-slate-300 uppercase">
              reste à payer:
            </span>
            <span className="text-slate-900 dark:text-slate-300 font-bold">
              {resteAPayer.toFixed(2)} FCFA
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TotalTable;

import React , {useEffect} from "react";
import Card from "@/components/ui/Card";
import Textinput from "@/components/ui/Textinput";
import Icon from "@/components/ui/Icon";
import Button from "@/components/ui/Button";
import { useForm, useFieldArray } from "react-hook-form";

const RepeaterProduct = ({ products , onTotalChange}) => {
  const { register, control, handleSubmit, watch } = useForm({
    defaultValues: {
      products: products.map((product) => ({
        name: product.label,
        price: product.unit_price,
        quantity: 1,
      })),
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "products",
  });

  const watchedFields = watch("products");
  const totalSum = watchedFields.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  useEffect(() => {
    if (onTotalChange) {
      onTotalChange(totalSum);
    }
  }, [totalSum, onTotalChange]);

  return (
    <div>
      <div className="bg-slate-50 dark:bg-slate-800 -mx-6 px-6 py-6">
        <div className="mb-6 text-slate-600 dark:text-slate-300 text-xs font-medium uppercase">
          Items info
        </div>

        <div>
          <form>
            {fields.map((item, index) => (
              <div
                className="lg:grid-cols-3 md:grid-cols-2 grid-cols-1 grid gap-5 mb-5 last:mb-0"
                key={item.id}
              >
                {/* Input Nom */}
                <Textinput
                  label="Nom"
                  type="text"
                  id={`name${index}`}
                  placeholder="Nom du produit"
                  register={register}
                  name={`products[${index}].name`}
                  defaultValue={item.name}
                />

                {/* Input Prix */}
                <Textinput
                  label="Prix"
                  type="number"
                  id={`price${index}`}
                  placeholder="Prix"
                  register={register}
                  name={`products[${index}].price`}
                  defaultValue={item.price}
                />

                {/* Input Quantité */}
                <div className="flex justify-between items-end space-x-5">
                  <div className="flex-1">
                    <Textinput
                      label="Quantité"
                      type="number"
                      id={`quantity${index}`}
                      placeholder="Quantité"
                      register={register}
                      name={`products[${index}].quantity`}
                      defaultValue={item.quantity}
                    />
                  </div>
                  {/* Bouton de suppression */}
                  {index > 0 && (
                    <div className="flex-none relative">
                      <button
                        onClick={() => remove(index)}
                        type="button"
                        className="inline-flex items-center justify-center h-10 w-10 bg-danger-500 text-lg border rounded border-danger-500 text-white"
                      >
                        <Icon icon="heroicons-outline:trash" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </form>
          {/* Bouton pour ajouter un nouveau produit */}
          <div className="mt-4">
            <Button
              text="Ajouter un produit"
              icon="heroicons-outline:plus"
              className="text-slate-600 p-0 dark:text-slate-300"
              onClick={() =>
                append({ name: "Nouveau produit", price: 0, quantity: 1 })
              }
            />
          </div>

          {/* Tableau récapitulatif */}
          <div className="mt-6">
            <h3 className="text-lg font-bold">Résumé des produits</h3>
            <table className="w-full mt-4 border border-slate-200">
              <thead>
                <tr>
                  <th className="border px-4 py-2">Nom</th>
                  <th className="border px-4 py-2">Prix</th>
                  <th className="border px-4 py-2">Quantité</th>
                  <th className="border px-4 py-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {watchedFields.map((field, idx) => (
                  <tr key={idx}>
                    <td className="border px-4 py-2">{field.name}</td>
                    <td className="border px-4 py-2">{field.price} FCFA</td>
                    <td className="border px-4 py-2">{field.quantity}</td>
                    <td className="border px-4 py-2">
                      {field.price * field.quantity} FCFA
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={3} className="border px-4 py-2 font-bold">
                    Total
                  </td>
                  <td className="border px-4 py-2 font-bold">
                    {totalSum} FCFA
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RepeaterProduct;

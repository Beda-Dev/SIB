import React from "react";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import { useDispatch } from "react-redux";
import { toggleEditModal } from "./store";
import Tooltip from "@/components/ui/Tooltip";
import classNames from "classnames";
import { traduction } from "@/constant/traduction";

const OrderCard = ({ order }) => {
  const { id, status, amount, user, products, createdAt } = order;

  const statusColors = {
    PENDING: "bg-orange-300 dark:bg-orange-500 bg-opacity-90",
    PROGRESS: "bg-yellow-300 dark:bg-yellow-500 bg-opacity-90",
    DONE: "bg-green-300 dark:bg-green-500 bg-opacity-90",
    CANCELED: "bg-red-300 dark:bg-red-500 bg-opacity-90",
    DEFAULT: "bg-gray-300 dark:bg-slate-600 bg-opacity-90",
  };

  const colorClass = statusColors[status] || statusColors.DEFAULT;
  const dispatch = useDispatch();

  return (
    <Card
      className={classNames(
        "rounded-xl transition-all",
        colorClass,
        "hover:bg-opacity-80 dark:bg-slate-800 dark:hover:bg-slate-700"
      )}
    >
      {/* header */}
      <header className="flex justify-between items-center mb-2">
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          <div className="rounded-md dark:bg-slate-600 flex items-center justify-center text-sm">
            {`CMD-${id}`}
          </div>
          <div className="text-base font-medium truncate max-w-[120px] dark:text-white">
            Statut : {traduction(status)}
          </div>
        </div>
        <Tooltip content="voir" placement="top" arrow animation="shift-away">
          <button
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-all"
            onClick={() => {
              if (order) {
                dispatch(toggleEditModal({ editModal: true, editOrder: order }));
              }
            }}
          >
            <Icon icon="mdi-light:eye" />
          </button>
        </Tooltip>
      </header>
      {/* content */}
      <div className="text-sm text-slate-600 dark:text-slate-400">
        <div className="mb-1">Montant : {amount.toLocaleString()} FCFA</div>
        <div className="truncate mb-1">
          Produits : {products.length > 0 ? products.map((p) => p.product.label).join(", ") : "Aucun produit"}
        </div>
        <div className="flex justify-between text-xs mt-2">
          <span>
            date de commande : {new Date(createdAt).toLocaleDateString("fr-FR")}
          </span>
        </div>
      </div>
      {/* user */}
      <div className="mt-2 text-sm">
        Client :{" "}
        <span className="font-medium">
          {user.firstName} {user.lastName}
        </span>
      </div>
    </Card>
  );
};

export default OrderCard;

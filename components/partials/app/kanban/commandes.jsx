import React from "react";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import { useDispatch } from "react-redux";
import { toggleEditModal } from "./store";
import Tooltip from "@/components/ui/Tooltip";
import classNames from "classnames";

const OrderCard = ({ order }) => {
  const { id, status, amount, user, products, createdAt, updatedAt } = order;

  const getColorClass = (status) => {
    switch (status) {
      case "En attente":
        return "bg-orange-300 dark:bg-orange-500 bg-opacity-90";
      case "En cours de traitement":
        return "bg-yellow-300 dark:bg-yellow-500 bg-opacity-90";
      case "Effectuée":
      case "Effectuer":
        return "bg-green-300 dark:bg-green-500 bg-opacity-90";
      case "Annulée":
      case "Annuler":
      case "Annulé":
        return "bg-red-300 dark:bg-red-500 bg-opacity-90";
      default:
        return "bg-gray-300 dark:bg-slate-600 bg-opacity-90";
    }
  };

  const colorClass = getColorClass(status);

  const dispatch = useDispatch();

  return (
    <Card
      className={classNames(
        " rounded-xl transition-all",
        colorClass,
        "hover:bg-opacity-80 dark:bg-slate-800 dark:hover:bg-slate-700"
      )}
    >
      {/* header */}
      <header className="flex justify-between items-center mb-2">
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          <div className=" rounded-md  dark:bg-slate-600 flex items-center justify-center text-sm">
            {`CMD-${id}`}
          </div>
          <div className="text-base font-medium truncate max-w-[120px] dark:text-white">
            Statut : {status}
          </div>
        </div>
        <Tooltip content="voir" placement="top" arrow animation="shift-away">
          <button
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-all"
            onClick={() => {
              dispatch(toggleEditModal({ editModal: true, editOrder: order }));
            }}
          >
            <Icon icon="mdi-light:eye" />
          </button>
        </Tooltip>
      </header>
      {/* content */}
      <div className="text-sm text-slate-600 dark:text-slate-400">
        <div className="mb-1">Montant : {amount} FCFA</div>
        <div className="truncate mb-1">
          Produits : {products.map((p) => p.name).join(", ")}
        </div>
        <div className="flex justify-between text-xs mt-2">
          <span>
            date de commande : {new Date(createdAt).toLocaleDateString()}
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

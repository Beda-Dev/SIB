import React, { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import { useDispatch } from "react-redux";
import { toggleEditModal } from "./store";

const OrderCard = ({ order }) => {
  const { id, status, amount, user, products, createdAt, updatedAt } = order;

  const dispatch = useDispatch();


  return (
    <Card className="cursor-move bg-white p-0">
      {/* header */}
      <header className="flex justify-between items-center mb-2">
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          <div className="h-8 w-8 rounded-md bg-slate-100 dark:bg-slate-600 flex items-center justify-center text-sm">
            {`CMD-${id}`}
          </div>
          <div className="text-base font-medium truncate max-w-[120px]">
            Statut : {status}
          </div>
        </div>
        <button
          className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          onClick={() =>
            dispatch(toggleEditModal({ editModal: true, order }))
          }
        >
          <Icon icon="heroicons-outline:pencil-alt" />
        </button>
      </header>
      {/* content */}
      <div className="text-sm text-slate-600 dark:text-slate-400">
        <div className="mb-1">Montant : {amount} FCFA</div>
        <div className="truncate mb-1">Produits : {products.map((p) => p.name).join(", ")}</div>
        <div className="flex justify-between text-xs mt-2">
          <span>date de commande  : {new Date(createdAt).toLocaleDateString()}</span>
        </div>
      </div>
      {/* user */}
      <div className="mt-2 text-sm">
        Client : <span className="font-medium">{user.firstName} {user.lastName}</span>
      </div>
    </Card>
  );
};

export default OrderCard;

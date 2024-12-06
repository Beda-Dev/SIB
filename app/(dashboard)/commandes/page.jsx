"use client";

import React from "react";
import Button from "@/components/ui/Button";
import Tooltip from "@/components/ui/Tooltip";
import Icon from "@/components/ui/Icon";

import { useSelector, useDispatch } from "react-redux";
import {
  toggleTaskModal,
} from "@/components/partials/app/kanban/store";
import OrderCard from "@/components/partials/app/kanban/commandes"; // Remplace "Task" par "OrderCard"
import AddColumn from "@/components/partials/app/kanban/AddColumn";
import AddTaskModal from "@/components/partials/app/kanban/AddTaskModal";
import { ToastContainer } from "react-toastify";
import EditTaskModal from "@/components/partials/app/kanban/EditTask";

const KanbanPage = () => {
  const { columns } = useSelector((state) => state.kanban); // Utilisation du store Redux si nécessaire
  const dispatch = useDispatch();

  // Remplace les données en dur par celles du store ou de l'API si nécessaire
  const comm = {
    columns: [
      {
        id: "1",
        name: "En attente",
        color: "#FFAA00",
        orders: [
          {
            id: 101,
            status: "completed",
            amount: 150.75,
            createdAt: "2024-01-01T12:00:00Z",
            user: { id: 1, name: "John Doe" },
            products: [
              { id: 201, name: "Product A" },
              { id: 202, name: "Product B" }
            ]
          },
        ]
      },
      {
        id: "2",
        name: "En cours de traitement",
        color: "yellow",
        orders: [
          {
            id: 102,
            status: "completed",
            amount: 230.50,
            createdAt: "2024-01-02T14:00:00Z",
            user: { id: 2, name: "Jane Smith" },
            products: [
              { id: 203, name: "Product C" }
            ]
          },
          {
            id: 102,
            status: "completed",
            amount: 230.50,
            createdAt: "2024-01-02T14:00:00Z",
            user: { id: 2, name: "Jane Smith" },
            products: [
              { id: 203, name: "Product C" }
            ]
          }
        ]
      },
      {
        id: "3",
        name: "commande effectuée",
        color: "#00FF00",
        orders: [
          {
            id: 102,
            status: "completed",
            amount: 230.50,
            createdAt: "2024-01-02T14:00:00Z",
            user: { id: 2, name: "Jane Smith" },
            products: [
              { id: 203, name: "Product C" }
            ]
          }
        ]
      },
      {
        id: "4",
        name: "commande Annuler",
        color: "red",
        orders: [
          {
            id: 102,
            status: "completed",
            amount: 230.50,
            createdAt: "2024-01-02T14:00:00Z",
            user: { id: 2, name: "Jane Smith" },
            products: [
              { id: 203, name: "Product C" }
            ]
          }
        ]
      }
    ]
  };

  return (
    <div>
      <ToastContainer />
      <div className="flex flex-wrap justify-between items-center mb-4">
        <h4 className="font-medium lg:text-2xl text-xl text-slate-900 inline-block ltr:pr-4 rtl:pl-4">
          Commandes
        </h4>
      </div>

      <div className="flex space-x-6 overflow-hidden overflow-x-auto pb-4 rtl:space-x-reverse">
        {comm.columns.map((column) => {
          return (
            <div key={column.id} className="w-auto flex-none">
              {/* Board Header */}
              <div className="relative flex justify-between items-center bg-white dark:bg-slate-800 rounded shadow-base px-6 py-5">
                <div
                  className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-[2px]"
                  style={{
                    backgroundColor: column.color,
                  }}
                ></div>
                <div className="text-lg text-slate-900 dark:text-white font-medium">
                  {column.name}
                </div>
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Tooltip placement="top" arrow theme="dark" content="Ajouter une commande">
                    <button
                      className="border border-slate-200 dark:border-slate-700 dark:text-slate-400 rounded h-6 w-6 flex flex-col items-center justify-center text-base text-slate-600"
                      onClick={() =>
                        dispatch(
                          toggleTaskModal({
                            open: true,
                            columnId: column.id,
                          })
                        )
                      }
                    >
                      <Icon icon="heroicons-outline:plus-sm" />
                    </button>
                  </Tooltip>
                </div>
              </div>

              {/* Commandes */}
              <div className="px-2 py-4 h-full space-y-4 bg-slate-200 dark:bg-slate-700 rounded">
                {column.orders?.map((order) => (
                  <div key={order.id}>
                    {/* Affiche chaque commande sous forme de carte */}
                    {order.status === "completed" ? (
                      <OrderCard order={order} />
                    ) : (
                      <div className="text-center text-slate-600">
                        Commande non finalisée
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <AddColumn />
      <AddTaskModal />
      <EditTaskModal />
    </div>
  );
};

export default KanbanPage;

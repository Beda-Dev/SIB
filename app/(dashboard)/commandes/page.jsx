"use client";

import React, { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import Tooltip from "@/components/ui/Tooltip";
import Icon from "@/components/ui/Icon";

import { useSelector, useDispatch } from "react-redux";
import OrderCard from "@/components/partials/app/kanban/commandes"; // Remplace "Task" par "OrderCard"
import { ToastContainer } from "react-toastify";
import EditTaskModal from "@/components/partials/app/kanban/EditTask";
import { getOrder } from "./api_commande";

const KanbanPage = () => {
  const dispatch = useDispatch();
  const [Loading, setLoading] = useState(false);
  const [commandes, setCommandes] = useState([]);
  const [enAttente, setEnAttente] = useState([]);
  const [enTraitement, setEnTraitement] = useState([]);
  const [effectuer, setEffectuer] = useState([]);
  const [annuler, setAnnuler] = useState([]);

  useEffect(() => {
    const obtentionCommande = async () => {
      try {
        const Data = await getOrder();
        setCommandes(Data.data?.data || []);
      } catch (error) {
        setError("Erreur lors du chargement des commandes.");
      } finally {
        setLoading(false);
      }
    };

    obtentionCommande();
  }, []);

  useEffect(() => {
    if (commandes.length > 0) {
      const attente = [];
      const traitement = [];
      const effectuees = [];
      const annulees = [];

      commandes.forEach((commande) => {
        switch (commande.status) {
          case "En attente":
            attente.push(commande);
            break;
          case "En cours de traitement":
            traitement.push(commande);
            break;
          case "Effectué":
            effectuees.push(commande);
            break;
          case "Annuler":
            annulees.push(commande);
            break;
          default:
            break;
        }
      });

      setEnAttente(attente);
      setEnTraitement(traitement);
      setEffectuer(effectuees);
      setAnnuler(annulees);
    }
  }, [commandes]);

  const comm = {
    columns: [
      {
        id: "1",
        name: "En attente",
        color: "#FFAA00",
        orders: enAttente || [],
      },
      {
        id: "2",
        name: "En cours de traitement",
        color: "yellow",
        orders: enTraitement || [],
      },
      {
        id: "3",
        name: "Commande(s) effectuée",
        color: "#00FF00",
        orders: effectuer || [],
      },
      {
        id: "4",
        name: "Commande(s) Annulée",
        color: "red",
        orders: annuler || [],
      },
    ],
  };

  return (
    <div>
      <div />
      <div className="flex flex-wrap justify-between items-center mb-4">
        <h4 className="font-medium lg:text-2xl text-xl text-slate-900 inline-block ltr:pr-4 rtl:pl-4">
          Commandes
        </h4>
      </div>

      <div className="flex space-x-6 overflow-hidden overflow-x-auto pb-4 rtl:space-x-reverse">
        {comm.columns.map((column) => {
          return (
            <div key={column.id} className="w-1/4 flex-none">
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
                  {/*<Tooltip
                    placement="top"
                    arrow
                    theme="dark"
                    content="Ajouter une commande"
                  >
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
                  */}
                </div>
              </div>

              {/* Commandes */}
              <div className="px-2 py-4 h-full space-y-4 bg-slate-200 dark:bg-slate-700 rounded">
                {column.orders?.map((order) => (
                  <div key={order.id} className="dark:bg-slate-700 ">
                    {order && <OrderCard order={order} />}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <EditTaskModal />
    </div>
  );
};

export default KanbanPage;

import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

export const appKanbanSlice = createSlice({
  name: "appKanban",
  initialState: {
    editModal: false,
    editOrder: {},

    columns: [
      {
        id: "1",
        name: "En attente",
        color: "#FFAA00",
        orders: [],
      },
      {
        id: "2",
        name: "En cours de traitement",
        color: "yellow",
        orders: [],
      },
      {
        id: "3",
        name: "Commande(s) effectuée",
        color: "#00FF00",
        orders: [],
      },
      {
        id: "4",
        name: "Commande(s) annulée",
        color: "red",
        orders: [],
      },
    ],
  },
  reducers: {
    // Activer/Désactiver le mode édition
    toggleEditModal: (state, action) => {
      const { order, editModal } = action.payload;
      state.editModal = editModal;
      state.editOrder = order;
    },

    // Mettre à jour une commande
    updateOrder: (state, action) => {
      const updatedOrder = action.payload;
      state.columns.forEach((column) => {
        const index = column.orders.findIndex((order) => order.id === updatedOrder.id);
        if (index !== -1) {
          column.orders[index] = updatedOrder;
        }
      });
      toast.info("Commande mise à jour avec succès", {
        position: "top-right",
        autoClose: 1500,
        theme: "dark",
      });
    },
  },
});

export const { toggleEditModal, updateOrder } = appKanbanSlice.actions;

export default appKanbanSlice.reducer;

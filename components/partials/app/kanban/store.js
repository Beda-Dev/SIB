import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import axios from "axios";

const initialState = {
  editModal: false,
  editOrder: null,
};

const kanbanSlice = createSlice({
  name: "kanban",
  initialState,
  reducers: {
    toggleEditModal: (state, action) => {
      state.editModal = action.payload.editModal;
      state.editOrder = action.payload.editOrder || null;
    },
    updateOrderSuccess: (state, action) => {
      const { id, status } = action.payload;
      if (state.editOrder?.id === id) {
        state.editOrder.status = status;
      }
    },
  },
});

export const { toggleEditModal, updateOrderSuccess } = kanbanSlice.actions;

export const updateOrder = (order) => async (dispatch) => {
  try {

    const response = await axios.put(`https://sibeton-api.vercel.app/api/order/${order.id}`, {
      status: order.status,
    });

    if (response.status === 200) {
      dispatch(updateOrderSuccess(order));
 
      toast.info("Commande mise à jour avec succès", {
        position: "top-right",
        autoClose: 1500,
        theme: "dark",
      });
      window.location.reload()
      
      
    }
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la commande :", error);
    toast.error("Erreur lors de la mise à jour de la commande", {
      position: "top-right",
      autoClose: 1500,
      theme: "dark",
    });
    
  }
};

export default kanbanSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import axios from "axios";

const initialState = {
  editModal: false,
  editOrder: null,
  invoiceId: null
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
    setInvoiceId: (state, action) => {
      state.invoiceId = action.payload;
    },

  },
});

export const { toggleEditModal, updateOrderSuccess , setInvoiceId } = kanbanSlice.actions;

export const updateOrder = (order) => async (dispatch) => {
  try {
    console.log("Début de la mise à jour de la commande avec l'ID :", order.id);


    const response = await axios.put(
      `https://sibeton-api.vercel.app/api/order/${order.id}`,
      {
        status: order.status,
      }
    );

    if (response.status === 200) {
      console.log("Commande mise à jour avec succès :", response.data);
      dispatch(updateOrderSuccess(order));

      toast.info("Commande mise à jour avec succès", {
        position: "top-right",
        autoClose: 1500,
        theme: "dark",
      });

      // Vérification : création de facture uniquement si la commande est "DONE"
      if (order.status.toUpperCase() === "DONE") {
        try { 
          console.log(
            "Début de la création de la facture pour la commande terminée :",
            order.id 
          );

          const invoiceResponse = await axios.post(
            `https://sibeton-api.vercel.app/api/invoice`,
            {
              status: order.status, 
              amount: response.data.data.amount, 
              userId: response.data.data.user.id, 
              orderId: order.id,
            }
          );

          if (invoiceResponse.status === 201) {
            console.log("Facture créée avec succès :", invoiceResponse.data.data.id);
            
            dispatch(setInvoiceId(invoiceResponse.data.data.id));

            toast.success("Facture créée avec succès", {
              position: "top-right",
              autoClose: 1500,
              theme: "dark",
            });
          }
        } catch (invoiceError) {
          console.error("Erreur lors de la création de la facture :", invoiceError);
          toast.error("Erreur lors de la création de la facture", {
            position: "top-right",
            autoClose: 1500,
            theme: "dark",
          });
        }
      } else{
        window.location.reload();
      }

      
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

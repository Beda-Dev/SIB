import React, { useEffect, useState } from "react";
import Select from "react-select";
import Modal from "@/components/ui/Modal";
import { useSelector, useDispatch } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { updateOrder, toggleEditModal } from "./store";
import Button from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import InvoiceAddPage from "@/app/(dashboard)/(utility)/invoice-add/page";
import Products from "@/components/partials/widget/products"
import { traduction } from "@/constant/traduction";

const statusOptions = [
  { value: "PENDING", label: "En attente" },
  { value: "PROGRESS", label: "En cours de traitement" },
  { value: "DONE", label: "Effectuée" },
  { value: "CANCELED", label: "Annulée" },
];

const getFilteredOptions = (currentStatus) => {
  const allowedStatuses = {
    PENDING: ["En cours de traitement", "Annulée"],
    PROGRESS: ["Effectuée", "Annulée"],
    DONE: [],
    CANCELED: [],
  };


  return statusOptions.filter((option) =>
    allowedStatuses[currentStatus.toUpperCase()]?.includes(option.label)
  );
};

const EditOrderModal = () => {
  const router = useRouter();
  const { editModal, editOrder } = useSelector((state) => state.kanban);
  const [create, setCreate] = useState(false);
  const [childUnmounted, setChildUnmounted] = useState(false);
  const dispatch = useDispatch();
  let filteredOptions = [];

  if (editOrder) {
    filteredOptions = getFilteredOptions(editOrder.status);
  } else {
    filteredOptions = [];
  }

  const FormValidationSchema = yup.object({
    tags: yup.object({
      value: yup.string().required("Le statut est requis"),
    }),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(FormValidationSchema),
  });

  const onSubmit = (data) => {
    console.log(
      `ID de la commande à modifier : ${editOrder.id}, statut actuel : ${editOrder.status}, nouveau statut : ${data.tags.value}`
    );

    dispatch(
      updateOrder({
        id: editOrder?.id,
        status: data.tags.value,
      })
    );
    dispatch(toggleEditModal({ editModal: false }));

    if(data.tags.value === "DONE"){

    setTimeout(() => {
      try {
        const invoiceId = JSON.parse(sessionStorage.getItem("invoiceId"));
        if (invoiceId) {
          router.push(`/factures/${invoiceId}`);
        } else {
          console.error("Aucune facture associée trouvée.");
        }
      } catch (error) {
        console.error("Erreur lors de l'accès à l'ID de facture :", error);
      }
    }, 1000);

  }
  };

  const handleChildUnmount = (isUnmounted) => {
    setChildUnmounted(isUnmounted);
    setCreate(false);
    console.log("Le composant enfant a été démonté : ", isUnmounted);

    setTimeout(() => {
      setChildUnmounted(false);
    }, 1000);
  };

  useEffect(() => {
    if (childUnmounted) {
      dispatch(toggleEditModal({ editModal: false }));
    }
  }, [childUnmounted]);

  if (!editOrder) return null;

  return (
    <Modal
      className="w-[66%]"
      title="Commande"
      activeModal={editModal}
      onClose={() => {
        setCreate(false);
        dispatch(toggleEditModal({ editModal: false }));
      }}
    >
      {create ? (
        <InvoiceAddPage order={editOrder} onUnmount={handleChildUnmount} />
      ) : (
        <div>
          <div className="max-w-full mx-auto p-6 bg-white rounded-xl">
            <div className="flex justify-between items-start mb-8">
              <div>
              <div className="flex items-center gap-8">
                  <div className="text-gray-600 mb-4">
                    Date de commande :
                    <span className="text-gray-900 ">
                      {" "}
                      {new Date(editOrder?.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center text-green-600 mb-4">
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    dernière mise à jour{" "}
                    {new Date(editOrder?.updatedAt).toLocaleDateString()}
                  </div>
                </div>
                <div>
                  Client : {editOrder?.user.firstName}{" "}
                  {editOrder?.user.lastName}
                </div>
                <div className="my-2">
                  Statut : {traduction(editOrder?.status)}
                </div>
                <div>
                <h1 className="mb-3 text-sm">Produits</h1>
                <Products products={editOrder?.products}/>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className={errors.tags ? "has-error" : ""}>
                <label className="form-label" htmlFor="status">
                  Modifier le statut de la commande
                </label>
                <Controller
                  name="tags"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={filteredOptions}
                      className=""
                      classNamePrefix="select"
                      getOptionLabel={(e) => e.label} // Affiche les labels (français)
                      getOptionValue={(e) => e.value} // Envoie les valeurs (anglais)
                    />
                  )}
                />
                {errors.tags && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.tags.value.message}
                  </p>
                )}
              </div>

              <div className="text-right">
                <button type="submit" className="btn p-2 btn-success">
                  Mettre à jour
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default EditOrderModal;

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

const statusOptions = [
  { value: "En attente", label: "En attente" },
  { value: "En cours de traitement", label: "En cours de traitement" },
  { value: "Effectuée", label: "Effectuée" },
  { value: "Annulée", label: "Annulée" },
];

const getFilteredOptions = (currentStatus) => {
  const allowedStatuses = {
    "En attente": ["En cours de traitement", "Annulée"],
    "En cours de traitement": ["Effectuée", "Annulée"],
    Effectuée: [],
    Annulée: [],
  };
  return statusOptions.filter((option) =>
    allowedStatuses[currentStatus]?.includes(option.value)
  );
};


const ProductCard = ({ product }) => (
  <div className="flex items-start gap-4 p-2 bg-gray-50 rounded-lg">
    <div className="w-24 h-24 relative bg-white p-2 rounded-lg">
      <img
        src={product.images[0].url}
        alt={product.label}
        width={80}
        height={80}
        className="object-contain"
      />
    </div>
    <div className="flex-1">
      <h3 className="text-sm font-medium">{product.label}</h3>
      <p className="text-gray-600 text-sm">{product.description}</p>
    </div>
    <div className="text-right">
      <div className=" text-sm font-medium">
        Prix unitaire : {product.unit_price} FCFA
      </div>
      <div className="text-gray-600 text-sm">
        Quantité: {product.quantity || 1}
      </div>
    </div>
  </div>
);

const EditOrderModal = () => {
  const router = useRouter();
  const { editModal, editOrder } = useSelector((state) => state.kanban);
  const [create, setCreate] = useState(false);
  const [childUnmounted, setChildUnmounted] = useState(false);
  const dispatch = useDispatch();
  let filteredOptions = [];

  if (editOrder) {
    console.log(editOrder)
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
      `id de la commande à modifier ${editOrder.id}, statuts ${editOrder.status}, nouveaux statut : ${data.tags.value}`
    );
    dispatch(
      updateOrder({
        id: editOrder?.id,
        status: data.tags.value,
      })
    );
    dispatch(toggleEditModal({ editModal: false }));

  };

  const handleChildUnmount = (isUnmounted) => {
    setChildUnmounted(isUnmounted);
    setCreate(false)
    console.log("Le composant enfant a été démonté : ", isUnmounted);

    setTimeout(() => {
      setChildUnmounted(false)
    },1000);
  };

  useEffect(()=>{
    if(childUnmounted){

      dispatch(toggleEditModal({ editModal: false }));
    }

  },[childUnmounted])

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
      {" "}
      {create ? (
        <InvoiceAddPage order={editOrder} onUnmount={handleChildUnmount}/>
      ) : (
        <div>
          <div className="max-w-full mx-auto p-6 bg-white rounded-xl">
            {/* Header */}
            <div className="flex justify-between items-start mb-8">
              <div>
                <h1 className="text-2xl font-semibold mb-4">
                  Commande N°{editOrder?.id}
                </h1>
                <div className="flex items-center gap-8">
                  <div className="text-gray-600 mb-4">
                    date de commande :
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
                <div className="my-2">Status : {editOrder?.status}</div>
              </div>
              <div className="flex gap-3">
                {(editOrder.status === "Effectuée" ||
                  editOrder.status === "Effectuer") && (
                  <div className="flex flex-col gap-2  text-sm ">
                    <Button
                      onClick={() => {
                        router.push(`/factures`);
                      }}
                      className=" btn btn-info  py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
                    >
                      voir la factures
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </Button>
                    {/*
                   
                    <Button
                      onClick={() => setCreate(true)}
                      className=" btn btn-info py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
                    >
                      Enregister une facture
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </Button>
                     */}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6 mb-8">
              <h1 className="text-lg font-medium">Produits</h1>
              {editOrder.products.map((product, index) => (
                <ProductCard key={index} product={product} />
              ))}
            </div>

            <div className="grid gap-8">
              <h2 className="text-lg rounded font-semibold mb-2">
                Montant: {editOrder.amount} F CFA
              </h2>
            </div>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className={`space-y-4 w-full h-56`}
          >
            {}
            <div className={errors.tags ? "has-error" : ""}>
              <label className="form-label" htmlFor="status">
                Modifier statut de la commande
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
      )}
    </Modal>
  );
};

export default EditOrderModal;

"use client";
import React, { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Textinput from "@/components/ui/Textinput";
import Textarea from "@/components/ui/Textarea";
import RepeaterProduct from "@/components/partials/froms/productInput";
import Flatpickr from "react-flatpickr";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";

const SupplierInfo = () => (
  <div className="grid lg:grid-cols-2 grid-cols-1 gap-5">
    <h4 className="lg:col-span-2 text-slate-900 dark:text-slate-300 text-lg">
      Information sur le fournisseur
    </h4>
    <Flatpickr
      className="form-control text-center"
      placeholder="Date d'émission"
      options={{ locale: "fr" }}
    />
    <Textinput label="Nom" type="text" placeholder="Ajouter votre nom" />
    <Textinput
      label="Téléphone"
      type="text"
      placeholder="Ajouter votre numéro de téléphone"
    />
    <Textinput label="Email" type="email" placeholder="Ajouter votre email" />
    <Textarea label="Adresse" placeholder="Adresse complète" rows="2" />
  </div>
);

const CustomerInfo = ({ user }) => (
  <div className="grid lg:grid-cols-2 grid-cols-1 gap-5 mt-3">
    <h4 className="lg:col-span-2 text-slate-900 dark:text-slate-300 text-lg">
      Information sur le client
    </h4>
    <Textinput
      label="Nom"
      type="text"
      value={user?.firstName || ""}
      disabled={true}
      defaultValue={user?.firstName || ""}
    />
    <Textinput
      label="Contact"
      type="text"
      value={user?.phone || ""}
      defaultValue={user?.phone || ""}
    />
    <Textinput
      label="Email"
      type="email"
      value={user?.email || ""}
      defaultValue={user?.email || ""}
      disabled={true}
    />
    <Textarea label="Adresse" value="Abidjan" rows="2" />
  </div>
);

const InvoiceAddPage = ({ order, onUnmount }) => {
  const [picker, setPicker] = useState(new Date());
  const [total, setTotal] = useState(0);
  const router = useRouter();

  const handleTotalChange = (newTotal) => {
    setTotal(newTotal);
    console.log(newTotal);
  };


  const handleSave = async () => {
    console.log("Debut");
    try {
      const payload = {
        status: order.status,
        amount: total,
        userId: order.user.id,
        orderId: order.id,
      };

      await axios.post("https://sibeton-api.vercel.app/api/invoice", payload);
      router.push("/factures")
      onUnmount(true);
      toast.success("Facture enregistrée avec succès !");
    } catch (error) {
      toast.error("Une erreur est survenue lors de l'enregistrement.");
      console.error(error);
    }
  };

  if (!order) return <div>Chargement...</div>;

  return (
    <div>
      <Card
        title="Enregistrer une nouvelle facture "
        className="custom-class  bg-white gap-4"
      >
        <SupplierInfo />
        <CustomerInfo user={order.user} />
        <RepeaterProduct
          products={order.product}
          onTotalChange={handleTotalChange}
        />
        <Textinput label="Montant payé" type="number" className="my-2" />
        <div className="text-right space-x-3">
          <Button
            text="Enregistrer"
            className="btn-dark"
            onClick={handleSave}
          />
          <Button
            text="Retour"
            className="btn-danger"
            onClick={() => {
              onUnmount(true)
            }}
          />
        </div>
      </Card>
    </div>
  );
};

export default InvoiceAddPage;

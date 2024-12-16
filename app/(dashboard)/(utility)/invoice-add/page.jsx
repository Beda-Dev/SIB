"use client";
import React, { useState , useEffect} from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Textinput from "@/components/ui/Textinput";
import Textarea from "@/components/ui/Textarea";
import RepeaterProduct from "@/components/partials/froms/productInput";
import Flatpickr from "react-flatpickr";
import { Select } from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";

const SupplierInfo = () => (
  <div className="grid lg:grid-cols-2 grid-cols-1 gap-5">
    <h4 className="lg:col-span-2 text-slate-900 dark:text-slate-300 font-medium">
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
  <div className="grid lg:grid-cols-2 grid-cols-1 gap-5">
    <h4 className="lg:col-span-2 text-slate-900 dark:text-slate-300 font-medium">
      Information sur le client
    </h4>
    <Textinput
      label="Nom"
      type="text"
      value={user?.firstName || ""}
      disabled={true}
      defaultValue={user?.firstName || ""}
    />
    <Textinput label="Contact" type="text" value={user?.phone || ""} defaultValue={user?.phone || ""}/>
    <Textinput
      label="Email"
      type="email"
      value={user?.email || ""}
      defaultValue={user?.email || ""}
      disabled={true}
    />
    <Textarea label="Adresse" value="Abidjan" disabled={true} rows="2" />
  </div>
);

const InvoiceAddPage = ({ order }) => {
  const [picker, setPicker] = useState(new Date());
  const [paymentMode, setPaymentMode] = useState("");
  const [total, setTotal] = useState(0);

  const handleTotalChange = (newTotal) => {
    setTotal(newTotal);
    console.log(newTotal)
  };

  const handleSave = async () => {
    try {
      const payload = {  
        status: order.status,
        amount: total,
        userId: order.user.id,
        orderId: order.id,
      };

      await axios.post("https://sibeton-api.vercel.app/api/invoice", payload);

      toast.success("Facture enregistrée avec succès !");
    } catch (error) {
      toast.error("Une erreur est survenue lors de l'enregistrement.");
      console.error(error);
    }
  };





  const products = [
    {
      id: 9,
      label: "Fond de regard circulaire en béton",
      unit_price: 80000,
      description: "Conforme aux normes EN 1916 NFP 16-346-2",
      categoryId: 2,
      category_label: "Béton préfabriqué",
      images: [
        {
          id: 39,
          url: "https://oifoeivdflxzgtj0.public.blob.vercel-storage.com/court-fond1-hI2CJxgCP5meNs61pYsB1ZLTaCBYqW.jpg",
        },
        {
          id: 40,
          url: "https://oifoeivdflxzgtj0.public.blob.vercel-storage.com/court-fond2-imj4c6uQAEEGlUTcSX2bx8BlCeWztu.jpg",
        },
        {
          id: 41,
          url: "https://oifoeivdflxzgtj0.public.blob.vercel-storage.com/court-fond-removebg-preview-U63aLQmIni0DHhgBeDw7Ms0rJQscmF.png",
        },
      ],
    },
    {
      id: 2,
      label: "Fossé rectangulaire",
      unit_price: 101000,
      description: "Conforme aux normes EN 1916 NFP 16-346-2",
      categoryId: 2,
      category_label: "Béton préfabriqué",
      images: [
        {
          id: 42,
          url: "https://oifoeivdflxzgtj0.public.blob.vercel-storage.com/fosse-rectangle1-100x100-GRnWvfF2TDWwZ901EAcPhhQzr3d9Qh.jpg",
        },
        {
          id: 43,
          url: "https://oifoeivdflxzgtj0.public.blob.vercel-storage.com/fosse-rectangle2-100x100-UJbvG0KgfvuQsL3bF0DahYY9n3hZh7.jpg",
        },
        {
          id: 44,
          url: "https://oifoeivdflxzgtj0.public.blob.vercel-storage.com/fosse-rectangle3-Sx7mOLe6QW4tKrfN4CaTtbosRed5Ib.jpg",
        },
        {
          id: 45,
          url: "https://oifoeivdflxzgtj0.public.blob.vercel-storage.com/fosse-rectangle-removebg-preview%20(1)-L6JUvKFoObLJBnWHXFVVMRzWx0kwjm.png",
        },
      ],
    },
  ];
  if (!order) return <div>Chargement...</div>;

  return (
    <div>
      <Card title="Enregistrer une nouvelle facture">
        <SupplierInfo />
        <CustomerInfo user={order.user} />
        <select
        className="w-full py-4 border my-3 rounded-lg bg-slate"
          value={paymentMode}
          placeholder="Mode d paiement"
          onChange={(e) => setPaymentMode(e.target.value)}
        >
          <option value="En une seule fois">En une seule fois</option>
          <option value="Échelonné">Échelonné</option>
        </select>
        <RepeaterProduct products={products} onTotalChange={handleTotalChange} />
        <Textinput label="Montant payé" type="number" className="my-2" />
        <div className="text-right space-x-3">
          <Button text="Enregistrer" className="btn-dark"  onClick={handleSave}  />
          <Button text="Retour" className="btn-danger" />
        </div>
      </Card>
    </div>
  );
};

export default InvoiceAddPage;

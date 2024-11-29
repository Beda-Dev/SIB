"use client";
import React, { useState , useEffect } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Textinput from "@/components/ui/Textinput";
import Textarea from "@/components/ui/Textarea";
import Select from "@/components/ui/Select";
import Imageinput from "@/components/ui/ImageInput";
import {Recherche } from "../categorieProduit/rechercheCategorie"


const Produits = () => {
  const [arraydata , SetArraydata] = useState([])
  const [isLoading, setIsLoading] = useState(true);

  useEffect(()=>{
    const getData =async()=>{
      setIsLoading(true);
      const Data = await Recherche();
      if(Data){
        const Arraylabel = Data['data']['data'].map(item => item.label);
        console.log(Arraylabel);
        SetArraydata(Arraylabel)
       
      }
      setIsLoading(false);
    }

    getData()



  },[])


  return (
    <div>
      <Card title="Ajouter un nouveau produit">
        <div className="grid lg:grid-cols-2 grid-cols-1 gap-5">
          <div className="grid lg:grid-cols-2 grid-cols-1 gap-5">
            <Textinput label="Libellé" type="text" placeholder="Libellé" />
            <Textinput
              label="Prix"
              type="number"
              placeholder="Prix du produit"
            />
            <Select
              options={arraydata}
              label="categorie du produit"
              className="w-full"
            />
            <div className="lg:col-span-2 col-span-1">
              <Textarea
                label="Description"
                type="text"
                placeholder="Description du produit"
                rows="2"
              />
            </div>
          </div>
          <div className="grid  gap-4">

            <div className="w-full col-span-2">
              <Imageinput />
            </div>
          </div>
        </div>
        <div className="ltr:text-right rtl:text-left space-x-3 rtl:space-x-reverse">
          <Button text="Ajouter" className="btn-warning bg-orange-500 " />
        </div>
      </Card>
    </div>
  );
};

export default Produits;

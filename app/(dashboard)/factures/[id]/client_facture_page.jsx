"use client";

import React, { useEffect, useRef, useState } from "react";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import TotalTable from "@/components/partials/table/TotalTable";
import userDarkMode from "@/hooks/useDarkMode";
import axios from "axios";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import PrintPdf from "./imprimer_pdf";
import { toBase64 } from "./convertionBase64";
import { toast } from "react-toastify";
import { useSelector , useDispatch } from "react-redux";
import { setInvoiceId } from '@/components/partials/app/kanban/store';

const Detail_facture = ({ facture, products }) => {
  const [fileName, setFileName] = useState("document.pdf");
  const pdfRef = useRef(null);
  const [isDark] = userDarkMode();
  const invoiceId = useSelector((state) => state.kanban.invoiceId);
  const dispatch = useDispatch();
  const reset = 0

  useEffect(() => {
    console.log(`invoiceId ${invoiceId} facture.id ${facture.id}`);
    if (Number(invoiceId) === Number(facture.id)) {
      console.log("milieu");
      handlePdfAction("send");
      dispatch(setInvoiceId(reset))
    }
    console.log("fin");
  }, []);

  const sendPdfToApi = async (fichier_base64) => {
    if (facture) {
      const toastId = toast.loading("Envoi de la facture en cours...", {
        position: "top-right",
        theme: "dark",
      });

      try {
        await axios.post("/api/send_email", {
          to: facture.user.email,
          subject: "Facture paiement S.I.Béton",
          html: `<p>Facture N°${facture.id}</p>`,
          file: fichier_base64,
          filename: fileName,
        });

        toast.update(toastId, {
          render: `Facture N°${facture.id} envoyée avec succès à ${facture.user.email}`,
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });
      } catch (error) {
        console.log(error)
        toast.update(toastId, {
          render: "Une erreur est survenue lors de l'envoi de l'email",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
      }
    }
  };

  const handlePdfAction = async (action) => {
    if (pdfRef.current) {
      const canvas = await html2canvas(pdfRef.current, {
        scale: 1.5,
        useCORS: true,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("portrait", "mm", "a4", true);
      const pageWidth = 210;
      const pageHeight = 297;
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      if (imgHeight <= pageHeight) {
        pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      } else {
        let position = 0;
        while (position < imgHeight) {
          pdf.addImage(imgData, "PNG", 0, -position, imgWidth, imgHeight);
          position += pageHeight;
          if (position < imgHeight) pdf.addPage();
        }
      }
      setFileName(`Facture N°${facture.id}` || fileName);

      if (action === "download") {
        pdf.save(fileName);
      } else if (action === "send") {
        const pdfBlob = pdf.output("blob");
        const fichier_base64 = await toBase64(pdfBlob);
        await sendPdfToApi(fichier_base64);
      } else if (action === "print") {
        const pdfBlob_toPrint = pdf.output("blob");
        PrintPdf({ pdfBlob_toPrint });
      }
    }
  };

  return (
    <div>
      <div className="lg:flex justify-between flex-wrap items-center mb-6">
        <h4 className="print:hidden text-sm">Facture N°{facture.id}</h4>
        <div className="flex lg:justify-end items-center flex-wrap space-xy-5 print:hidden">
          <button
            type="button"
            onClick={() => handlePdfAction("print")}
            className="invocie-btn inline-flex btn btn-sm whitespace-nowrap space-x-1 cursor-pointer bg-white dark:bg-slate-800 dark:text-slate-300 btn-md h-min text-sm font-normal text-slate-900 rtl:space-x-reverse"
          >
            <span className="text-lg">
              <Icon icon="heroicons:printer" />
            </span>
            <span>Imprimer</span>
          </button>
          <button
            type="button"
            onClick={() => handlePdfAction("download")}
            className="invocie-btn inline-flex btn btn-sm whitespace-nowrap space-x-1 cursor-pointer bg-white dark:bg-slate-800 dark:text-slate-300 btn-md h-min text-sm font-normal text-slate-900 rtl:space-x-reverse"
          >
            <span className="text-lg">
              <Icon icon="heroicons:arrow-down-tray" />
            </span>
            <span>Télécharger</span>
          </button>
          <button
            type="button"
            onClick={() => handlePdfAction("send")}
            className="invocie-btn inline-flex btn btn-sm whitespace-nowrap space-x-1 cursor-pointer bg-white dark:bg-slate-800 dark:text-slate-300 btn-md h-min text-sm font-normal text-slate-900 rtl:space-x-reverse"
          >
            <span className="text-lg transform -rotate-45">
              <Icon icon="heroicons:paper-airplane" />
            </span>
            <span>Envoyer la facture</span>
          </button>
        </div>
      </div>
      <Card bodyClass="p-0 print:block print:w-full">
        <div ref={pdfRef}>
          <div className="flex justify-between flex-wrap space-y-4 px-6 pt-6 bg-slate-50 dark:bg-slate-800 pb-6 rounded-t-md ">
            <div>
              <img
                src={
                  isDark
                    ? "/assets/images/logo/logoBeton.png"
                    : "/assets/images/logo/logoBeton.png"
                }
                alt=""
              />

              <div className="text-slate-500 dark:text-slate-300 font-normal leading-5 mt-4 text-sm ">
                S.I.beton <br />
                Yopougon-Attécoubé, <br />
                Abidjan
                <div className="flex space-x-2 mt-2 leading-[1] rtl:space-x-reverse">
                  <Icon icon="heroicons-outline:phone" />
                  <span>(+225) 07 57 20 20 20</span>
                </div>
                <div className="mt-[6px] flex space-x-2 leading-[1] rtl:space-x-reverse">
                  <Icon icon="heroicons-outline:mail" />
                  <span>sibetons@sibetons.com</span>
                </div>
              </div>
            </div>
            <div>
              <span className="block text-slate-900 dark:text-slate-300 font-medium leading-5 text-xl">
                facturer à:
              </span>

              <div className="text-slate-500 dark:text-slate-300 font-normal leading-5 mt-4 text-sm">
                {facture.user?.firstName}
                <br />
                {facture.user?.lastName}
                <br />
                Abidjan
                <div className="flex space-x-2 mt-2 leading-[1] rtl:space-x-reverse">
                  <Icon icon="heroicons-outline:phone" />
                  <span>(+225) {facture.user?.phone}</span>
                </div>
                <div className="mt-[6px] flex space-x-2 leading-[1] rtl:space-x-reverse">
                  <Icon icon="heroicons-outline:mail" />
                  <span>{facture.user?.email}</span>
                </div>
              </div>
            </div>
            <div className="space-y-[2px]">
              <span className="block text-slate-900 dark:text-slate-300 font-medium leading-5 text-xl mb-4">
                Facture:
              </span>
              <h4 className="text-slate-600 font-medium dark:text-slate-300 text-xs uppercase">
                Numero de facture:
              </h4>
              <div className="text-slate-500 dark:text-slate-300 font-normal leading-5 text-sm">
                #{facture?.id}
              </div>
              <h4 className="text-slate-600 font-medium dark:text-slate-300 text-xs uppercase">
                date
              </h4>
              <div className="text-slate-500 dark:text-slate-300 font-normal leading-5 text-sm">
                {new Date(facture?.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
          <div className="max-w-[980px] mx-auto shadow-base dark:shadow-none my-8 rounded-md overflow-x-auto">
            <TotalTable product={products} />
          </div>
          <div className="py-10 text-center md:text-2xl text-xl font-normal text-slate-600 dark:text-slate-300">
            Merci pour votre achat !
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Detail_facture;

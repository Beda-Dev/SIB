"use client";
import React, { useEffect, useState, useRef } from "react";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import TotalTable from "@/components/partials/table/TotalTable";
import userDarkMode from "@/hooks/useDarkMode";
import { GetInvoiceById } from "../api_facture";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import PrintPdf from "./imprimer_pdf";
import { toBase64 } from "./convertionBase64";
import { toast } from "react-toastify";

const Detail_facture = ({ params }) => {
  const { id } = params;
  const [facture, SetFacture] = useState([]);
  const [Loading, setLoading] = useState(false);
  const [fileName, Setfilename] = useState("document.pdf");
  const pdfRef = useRef(null);
  const [isDark] = userDarkMode();

  useEffect(() => {
    setLoading(true);
    const obtentionFactureParID = async () => {
      try {
        const Data = await GetInvoiceById(id);
        SetFacture(Data.data?.data || []);
      } catch (error) {
        console.log("Erreur lors du chargement des factures.");
      } finally {
        setLoading(false);
      }
    };

    obtentionFactureParID();
  }, []);

  // Fonction pour envoyer le PDF à l'API
  const sendPdfToApi = async (fichier_base64) => {
    if (facture) {
      try {
        const response = await fetch("/api/send_email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: facture.user.email,
            subject: "Facture paiement S.I.Béton",
            html: `<p>Facture N°${facture.id}</p>`,
            file: fichier_base64,
            filename: "facture.pdf",
          }),
        });

        const data = await response.json();
        if (response.ok) {
          toast.success(`Facture N°${facture.id} envoyer avec success au  ${facture.user.email}`, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
        } else {
          toast.info(`Erreur: ${data.message}`, {
            position: "top-right",
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });

        }
      } catch (error) {
        toast.error("Une erreur est survenue lors de l'envoi de l'email", {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        console.error(`Erreur lors de l'envoi : ${error} `);
      }
    } else {
      console.log("aucune facture trouvee");
    }
  };

  // Fonction pour gérer les actions sur le PDF
  const handlePdfAction = async (action) => {
    if (pdfRef.current) {
      const canvas = await html2canvas(pdfRef.current, {
        scale: 2,
        useCORS: true,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("portrait", "mm", "a4");
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
      Setfilename(`Facture N°${facture.id}` || fileName)

      if (action === "download") {
        pdf.save(fileName);
      } else if (action === "send") {
        const pdfBlob = pdf.output("blob");
        console.log("le fichier bolb :" + pdfBlob);
        const fichier_base64 = await toBase64(pdfBlob);
        if (fichier_base64) {
          console.log("ENVOIE DU pdf");
          await sendPdfToApi(fichier_base64);
        } else {
          console.log("Erreur de conversion du  fichier_base64");
        }
      } else if (action === "print") {
        const pdfBlob_toPrint = pdf.output("blob");
        PrintPdf({ pdfBlob_toPrint });
      }
    }
  };

  if (!facture && Loading) {
    return <div className="text-center">Veuillez patienter...</div>;
  }

  if (!facture && !Loading) {
    return <div className="text-center">Aucune donnée disponible</div>;
  }

  return (
    <div>
      <div className="lg:flex justify-between flex-wrap items-center mb-6">
        <h4 className="print:hidden">Facture N°{facture.id}</h4>
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
            <TotalTable />
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

"use client";
import React from "react";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import Link from "next/link";

const settings = () => {
  return (
    <div>
      <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6">
        <Card>
          <div className="space-y-6">
            <div className="flex space-x-3 items-center rtl:space-x-reverse">
              <div className="flex-none h-8 w-8 rounded-full bg-slate-800 dark:bg-slate-700 text-slate-300 flex flex-col items-center justify-center text-lg">
                <Icon icon="heroicons:building-office-2" />
              </div>
              <div className="flex-1 text-base text-slate-900 dark:text-white font-medium">
                Paramètres de l’entreprise
              </div>
            </div>
            <div className="text-slate-600 dark:text-slate-300 text-sm">
              Configurez le profil de votre entreprise, ajoutez le logo de votre
              entreprise, etc.
            </div>
            <Link
              href="#"
              className="inline-flex items-center space-x-3 rtl:space-x-reverse text-sm  font-medium text-slate-600 dark:text-slate-300"
            >
              <span>Modifier les paramètres</span>{" "}
              <Icon icon="heroicons:arrow-right" />
            </Link>
          </div>
        </Card>
        <Card>
          <div className="space-y-6">
            <div className="flex space-x-3 items-center rtl:space-x-reverse">
              <div className="flex-none h-8 w-8 rounded-full bg-primary-500 text-slate-300 flex flex-col items-center justify-center text-lg">
                <Icon icon="heroicons:credit-card" />
              </div>
              <div className="flex-1 text-base text-slate-900 dark:text-white font-medium">
                Paramètres de paiement
              </div>
            </div>
            <div className="text-slate-600 dark:text-slate-300 text-sm">
              Associez votre compte bancaire au profil de votre entreprise, et
              plus encore
            </div>
            <Link
              href="#"
              className="inline-flex items-center space-x-3 rtl:space-x-reverse text-sm font-medium text-slate-600 dark:text-slate-300"
            >
              <span>Modifier les paramètres</span>{" "}
              <Icon icon="heroicons:arrow-right" />
            </Link>
          </div>
        </Card>
        <Card>
          <div className="space-y-6">
            <div className="flex space-x-3 rtl:space-x-reverse items-center">
              <div className="flex-none h-8 w-8 rounded-full bg-success-500 text-white flex flex-col items-center justify-center text-lg">
                <Icon icon="heroicons:users" />
              </div>
              <div className="flex-1 text-base text-slate-900 dark:text-white font-medium">
                Paramètres du profil
              </div>
            </div>
            <div className="text-slate-600 dark:text-slate-300 text-sm">
              Configurez votre profil
            </div>
            <Link
              href="#"
              className="inline-flex items-center space-x-3 rtl:space-x-reverse text-sm font-medium text-slate-600 dark:text-slate-300"
            >
              <span>Modifier les paramètres</span>{" "}
              <Icon icon="heroicons:arrow-right" />
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default settings;

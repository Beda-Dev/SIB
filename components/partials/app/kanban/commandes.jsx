import React, { useEffect, useState } from "react";
import Dropdown from "@/components/ui/Dropdown";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
// import menu from headless ui
import { Menu } from "@headlessui/react";
import { useDispatch } from "react-redux";
import { deleteOrder, toggleEditModal } from "./store"; // Actions Redux adaptées

const OrderCard = ({ order }) => {
  const { id, status, amount, user, products, createdAt, updatedAt } = order;

  const [start, setStart] = useState(new Date(createdAt));
  const [end, setEnd] = useState(new Date(updatedAt));
  const [totaldays, setTotaldays] = useState(0);

  useEffect(() => {
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    setTotaldays(diffDays);
  }, [start, end]);

  const dispatch = useDispatch();

  return (
    <Card className="cursor-move bg-white">
      {/* header */}
      <header className="flex justify-between items-end">
        <div className="flex space-x-4 items-center rtl:space-x-reverse">
          <div className="flex-none">
            <div className="h-10 w-10 rounded-md text-lg bg-slate-100 text-slate-900 dark:bg-slate-600 dark:text-slate-200 flex flex-col items-center justify-center font-normal capitalize">
              {`CMD-${id}`}
            </div>
          </div>
          <div className="font-medium text-base leading-6">
            <div className="dark:text-slate-200 text-slate-900 max-w-[160px] truncate">
              Statut : {status}
            </div>
          </div>
        </div>
        <div>
          <Dropdown
            classMenuItems="w-[130px]"
            label={
              <span className="text-lg inline-flex flex-col items-center justify-center h-8 w-8 rounded-full bg-gray-500-f7 dark:bg-slate-900 dark:text-slate-400">
                <Icon icon="heroicons-outline:dots-vertical" />
              </span>
            }
          >
            <div>
              <Menu.Item
                onClick={() =>
                  dispatch(
                    toggleEditModal({
                      editModal: true,
                      order,
                    })
                  )
                }
              >
                <div className="hover:bg-slate-900 dark:hover:bg-slate-600 hover:text-white px-4 py-2 text-sm cursor-pointer">
                  <Icon icon="heroicons-outline:pencil-alt" />
                  Modifier
                </div>
              </Menu.Item>
              <Menu.Item onClick={() => dispatch(deleteOrder(id))}>
                <div className="hover:bg-slate-900 dark:hover:bg-slate-600 hover:text-white px-4 py-2 text-sm cursor-pointer">
                  <Icon icon="heroicons-outline:trash" />
                  Supprimer
                </div>
              </Menu.Item>
            </div>
          </Dropdown>
        </div>
      </header>
      {/* description */}
      <div className="text-slate-600 dark:text-slate-400 text-sm pt-4 pb-8">
        Montant total : {amount} €
      </div>
      <div className="text-slate-600 dark:text-slate-400 text-sm">
        Produits : {products.map((product) => product.name).join(", ")}
      </div>
      {/* dates */}
      <div className="flex space-x-4 rtl:space-x-reverse mt-4">
        <div>
          <span className="block date-label">Créée le</span>
          <span className="block date-text">{new Date(createdAt).toLocaleDateString()}</span>
        </div>
        <div>
          <span className="block date-label">Mise à jour le</span>
          <span className="block date-text">{new Date(updatedAt).toLocaleDateString()}</span>
        </div>
      </div>
      {/* duration */}
      <div className="ltr:text-right rtl:text-left text-xs text-slate-600 dark:text-slate-300 mb-1 font-medium">
        Durée : {totaldays} jours
      </div>
      {/* user */}
      <div className="grid grid-cols-2 gap-4 mt-6">
        <div>
          <div className="text-slate-400 dark:text-slate-400 text-sm font-normal mb-3">
            Client
          </div>
          <div className="text-slate-900 dark:text-slate-200 text-sm">
            {user.name}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default OrderCard;

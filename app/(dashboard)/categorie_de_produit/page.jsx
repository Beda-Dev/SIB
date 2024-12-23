"use client";

import React, { useState, useMemo, useEffect } from "react";
import { advancedTable } from "@/constant/table-data";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import Button from "@/components/ui/Button";
import Tooltip from "@/components/ui/Tooltip";
import { useRouter } from "next/navigation";
import Modal from "@/components/ui/Modal";
import Textinput from "@/components/ui/Textinput";
import { Categorieproduit } from "./ajout";
import { Recherche , modification_categorie } from "./api_category";
import { toast } from "react-toastify";
import {
  useTable,
  useRowSelect,
  useSortBy,
  useGlobalFilter,
  usePagination,
} from "react-table";

const IndeterminateCheckbox = React.forwardRef(
  ({ indeterminate, ...rest }, ref) => {
    const defaultRef = React.useRef();
    const resolvedRef = ref || defaultRef;

    React.useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate;
    }, [resolvedRef, indeterminate]);

    return (
      <>
        <input
          type="checkbox"
          ref={resolvedRef}
          {...rest}
          className="table-checkbox"
        />
      </>
    );
  }
);

const categorie_de_produit = () => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false); // État pour afficher ou non la modale
  const [isModalOpen1, setIsModalOpen1] = useState(false);
  const [categoryName, setCategoryName] = useState(""); // État pour la valeur de l'input
  const [newName, setNewName] = useState("");
  const [id_categorie , setId_categorie] = useState(0)
  const [arraydata, SetArraydata] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Ouvrir la modale
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  // Fermer la modale
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Ouvrir la modale1
  const handleOpenModal1 = () => {
    setIsModalOpen1(true);
  };

  // Fermer la modale1
  const handleCloseModal1 = () => {
    setIsModalOpen1(false);
  };

  const Modification_categorie = async () => {
    console.log("catégorie modifier :", newName);
    const result = await modification_categorie(id_categorie , newName)

    if (result.success) {
      toast.success(`Categorie modifier avec success`);
    }

    setIsModalOpen1(false);
    setNewName("");
  };

  const handleCreateCategory = async () => {
    console.log("Nouvelle catégorie :", categoryName);
    const result = await Categorieproduit(categoryName);

    if (result.success) {
      toast.success(`Categorie ${categoryName} creer avec success`);
      SetArraydata([...arraydata, result.data]); // Ajout de la nouvelle catégorie
    }
    setIsModalOpen(false);
    setCategoryName("");
  };
  useEffect(() => {
    const getData = async () => {
      setIsLoading(true);
      const Data = await Recherche();
      if (Data) {
        SetArraydata(Data["data"]["data"]);
      }
      setIsLoading(false);
    };

    getData();
  }, [categoryName , newName]);

  const COLUMNS = [
    {
      Header: "Id",
      accessor: "id",
      Cell: ({ row }) => ( <div>
        {+row.id + 1}
      </div>
      ),
    },
    {
      Header: "Libellé",
      accessor: "label",
    },

    {
      Header: "action",
      accessor: "action",
      Cell: (row) => {
        return (
          <div className="flex space-x-3 rtl:space-x-reverse ">
            <Tooltip
              content="éditer"
              placement="top"
              arrow
              animation="shift-away"
            >
              <button
                className="action-btn"
                type="button"
                onClick={()=>{
                  setNewName(row.cell.row.values.label)
                  setId_categorie(row.cell.row.values.id)
                  console.log(row.cell.row.values.label);
                  console.log(row.cell.row.values.id);
                  handleOpenModal1() }}
              >
                <Icon icon="heroicons:pencil-square" />
              </button>
            </Tooltip>
          </div>
        );
      },
    },
  ];

  const columns = useMemo(() => COLUMNS, []);
  const data = useMemo(() => arraydata, [arraydata]);

  const tableInstance = useTable(
    {
      columns,
      data,
    },

    useGlobalFilter,
    useSortBy,
    usePagination,
    useRowSelect,

    (hooks) => {
      hooks.visibleColumns.push((columns) => [...columns]);
    }
  );
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    state,
    gotoPage,

    prepareRow,
  } = tableInstance;

  const { pageIndex } = state;

  return (
    <>
      <Card noborder>
        <div className="md:flex pb-6 items-center">
          <h6 className="flex-1 md:mb-0 mb-3">Categorie de produit</h6>
          <div className="md:flex md:space-x-3 items-center flex-none rtl:space-x-reverse">
            <Button
              icon="heroicons-outline:plus-sm"
              text="creer une categorie"
              className=" btn-success bg-green-500 font-normal btn-sm "
              iconClass="text-lg"
              onClick={handleOpenModal}
            />
            <Modal
              activeModal={isModalOpen} // Passer l'état pour afficher ou non la modale
              onClose={handleCloseModal} // Fermer la modale
              title="Créer une nouvelle catégorie"
              footerContent={
                <Button
                  text="Créer"
                  className="btn-success"
                  onClick={handleCreateCategory} // Créer la catégorie au clic
                />
              }
            >
              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-gray-700"
                >
                  Nom de la catégorie
                </label>
                <Textinput
                  type="text"
                  id="category"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)} // Mettre à jour l'état
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="Saisissez le nom de la catégorie"
                />
              </div>
            </Modal>
          </div>
        </div>
        <div className="overflow-x-auto -mx-6">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden ">
              <table
                className="min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700"
                {...getTableProps}
              >
                <thead className="bg-slate-100 dark:bg-slate-700">
                  {headerGroups.map((headerGroup) => (
                    <tr
                      {...headerGroup.getHeaderGroupProps()}
                      key={`ex-tr-${headerGroup.id}`}
                    >
                      {headerGroup.headers.map((column) => (
                        <th
                          {...column.getHeaderProps(
                            column.getSortByToggleProps()
                          )}
                          scope="col"
                          className=" table-th "
                          key={`ex-th-${column.id}`}
                        >
                          {column.render("Header")}
                          <span>
                            {column.isSorted
                              ? column.isSortedDesc
                                ? " 🔽"
                                : " 🔼"
                              : ""}
                          </span>
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody
                  className="bg-white divide-y divide-slate-100 dark:bg-slate-800 dark:divide-slate-700"
                  {...getTableBodyProps}
                >
                  {page.map((row) => {
                    prepareRow(row);
                    return (
                      <tr {...row.getRowProps()} key={`ex-tr2-${row.id}`} className="even:bg-slate-100 dark:even:bg-slate-700">
                        {row.cells.map((cell) => {
                          return (
                            <td
                              {...cell.getCellProps()}
                              className="table-td"
                              key={`ex-td-${cell.column.id}`}
                            >
                              {cell.render("Cell")}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="md:flex md:space-y-0 space-y-5 justify-between mt-6 items-center">
          <div className=" flex items-center space-x-3 rtl:space-x-reverse">
            <span className=" flex space-x-2  rtl:space-x-reverse items-center">
              <span className=" text-sm font-medium text-slate-600 dark:text-slate-300">
                suivant
              </span>
              <span>
                <input
                  type="number"
                  className=" form-control py-2"
                  defaultValue={pageIndex + 1}
                  onChange={(e) => {
                    const pageNumber = e.target.value
                      ? Number(e.target.value) - 1
                      : 0;
                    gotoPage(pageNumber);
                  }}
                  style={{ width: "50px" }}
                />
              </span>
            </span>
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
              Page{" "}
              <span>
                {pageIndex + 1} of {pageOptions.length}
              </span>
            </span>
          </div>
          <ul className="flex items-center  space-x-3  rtl:space-x-reverse">
            <li className="text-xl leading-4 text-slate-900 dark:text-white rtl:rotate-180">
              <button
                className={` ${
                  !canPreviousPage ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={() => previousPage()}
                disabled={!canPreviousPage}
              >
                <Icon icon="heroicons-outline:chevron-left" />
              </button>
            </li>
            {pageOptions.map((page, pageIdx) => (
              <li key={pageIdx}>
                <button
                  href="#"
                  aria-current="page"
                  className={` ${
                    pageIdx === pageIndex
                      ? "bg-green-500 dark:bg-green-500  dark:text-slate-200 text-white font-medium "
                      : "bg-green-500 dark:bg-green-500 dark:text-slate-400 text-slate-900  font-normal  "
                  }    text-sm rounded leading-[16px] flex h-6 w-6 items-center justify-center transition-all duration-150`}
                  onClick={() => gotoPage(pageIdx)}
                >
                  {page + 1}
                </button>
              </li>
            ))}
            <li className="text-xl leading-4 text-slate-900 dark:text-white rtl:rotate-180">
              <button
                className={` ${
                  !canNextPage ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={() => nextPage()}
                disabled={!canNextPage}
              >
                <Icon icon="heroicons-outline:chevron-right" />
              </button>
            </li>
          </ul>
        </div>
        <Modal
          activeModal={isModalOpen1} // Passer l'état pour afficher ou non la modale
          onClose={handleCloseModal1} // Fermer la modale
          title="Modifier une categorie"
          footerContent={
            <Button
              text="Modifier"
              className="btn-success"
              onClick={Modification_categorie} // Créer la catégorie au clic
            />
          }
        >
          <div>
            <label
              htmlFor="newcategory"
              className="block text-sm font-medium text-gray-700"
            >
              nouveau nom
            </label>
            <Textinput
              type="text"
              id="newcategory"
              value={newName}
              defaultValue={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Saisissez le nom de la catégorie"
            />
          </div>
        </Modal>
      </Card>
    </>
  );
};

export default categorie_de_produit ;

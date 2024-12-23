"use client";

import React, { useState, useMemo, useEffect } from "react";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import Button from "@/components/ui/Button";
import Tooltip from "@/components/ui/Tooltip";
import { useRouter } from "next/navigation";
import { RechercheProduit } from "./api_recherche_produit.jsx";
import Voir_produit from "./detail_du_produit.jsx";
import {
  useTable,
  useRowSelect,
  useSortBy,
  useGlobalFilter,
  usePagination,
} from "react-table";
import GlobalFilter from "@/components/partials/table/GlobalFilter";

const liste_produit = () => {
  const router = useRouter();
  const [product, setProduct] = useState([]);
  const [Loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);

  // Ouvrir et fermer la modale
  const handleOpenModal = (id) => {
    setSelectedProductId(id);
    setIsModalOpen(true);
  };

  const handleCloseModal = (isOpenFromChild) => {
    setIsModalOpen(isOpenFromChild);
    if (!isOpenFromChild) {
      setSelectedProductId(null); // Réinitialise l'ID du produit sélectionné
    }
  };

  useEffect(() => {
    setLoading(true);
    const getData = async () => {
      try {
        const Data = await RechercheProduit();
        if (Data) {
          setProduct(Data.data?.data || []);
          console.log(Data.data?.data)
        }
      } catch (error) {
        console.error("Erreur lors du chargement des produits :", error);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, [RechercheProduit]);

  if (!product && Loading) {
    return <div className="text-center">Veuillez patienter...</div>;
  }

  if (!product && !Loading) {
    return <div className="text-center">Aucune donnée disponible</div>;
  }

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
      Cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          {row.original.images && row.original.images.length > 0 && (
            <img
              src={row.original.images[0].url}
              alt="Produit"
              className="h-10 w-10 object-cover rounded-full"
            />
          )}
          <span>{row.original.label}</span>
        </div>
      ),
    },
    {
      Header: "Description",
      accessor: "description",
      Cell: ({ value }) => (
        <span>
          {value
            ? value.length > 50
              ? `${value.slice(0, 50)}...`
              : value
            : "Non disponible"}
        </span>
      ),
    },
    {
      Header: "Categorie",
      accessor: "category",
      Cell: ({ value }) => <span>{value?.label || "Non défini"}</span>,
    },
    {
      Header: "Prix",
      accessor: "unit_price",
    },
    {
      Header: "Action",
      accessor: "action",
      Cell: (row) => (
        <div className="flex space-x-3 rtl:space-x-reverse">
          <Tooltip
            content="Voir"
            placement="top"
            arrow
            animation="shift-away"
            theme="success"
          >
            <button
              className="action-btn"
              type="button"
              onClick={() => {
                handleOpenModal(row.cell.row.values.id);
                //router.push(`/produit/${row.cell.row.values.id}`);
              }}
            >
              <Icon icon="heroicons:eye" />
            </button>
          </Tooltip>
          <Tooltip
            content="Editer"
            placement="top"
            arrow
            animation="shift-away"
          >
            <button
              className="action-btn"
              type="button"
              onClick={() => {
                sessionStorage.setItem(
                  "id_produit_modifier",
                  JSON.stringify(row.cell.row.values.id)
                );
                router.push("/modification_produit");
              }}
            >
              <Icon icon="heroicons:pencil-square" />
            </button>
          </Tooltip>
        </div>
      ),
    },
  ];

  const columns = useMemo(() => COLUMNS, []);
  const data = useMemo(() => product, [product]);

  const tableInstance = useTable(
    { columns, data },
    useGlobalFilter,
    useSortBy,
    usePagination,
    useRowSelect
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
    setGlobalFilter,
    prepareRow,
  } = tableInstance;

  const { globalFilter, pageIndex } = state;

  return (
    <>
      <Card noborder>
        <div className="md:flex pb-6 items-center">
          <h6 className="flex-1 md:mb-0 mb-3">Produit</h6>
          <div className="md:flex md:space-x-3 items-center flex-none rtl:space-x-reverse">
            <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
            <Button
              icon="heroicons-outline:plus-sm"
              text="Ajouter un produit"
              className="btn-warning bg-orange-500 font-normal btn-sm"
              iconClass="text-lg"
              onClick={() => {
                router.push("/ajouter_un_produit");
              }}
            />
          </div>
        </div>
        <div className="overflow-x-auto -mx-6">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden">
              <table
                className="min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700"
                {...getTableProps}
              >
                <thead className="bg-slate-100 dark:bg-slate-700">
                  {headerGroups.map((headerGroup) => (
                    <tr
                      {...headerGroup.getHeaderGroupProps()}
                      key={headerGroup.id}
                    >
                      {headerGroup.headers.map((column) => (
                        <th
                          {...column.getHeaderProps(
                            column.getSortByToggleProps()
                          )}
                          scope="col"
                          className="table-th"
                          key={column.id}
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
                  {...getTableBodyProps()}
                >
                  {page.map((row) => {
                    prepareRow(row);
                    return (
                      <tr
                        {...row.getRowProps()}
                        key={row.id}
                        className="even:bg-slate-100 dark:even:bg-slate-700"
                      >
                        {row.cells.map((cell) => (
                          <td
                            {...cell.getCellProps()}
                            className="table-td "
                            key={cell.column.id}
                          >
                            {cell.render("Cell")}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="md:flex justify-between mt-6 items-center">
          <div className=" flex items-center space-x-3 rtl:space-x-reverse">
            <span className=" flex space-x-2  rtl:space-x-reverse items-center">
              <span className=" text-sm font-medium text-slate-600 dark:text-slate-300">
                Aller
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
          <ul className="flex items-center space-x-3 rtl:space-x-reverse">
            <li>
              <button
                aria-label="Page précédente"
                disabled={!canPreviousPage}
                onClick={() => previousPage()}
              >
                <Icon icon="heroicons-outline:chevron-left" />
              </button>
            </li>
            {pageOptions.map((_, pageIdx) => (
              <li key={pageIdx}>
                <button
                  onClick={() => gotoPage(pageIdx)}
                  className={`${
                    pageIdx === pageIndex
                      ? "bg-orange-500 dark:bg-slate-600  dark:text-slate-200 text-white font-medium "
                      : "bg-slate-100  dark:text-slate-400 text-slate-900  font-normal "
                  }    text-sm rounded leading-[16px] flex h-6 w-6 items-center justify-center transition-all duration-150`}
                >
                  {pageIdx + 1}
                </button>
              </li>
            ))}
            <li>
              <button
                aria-label="Page suivante"
                disabled={!canNextPage}
                onClick={() => nextPage()}
              >
                <Icon icon="heroicons-outline:chevron-right" />
              </button>
            </li>
          </ul>
        </div>
        {isModalOpen && selectedProductId && (
          <Voir_produit id={selectedProductId} onChange={handleCloseModal} />
        )}
      </Card>
    </>
  );
};

export default liste_produit;

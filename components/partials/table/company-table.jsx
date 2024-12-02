/* eslint-disable react/display-name */
import React, { useState, useMemo } from "react";
import { homeTable } from "../../../constant/table-data"; // Données constantes pour la table

import Icon from "@/components/ui/Icon";

import {
  useTable,
  useRowSelect,
  useSortBy,
  useGlobalFilter,
  usePagination,
} from "react-table"; // Bibliothèque pour la gestion des tableaux dynamiques

// Colonnes de la table
const COLUMNS = [
  {
    Header: "Entreprise",
    accessor: "company",
    Cell: (row) => {
      return (
        <span className="flex items-center">
          <div className="flex-none">
            <div className="w-8 h-8 rounded-[100%] ltr:mr-3 rtl:ml-3">
              <img
                src={row?.cell?.value}
                alt=""
                className="w-full h-full rounded-[100%] object-cover"
              />
            </div>
          </div>
          <div className="flex-1 text-start">
            <h4 className="text-sm font-medium text-slate-600 whitespace-nowrap">
              Biffco Enterprises Ltd.
            </h4>
            <div className="text-xs font-normal text-slate-600 dark:text-slate-400">
              Biffco@example.com
            </div>
          </div>
        </span>
      );
    },
  },
  {
    Header: "Catégorie",
    accessor: "category",
    Cell: () => <span>Technologie</span>,
  },
  {
    Header: "Ventes",
    accessor: "sales",
    Cell: (row) => {
      return (
        <div className="flex space-x-6 items-center rtl:space-x-reverse">
          <span>{row?.cell?.value + "%"}</span>
          <span
            className={`text-xl ${
              row?.cell?.value > 100 ? "text-success-500" : "text-danger-500"
            }`}
          >
            {row?.cell?.value > 100 ? (
              <Icon icon="heroicons:arrow-trending-up" />
            ) : (
              <Icon icon="heroicons:arrow-trending-down" />
            )}
          </span>
        </div>
      );
    },
  },
  {
    Header: "Vues",
    accessor: "views",
    Cell: (row) => <span>{row?.cell?.value}</span>,
  },
  {
    Header: "Revenus",
    accessor: "revenue",
    Cell: (row) => <span>{row?.cell?.value}</span>,
  },
];

// Composant principal
const CompanyTable = () => {
  const columns = useMemo(() => COLUMNS, []); // Mémorisation des colonnes pour éviter les recompositions inutiles
  const data = useMemo(() => homeTable, []); // Données de la table

  // Configuration de la table
  const tableInstance = useTable(
    {
      columns,
      data,
      initialState: { pageSize: 6 },
    },
    useGlobalFilter,
    useSortBy,
    usePagination,
    useRowSelect
  );

  // Décomposition des fonctions et états de la table
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
      <div>
        <div className="overflow-x-auto -mx-6">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden">
              {/* Table */}
              <table
                className="min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700"
                {...getTableProps()}
              >
                {/* En-tête */}
                <thead className="bg-slate-200 dark:bg-slate-700">
                  {headerGroups.map((headerGroup) => (
                    <tr key={headerGroup.id} {...headerGroup.getHeaderGroupProps()}>
                      {headerGroup.headers.map((column) => (
                        <th
                          key={column.id}
                          {...column.getHeaderProps(column.getSortByToggleProps())}
                          className="table-th"
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

                {/* Corps */}
                <tbody
                  className="bg-white divide-y divide-slate-100 dark:bg-slate-800 dark:divide-slate-700"
                  {...getTableBodyProps()}
                >
                  {page.map((row) => {
                    prepareRow(row);
                    return (
                      <tr key={row.id} {...row.getRowProps()}>
                        {row.cells.map((cell) => (
                          <td key={cell.id} {...cell.getCellProps()} className="table-td">
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

        {/* Pagination */}
        <div className="md:flex md:space-y-0 space-y-5 justify-center mt-6 items-center">
          <ul className="flex items-center space-x-3 rtl:space-x-reverse">
            <li className="text-xl leading-4 text-slate-900 dark:text-white rtl:rotate-180">
              <button
                disabled={!canPreviousPage}
                className={`${!canPreviousPage ? "opacity-50 cursor-not-allowed" : ""}`}
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
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 text-slate-900"
                  }`}
                >
                  {pageIdx + 1}
                </button>
              </li>
            ))}
            <li className="text-xl leading-4 text-slate-900 dark:text-white rtl:rotate-180">
              <button
                disabled={!canNextPage}
                className={`${!canNextPage ? "opacity-50 cursor-not-allowed" : ""}`}
                onClick={() => nextPage()}
              >
                <Icon icon="heroicons-outline:chevron-right" />
              </button>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default CompanyTable;

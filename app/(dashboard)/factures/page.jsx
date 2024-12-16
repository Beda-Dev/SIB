/* eslint-disable react/display-name */
"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { advancedTable } from "@/constant/table-data";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import Button from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";
import {
  Modal,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import {
  useTable,
  useRowSelect,
  useSortBy,
  useGlobalFilter,
  usePagination,
} from "react-table";
import GlobalFilter from "@/components/partials/table/GlobalFilter";
import { getInvoice } from "./api_facture";
import { Import } from "lucide-react";
import InvoiceAddPage from "../(utility)/invoice-add/page";

const InvoicePage = () => {
  const [factures, setFactures] = useState([]);
  const [Loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState("");
  const [invoiceDetails, setInvoiceDetails] = useState(null);
  const [openIvoice, setOpenIvoice] = useState(false);
  const [childUnmounted, setChildUnmounted] = useState(false);

  const handleChildUnmount = (isUnmounted) => {
    setChildUnmounted(isUnmounted);
    console.log("Le composant enfant a été démonté : ", isUnmounted);
    setOpenIvoice(false);
    setInvoiceDetails("");
    setTimeout(() => {
      setChildUnmounted(false);
    }, 1000);
  };

  useEffect(() => {
    setLoading(true);
    const obtentionFacture = async () => {
      try {
        const Data = await getInvoice();
        setFactures(Data.data?.data || []);
      } catch (error) {
        console.log("Erreur lors du chargement des factures.");
      } finally {
        setLoading(false);
      }
    };

    obtentionFacture();
  }, []);

  const handleInvoiceSelection = async (id) => {
    try {
      const response = await axios.get(
        `https://sibeton-api.vercel.app/api/invoice/${id}`
      );
      setInvoiceDetails(response.data.data);
      console.log(response.data.data);
      toast.success("Facture récupérée avec succès !");
      setOpenIvoice(true);
    } catch (error) {
      toast.error("Erreur lors de la récupération de la facture.");
      console.log(error);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedInvoiceId("");
  };

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  if (!factures && Loading) {
    return <div className="text-center">Veuillez patienter...</div>;
  }

  if (!factures && !Loading) {
    return <div className="text-center">Aucune donnée disponible</div>;
  }

  const router = useRouter();
  const actions = [
    {
      name: "voir",
      icon: "heroicons-outline:eye",
      doit: (id) => {
        console.log(id);
        router.push(`/factures/${id}`);
      },
    },
  ];
  const COLUMNS = [
    {
      Header: "Id",
      accessor: "id",
      Cell: ({ row }) => <div>{+row.id + 1}</div>,
    },
    {
      Header: "commande",
      accessor: "order",
      Cell: (row) => {
        return <span>#{row?.cell?.value.id}</span>;
      },
    },
    {
      Header: "client",
      accessor: "user",
      Cell: (row) => {
        return (
          <span>
            {row?.cell?.value.firstName} {row?.cell?.value.lastName}
          </span>
        );
      },
    },
    {
      Header: "date",
      accessor: "createdAt",
      Cell: (row) => {
        return <span>{new Date(row?.cell?.value).toLocaleDateString()}</span>;
      },
    },
    {
      Header: "montant",
      accessor: "amount",
      Cell: (row) => {
        return <span>{row?.cell?.value} FCFA</span>;
      },
    },
    {
      Header: "status",
      accessor: "status",
      Cell: (row) => {
        return (
          <span className="block w-full">
            <span
              className={` inline-block px-3 min-w-[90px] text-center mx-auto py-1 rounded-[999px] bg-opacity-25 ${
                row?.cell?.value === "paid"
                  ? "text-success-500 bg-success-500"
                  : ""
              } 
            ${
              row?.cell?.value === "unpaid"
                ? "text-warning-500 bg-warning-500"
                : ""
            }
            ${
              row?.cell?.value === "pending"
                ? "text-danger-500 bg-danger-500"
                : ""
            }
            
             `}
            >
              {row?.cell?.value}
            </span>
          </span>
        );
      },
    },
    {
      Header: "action",
      accessor: "action",
      Cell: (row) => {
        return (
          <div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800 flex">
              {actions.map((item, i) => (
                <div
                  key={i}
                  onClick={() => {
                    item.doit(row.row.original.id);
                  }}
                  className={`hover:bg-success-500 hover:text-white dark:hover:bg-slate-600 dark:hover:bg-opacity-50
                   w-full border-b border-b-gray-500 border-opacity-10 px-4 py-2 text-sm  last:mb-0 cursor-pointer 
                   first:rounded-t last:rounded-b flex  space-x-2 items-center justify-center rtl:space-x-reverse `}
                >
                  <span className="text-base">
                    <Icon icon={item.icon} />
                  </span>
                  <span>{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        );
      },
    },
  ];

  const columns = useMemo(() => COLUMNS, []);
  const data = useMemo(() => factures, [factures]);

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
    footerGroups,
    page,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    state,
    gotoPage,
    pageCount,
    setPageSize,
    setGlobalFilter,
    prepareRow,
  } = tableInstance;

  const { globalFilter, pageIndex, pageSize } = state;

  return (
    <>
      {openIvoice && invoiceDetails ? (
        <InvoiceAddPage order={invoiceDetails} onUnmount={handleChildUnmount} />
      ) : (
        <Card noborder>
          <div className="md:flex pb-6 items-center">
            <h6 className="flex-1 md:mb-0 mb-3">Facture</h6>
            <div className="md:flex md:space-x-3 items-center flex-none rtl:space-x-reverse">
              <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
              {/*<Button
            icon="heroicons-outline:calendar"
            text="Select date"
            className=" btn-outline-secondary dark:border-slate-700  text-slate-600 btn-sm font-normal dark:text-slate-300 "
            iconClass="text-lg"
          />
          <Button
            icon="heroicons-outline:filter"
            text="Filter"
            className=" btn-outline-secondary text-slate-600 dark:border-slate-700 dark:text-slate-300 font-normal btn-sm "
            iconClass="text-lg"
          />
          */}
              <Button
                icon="heroicons-outline:plus-sm"
                text="enregistrer une facture"
                className=" btn-dark font-normal btn-sm "
                iconClass="text-lg"
                onClick={handleOpenModal}
              />
            </div>
          </div>
          <Modal
            open={modalOpen}
            onClose={handleCloseModal}
            className="w-64 bg-white"
          >
            <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
              <div className="bg-white p-8 rounded-lg max-w-md w-full shadow-xl">
                <div className="modal-content">
                  <h2 className="text-lg mb-4">
                    Veuillez sélectionner la commande concernée
                  </h2>
                  <FormControl fullWidth>
                    <InputLabel id="invoice-select-label" className="text-sm ">
                      ID de la Facture
                    </InputLabel>
                    <Select
                    className="h-12"
                      labelId="invoice-select-label"
                      value={selectedInvoiceId}
                      onChange={(e) => setSelectedInvoiceId(e.target.value)}
                      label="ID de la Facture"
                    >
                      {factures.map((facture) => (
                        <MenuItem key={facture.id} value={facture.id}>
                          {`Facture #${facture.id}`}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <div className="modal-actions w-full flex justify-between gap-10 mt-4">
                    <Button
                      text="Annuler"
                      className="btn-outline-dark text-sm px-4 py-2"
                      onClick={handleCloseModal}
                    />
                    <Button
                      text="Confirmer"
                      className="btn-dark text-sm px-4 py-2"
                      onClick={() => {
                        handleInvoiceSelection(selectedInvoiceId);
                        handleCloseModal();
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </Modal>
          <div className="overflow-x-auto -mx-6">
            <div className="inline-block min-w-full align-middle">
              <div className="overflow-hidden ">
                <table
                  className="min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700"
                  {...getTableProps}
                >
                  <thead className=" border-t border-slate-100 dark:border-slate-800">
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
                        <tr {...row.getRowProps()} key={`ex-tr2-${row.id}`}>
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
                        ? "bg-slate-900 dark:bg-slate-600  dark:text-slate-200 text-white font-medium "
                        : "bg-slate-100 dark:bg-slate-700 dark:text-slate-400 text-slate-900  font-normal  "
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
        </Card>
      )}
    </>
  );
};

export default InvoicePage;

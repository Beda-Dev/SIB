"use client";

import React, { useState, useMemo , useEffect } from "react";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import Button from "@/components/ui/Button";
import Tooltip from "@/components/ui/Tooltip";
import { useRouter } from "next/navigation";
import { RechercheProduit } from "./Recproduit";
import {
  useTable,
  useRowSelect,
  useSortBy,
  useGlobalFilter,
  usePagination,
} from "react-table";
import GlobalFilter from "@/components/partials/table/GlobalFilter";

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

const ProductPage = () => {
  const router = useRouter();
  const [product , setProduct] = useState([]);
  const [Loading , setLoading] = useState(false)

  useEffect(()=>{
    const getData =async()=>{
      setLoading(true);
      const Data = await RechercheProduit();
      if(Data){
        
        setProduct(Data['data']['data'])
        console.log(Data['data']['data'])
       
      }
      setLoading(false);
    }

    getData()



  },[])


  const COLUMNS = [
    {
      Header: "Id",
      accessor: "id",
    },

    {
      Header: "Libellé",
      accessor: "label",

    },
    {
      Header: "Images",
      accessor: "images",
      Cell: ({ value }) => (
        <div className="flex space-x-2">
          { 
          value?.slice(0, 1).map((img) => (
            <img
              key={img.id}
              src={img.url}
              alt="Produit"
              className="h-10 w-10 object-cover rounded"
            />
          ))}
        </div>
      ),
    },
    {
      Header: "Description",
      accessor: "description",
      Cell: ({ value }) => (
        <span>{value.length > 50 ? `${value.slice(0, 50)}...` : value}</span>
      )
    },
    {
      Header: "Categorie",
      accessor: "category",
      Cell: ({ value }) => <span>{value?.label || "Non défini"}</span>,
    },

    {
      Header: "Prix",
      accessor: "Prix",

    },
    {
      Header: "Ajouter le ",
      accessor: "createdAt",
      Cell: ({ value }) => {
        const formattedDate = new Date(value).toLocaleDateString("fr-FR");
        return <span>{formattedDate}</span>;}

    },

    {
        Header: "action",
        accessor: "action",
        Cell: (row) => {
          return (
            <div className="flex space-x-3 rtl:space-x-reverse ">
              <Tooltip content="Voir" placement="top" arrow animation="shift-away" theme="success">
                <button className="action-btn" type="button">
                  <Icon icon="heroicons:eye" />
                </button>
              </Tooltip>
              <Tooltip content="Editer" placement="top" arrow animation="shift-away">
                <button className="action-btn" type="button">
                  <Icon icon="heroicons:pencil-square" />
                </button>
              </Tooltip>
              <Tooltip
                content="supprimer"
                placement="top"
                arrow
                animation="shift-away"
                theme="danger"
              >
                <button className="action-btn" type="button">
                  <Icon icon="heroicons:trash" />
                </button>
              </Tooltip>
            </div>
          );
        },
      },
  ];

  const columns = useMemo(() => COLUMNS, []);
  const data = useMemo(() => product, [product]);

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
      hooks.visibleColumns.push((columns) => [
        {
          id: "selection",
          Header: ({ getToggleAllRowsSelectedProps }) => (
            <div>
              <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
            </div>
          ),
          Cell: ({ row }) => (
            <div>
              <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
            </div>
          ),
        },
        ...columns,
      ]);
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

    setGlobalFilter,
    prepareRow,
  } = tableInstance;

  const { globalFilter, pageIndex, pageSize } = state;

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
              className=" btn-warning bg-orange-500 font-normal btn-sm "
              iconClass="text-lg"
              onClick={() => {
                router.push("/AjoutProduit");
              }}
            />
          </div>
        </div>
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
                      ? "bg-orange-500 dark:bg-orange-500  dark:text-slate-200 text-white font-medium "
                      : "bg-orange-500 dark:bg-orange-500 dark:text-slate-400 text-slate-900  font-normal  "
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
    </>
  );
};

export default ProductPage;

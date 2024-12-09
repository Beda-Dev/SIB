import React, { useState, useEffect } from "react";
import Select from "react-select";
import Modal from "@/components/ui/Modal";
import { useSelector, useDispatch } from "react-redux";
import { updateTask, toggleEditModal } from "./store";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";

const styles = {
  multiValue: (base, state) => {
    return state.data.isFixed ? { ...base, opacity: "0.5" } : base;
  },
  multiValueLabel: (base, state) => {
    return state.data.isFixed
      ? { ...base, color: "#626262", paddingRight: 6 }
      : base;
  },
  multiValueRemove: (base, state) => {
    return state.data.isFixed ? { ...base, display: "none" } : base;
  },
  option: (provided, state) => ({
    ...provided,
    fontSize: "14px",
  }),
};



const EditTaskModal = () => {
  const { editModal, editItem } = useSelector((state) => state.kanban);
  const dispatch = useDispatch();
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const FormValidationSchema = yup
    .object({
      name: yup.string().required("Name is required"),
      assign: yup.mixed().required("Assignee is required"),
      startDate: yup
        .date()
        .required("Start date is required")
        .min(new Date(), "Start date must be greater than today"),
      endDate: yup
        .date()
        .required("End date is required")
        .min(new Date(), "End date must be greater than today"),
    })
    .required();

  const {
    register,
    control,
    reset,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(FormValidationSchema),

    mode: "all",
  });

  useEffect(() => {
    reset(editItem);
  }, [editModal]);

  const onSubmit = (data) => {
    dispatch(
      updateTask({
        id: editItem?.id,
        name: data.name,
        des: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        assignee: data.assign,
        category: null,
        startDate: startDate.toISOString().split("T")[0],
        endDate: endDate.toISOString().split("T")[0],
        progress: Math.floor(Math.random() * (100 - 10 + 1) + 10),
      })
    );
    dispatch(
      toggleEditModal({
        editModal: false,
        task: null,
      })
    );
  };

  return (
    <Modal
      title="changement de status de la commande"
      activeModal={editModal}
      themeClass="bg-success-500 dark:bg-slate-800 dark:border-b dark:border-slate-700"
      onClose={() =>
        dispatch(
          toggleEditModal({
            editModal: false,
            task: null,
          })
        )
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 ">
        <div className={errors.tags ? "has-error" : ""}>
          <label className="form-label" htmlFor="icon_s1">
            Status
          </label>
          <Controller
            name="tags"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                options={[]}
                styles={styles}
                className="react-select"
                classNamePrefix="select"
                isMulti
                id="icon_s1"
              />
            )}
          />
          
        </div>

        <div className="ltr:text-right rtl:text-left">
          <button className="btn btn-success  text-center">Mise a jour</button>
        </div>
      </form>
    </Modal>
  );
};

export default EditTaskModal;

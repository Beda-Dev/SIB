import React from "react";
import Textinput from "@/components/ui/Textinput";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { loginUser } from "./Login"

const schema = yup
  .object({
    email: yup.string().email("Email invalide").required("L'adresse email est requise"),
    password: yup.string().required("Le mot de passe est requis"),
  })
  .required();

const LoginForm = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    mode: "all",
  });


  const onSubmit = async (data) => {
    if (!data.email || !data.password) {
      toast.error("Informations invalides", {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    }

    try {
      const result = await loginUser(data.email, data.password);
      router.push("/analytics")
      if (result.success) {
        dispatch({ type: "LOGIN", payload: result.user });
      } else {
        toast.error(result.message || "Échec de la connexion", {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    } catch (error) {
      toast.error("Une erreur est survenue lors de la connexion", {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Textinput
        name="email"
        label="Email"
        type="email"
        register={register}
        error={errors?.email}
      />
      <Textinput
        name="password"
        label="Mot de passe"
        type="password"
        register={register}
        error={errors?.password}
      />

      <button className="btn btn-warning block w-full text-center">Se connecter</button>
    </form>
  );
};

export default LoginForm;

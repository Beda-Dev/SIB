"use client";
import Link from "next/link";
import LoginForm from "@/components/partials/auth/login-form";
import useDarkMode from "@/hooks/useDarkMode";

const Login = () => {
  const [isDark] = useDarkMode();
  return (
    <>
      <div className="loginwrapper">
        <div className="lg-inner-column">
          <div className="left-column relative z-[1]">
            <div className="max-w-[520px] pt-20 ltr:pl-20 rtl:pr-20"></div>
            <div className="absolute top-0 left-0 right-0 bottom-0 2xl:bottom-[-160px] bottom-[-130px] h-full w-full z-[-1] flex justify-center items-center">
              <img
                src="/assets/images/auth/LOGO-SIBETON.png"
                alt=""
                className="w-[50%] object-contain"
              />
            </div>
          </div>
          <div className="right-column relative">
            <div className="inner-content h-full flex flex-col bg-white dark:bg-slate-800">
              <div className="auth-box h-full flex flex-col justify-center">
                <div className="mobile-logo text-center mb-6 lg:hidden block">
                  <Link href="/">
                    <img
                      src={
                        isDark
                          ? "/assets/images/logo/logo-white.svg"
                          : "/assets/images/logo/logo.svg"
                      }
                      alt=""
                      className="mx-auto"
                    />
                  </Link>
                </div>
                <div className="text-center 2xl:mb-10 mb-4">
                  <h4 className="font-medium">Connexion</h4>
                  <div className="text-slate-500 text-base">
                    Entrez vos informations pour vous connecter a votre compte
                  </div>
                </div>
                <LoginForm />
                <div className="relative border-b-[#9AA2AF] border-opacity-[16%] border-b pt-6"></div>

                <div className="md:max-w-[345px] mx-auto font-normal text-slate-500 dark:text-slate-400 mt-12 uppercase text-sm"></div>
              </div>
              <div className="auth-footer text-center">
                Copyright 2024, S.I.Béton All Rights Reserved.
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;

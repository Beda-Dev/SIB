import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Avatar from "@/components/ui/Avatar";
import useAuth from "@/hooks/useAuth";

const MobileFooter = () => {
  const router = useRouter();
  const { authToken, userInfo } = useAuth();
  if (!authToken || !userInfo) {
    return <p>Non connecté</p>;
  }
  
  return (
    <div className="bg-white bg-no-repeat custom-dropshadow footer-bg dark:bg-slate-700 flex justify-around items-center backdrop-filter backdrop-blur-[40px] fixed left-0 w-full z-[9999] bottom-0 py-[12px] px-4">
      <Link
        href="profile"
        className="relative bg-white bg-no-repeat backdrop-filter backdrop-blur-[40px] rounded-full footer-bg dark:bg-slate-700 h-[65px] w-[65px] z-[-1] -mt-[40px] flex justify-center items-center"
      >
        <div className="h-[50px] w-[50px] rounded-full relative left-[0px] top-[0px] custom-dropshadow">
          <Avatar name={`${userInfo[0].first_name} ${userInfo[0].last_name}`} size={50}/>
        </div>
      </Link>

    </div>
  );
};

export default MobileFooter;

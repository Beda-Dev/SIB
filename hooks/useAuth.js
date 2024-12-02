import { useEffect, useState } from "react";

const useAuth = () => {
  const [authToken, setAuthToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const token = sessionStorage.getItem("authToken");
    const user = sessionStorage.getItem("userInfo");
    const email = sessionStorage.getItem("email");

    if (token && user) {
      setAuthToken(token);
      setUserInfo([JSON.parse(user),email]);
    }
  }, []);

  return { authToken, userInfo };
};

export default useAuth;

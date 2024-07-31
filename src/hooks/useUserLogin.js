import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";

const useUserLogin = () => {
    const [auth, setAuth] = useState();
    const navigate = useNavigate();

    useEffect(() => {
        setAuth(sessionStorage.getItem('token'));
        if (auth != null) {
            navigate('/admin/index');
        }
    }, [auth]);
}

export default useUserLogin;
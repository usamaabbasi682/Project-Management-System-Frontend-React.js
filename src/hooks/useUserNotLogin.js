import React,{useState,useEffect} from "react";
import { useNavigate } from "react-router-dom";

const useUserNotLogin = () => {
    const navigate = useNavigate();
    const token = sessionStorage.getItem('token');

    useEffect(() => {
        if (token == null || token == '') {
            navigate('/login');
        }
    },[]);
}

export default useUserNotLogin;
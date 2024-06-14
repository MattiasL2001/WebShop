import axios, { Axios } from "axios";
import { LoginUser } from "../components/models/LoginUser";

const BASE_URL = "https://localhost:7180"

const CreateBasicAuthorizationHeader = (loginUser:LoginUser) => {
    return btoa(`${loginUser.email}:${loginUser.password}`)
}

export const Login = (loginUser:LoginUser) => {
    
    return axios.post(BASE_URL + "/OAuth/token", 
    new URLSearchParams({ grant_type: "client_credentials" }), 
    {
    headers: {
            "Authorization": `Basic ${CreateBasicAuthorizationHeader(loginUser)}`,
            "Content_Type": "application/x-www-form-urlencoded"
    }}).then(response => response.data)
    
}

export const GetProducts = () => {
    return axios.get(BASE_URL + "/Product/all").then(
        (response => response.data)
    )
}
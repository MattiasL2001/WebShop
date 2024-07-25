import axios from "axios";
import { LoginUser } from "../components/models/LoginUser";

const BASE_URL = "https://localhost:7180";

const CreateBasicAuthorizationHeader = (loginUser: LoginUser) => {
    return btoa(`${loginUser.email}:${loginUser.password}`);
};

export const Login = (loginUser: LoginUser) => {
    return axios.post(BASE_URL + "/OAuth/token", 
        new URLSearchParams({ grant_type: "client_credentials" }), 
        {
            headers: {
                "Authorization": `Basic ${CreateBasicAuthorizationHeader(loginUser)}`,
                "Content-Type": "application/x-www-form-urlencoded"
            }
        }).then(response => response.data);
};

export const GetProducts = (
    numberPerPage: number, 
    page: number, 
    type?: number, 
    color?: number, 
    gender?: number, 
    sortBy?: string, 
    search?: string
) => {
    const params: any = { numberPerPage, page };

    if (type !== undefined) params.type = type;
    if (color !== undefined) params.color = color;
    if (gender !== undefined) params.gender = gender;
    if (sortBy !== undefined) params.sortBy = sortBy;
    if (search !== undefined) params.search = search;

    return axios.get(BASE_URL + "/Product/products", { params })
        .then(response => response.data);
};

export const GetNumberOfProducts = () => {
    return axios.get(BASE_URL + "/Product/all").then(response => response.data);
};

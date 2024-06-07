import axios from "axios";
import { ProductList } from "../components/models/Products";

const BASE_URL = "https://localhost:7180/"

export const GetProducts = () => {
    return axios.get(BASE_URL + "Product/all").then(
        (response => response.data)
    )
}
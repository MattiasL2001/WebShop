import axios from "axios";

const BASE_URL = "https://localhost:7180/"

export const GetProducts = () => {
    return axios.get(BASE_URL + "Product/all").then(
        (response => response.data)
    )
}
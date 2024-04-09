import axios from "axios"

export const addOpeningAmount = async (amount: number) => {
    try {
        const res = await axios.post("/api/add-opening-amount", {openingAmount: amount});
        return res;
    } catch (error) {
        console.log(error);
    }
}

export const getOpeningAmount = async () => {
    try {
        const res = await axios.get("/api/add-opening-amount");
        return res;
    } catch (error) {
        console.log(error);
    }
}
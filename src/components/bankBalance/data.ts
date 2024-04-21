import axios from "axios"

export const getBankAmountData = async () => {
    try {
        const res = await axios.get("/api/add-opening-amount");
        return res;
    } catch (error) {
        console.log(error)
    }
}

export const deleteBankAmountData = async (id: string) => {
    try {
        const res = await axios.delete(`api/add-opening-amount/${id}`);
        return res;
    } catch (error) {
        console.log(error)
    }
}
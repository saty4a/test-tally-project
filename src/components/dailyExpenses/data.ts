import axios from "axios"

export const getExpenditureData = async () => {
    try {
        const res = await axios.get("/api/dailyexpenses");
        if(res){
            return res;
        }
    } catch (error) {
        console.log(error);
    }
}

export const deleteExpenditureData = async (id:string) => {
    try {
        const res = await axios.delete(`/api/dailyexpenses/${id}`);
        if (res) {
            return res;
        }
    } catch (error) {
        console.log(error);
    }
}
import axios from "axios"

export const getSalaryData = async () => {
    try {
        const res = await axios.get("/api/salaryexpenses");
        if(res){
            return res;
        }
    } catch (error) {
        console.log(error);
    }
}

export const deleteSalaryData = async (id:string) => {
    try {
        const res = await axios.delete(`/api/salaryexpenses/${id}`);
        if (res) {
            return res;
        }
    } catch (error) {
        console.log(error);
    }
}
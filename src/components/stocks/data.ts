import axios from "axios"

export const getStocknames = async () => {
    let newSet = new Set();
    try {
        const res = await axios.get("/api/stocknames");
        for (let index = 0; index < Object.values(res.data[0]).length; index++) {
            if (index > 0 && index < 8) {
                newSet.add(Object.values(res.data[0])[index])
              }
        }
        return newSet;
    } catch (error) {
        
    }
}

export const getStockDatas = async () => {
    try {
        const res = await axios.get("/api/stockdata");
        if(res){
            return res;
        }
    } catch (error) {
        console.log(error);
    }
}
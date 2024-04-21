import axios from "axios";

export const getStocknames = async () => {
  try {
    const res = await axios.get("/api/stocknames");
    return res;
  } catch (error) {}
};

export const getStockDatas = async () => {
  try {
    const res = await axios.get("/api/stockdata");
    if (res) {
      return res;
    }
  } catch (error) {
    console.log(error);
  }
};

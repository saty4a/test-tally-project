import axios from "axios";

export async function getStockAmounts() {
  try {
    const res = await axios.get("/api/stocktransaction");
    if (res) {
      return res;
    }
  } catch (error) {
    console.log(error);
  }
}

export async function deleteStockAmount(id: string) {
  try {
    const res = await axios.delete(`/api/stocktransaction/${id}`);
    if (res) {
      return res;
    }
  } catch (error) {
    console.log(error);
  }
}

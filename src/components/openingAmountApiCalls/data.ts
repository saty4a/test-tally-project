import axios from "axios";

export const addOpeningAmount = async (id: string, amount: number) => {
  try {
    const res = await axios.put(`/api/add-opening-amount/${id}`, {
      closingAmount: amount,
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const getOpeningAmount = async () => {
  try {
    const res = await axios.get("/api/latest-opening-amount");
    return res;
  } catch (error) {
    console.log(error);
  }
};

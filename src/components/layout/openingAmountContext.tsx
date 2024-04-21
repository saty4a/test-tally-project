import { createContext, useContext, useState } from "react";

interface Props {
  children: React.ReactNode;
}

interface AmountContext {
  previousAmount: openingDataType;
  setPreviousAmount: Function;
}

export interface openingDataType {
  id: string;
  currentAccount: number;
  cbfs: number;
  cash: number;
  others: number;
  openingAmount: number;
  createdAt: Date;
  gst1: number;
  gst2: number;
  closingAmount: number;
}

const obj = {
  id: "",
  currentAccount: 0,
  cbfs: 0,
  cash: 0,
  others: 0,
  openingAmount: 0,
  closingAmount: 0,
  createdAt: new Date(),
  gst1: 0,
  gst2: 0,
};

export const GlobalAmountContext = createContext<AmountContext>({
  previousAmount: obj,
  setPreviousAmount: () => {},
});

export const GlobalProvider = ({ children }: Props) => {
  const [previousAmount, setPreviousAmount] = useState<openingDataType>(obj);

  return (
    <GlobalAmountContext.Provider
      value={{
        previousAmount: previousAmount,
        setPreviousAmount: setPreviousAmount,
      }}
    >
      {children}
    </GlobalAmountContext.Provider>
  );
};

export const useGlobalAmountContext = () => {
  return useContext(GlobalAmountContext);
};

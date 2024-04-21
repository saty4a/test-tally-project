import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
  Select,
  SelectItem,
} from "@nextui-org/react";

interface stockData {
  addStockData: object;
  updateStocks: Function;
}

export const AddStocksCode = ({ setIsAdded }: { setIsAdded: Function }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [addStockCode, setStockData] = useState({
    P1: "",
    P2: "",
    P3: "",
    P4: "",
    P5: "",
    P6: "",
    P7: "",
  });

  const updateStocks = (key: string, value: number) => {
    setStockData({ ...addStockCode, [key]: value });
  };

  const addStockCodes = async () => {
    if (
      addStockCode.P1 === "" ||
      addStockCode.P2 === "" ||
      addStockCode.P3 === "" ||
      addStockCode.P4 === "" ||
      addStockCode.P5 === "" ||
      addStockCode.P6 === "" ||
      addStockCode.P7 === ""
    ) {
      Swal.fire({
        icon: "error",
        title: "oops...",
        text: `All fields are required`,
        showConfirmButton: false,
        timer: 1000,
      });
      return;
    }

    try {
      const res = await axios.post("/api/stocknames", addStockCode);
      if (res.data.error) {
        Swal.fire({
          icon: "error",
          title: "oops...",
          text: `Server Error: ${res.data.error}`,
          showConfirmButton: false,
          timer: 1500,
        });
      }

      if (!res.data.error) {
        Swal.fire({
          icon: "success",
          title: "Success.",
          text: `stocks name added successfully`,
          showConfirmButton: false,
          timer: 1500,
        });
        setIsAdded(true);
        onClose();
        setStockData({
          P1: "",
          P2: "",
          P3: "",
          P4: "",
          P5: "",
          P6: "",
          P7: "",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "oops...",
        text: `Error details ${error}`,
        showConfirmButton: false,
        timer: 1000,
      });
    }
  };

  return (
    <div>
      <Button onPress={onOpen} color="primary">
        Add Stocks code
      </Button>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        placement="bottom-center"
        style={{ width: "600px" }}
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            Add Stock code
          </ModalHeader>
          <ModalBody>
            <StocksOptions
              addStockData={addStockCode}
              updateStocks={updateStocks}
            />
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" color="danger" onClick={onClose}>
              Close
            </Button>
            <Button
              onClick={() => {
                addStockCodes();
              }}
            >
              Add Stock
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

const StocksOptions = ({ addStockData, updateStocks }: stockData) => {
  const AddstocksData = ["P1", "P2", "P3", "P4", "P5", "P6", "P7"];

  const [opening, setOpeningData] = useState("");

  return (
    <div className="grid gap-4">
      <div className="flex items-center gap-3">
        <Select
          label="stocks"
          onChange={(e) => {
            setOpeningData(e.target.value);
          }}
        >
          {AddstocksData &&
            AddstocksData.map((data, index) => (
              <SelectItem key={data}>{data}</SelectItem>
            ))}
        </Select>
        <Input
          type="text"
          className="h-[3rem]"
          onChange={(e) => {
            updateStocks(opening, e.target.value);
          }}
          placeholder="stock code"
        />
      </div>
      {addStockData && (
        <>
          <p>P1: {addStockData["P1" as keyof typeof addStockData]}</p>
          <p>P2: {addStockData["P2" as keyof typeof addStockData]}</p>
          <p>P3: {addStockData["P3" as keyof typeof addStockData]}</p>
          <p>P4: {addStockData["P4" as keyof typeof addStockData]}</p>
          <p>P5: {addStockData["P5" as keyof typeof addStockData]}</p>
          <p>P6: {addStockData["P6" as keyof typeof addStockData]}</p>
          <p>P7: {addStockData["P7" as keyof typeof addStockData]}</p>
        </>
      )}
    </div>
  );
};

import React, { useEffect, useState } from "react";
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
import axios from "axios";
import Swal from "sweetalert2";

interface stockData {
  stockNames: [];
  updateStocks: Function;
}

export const AddStocks = ({
  stockNames,
  setIsAdded,
}: {
  stockNames: any;
  setIsAdded: Function;
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [addStockData, setStockData] = useState({
    opening_0: 0,
    opening_1: 0,
    opening_2: 0,
    opening_3: 0,
    opening_4: 0,
    opening_5: 0,
    opening_6: 0,
    closing_0: 0,
    closing_1: 0,
    closing_2: 0,
    closing_3: 0,
    closing_4: 0,
    closing_5: 0,
    closing_6: 0,
  });
  const [finalData, setFinalData] = useState({});
  const [openingValue, setOpeningValue] = useState(0);

  const updateStocks = (key: string, value: number) => {
    console.log(openingValue, "openingValue");
    if (key !== "") {
      setStockData({ ...addStockData, [key]: value });
      if (key.includes("closing")) {
        let newKey = key.split("_")[1];
        setFinalData({
          ...finalData,
          [`final_${newKey}`]: openingValue - value,
        });
      } else {
        setOpeningValue(value);
      }
    }
  };

  const addStocksData = async () => {
    try {

      const obj = { ...addStockData, ...finalData };
      const res = await axios.post("/api/stockdata", obj);
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
          text: `stocks data added successfully`,
          showConfirmButton: false,
          timer: 1500,
        });
        setIsAdded(true);
        onClose();
        setStockData({
          opening_0: 0,
          opening_1: 0,
          opening_2: 0,
          opening_3: 0,
          opening_4: 0,
          opening_5: 0,
          opening_6: 0,
          closing_0: 0,
          closing_1: 0,
          closing_2: 0,
          closing_3: 0,
          closing_4: 0,
          closing_5: 0,
          closing_6: 0,
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
        Add Stock
      </Button>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        placement="bottom-center"
        style={{ width: "600px" }}
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">Add Stock</ModalHeader>
          <ModalBody>
            <StocksOptions
              stockNames={stockNames}
              updateStocks={updateStocks}
            />
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" color="danger" onClick={onClose}>
              Close
            </Button>
            <Button
              onClick={() => {
                addStocksData();
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

const StocksOptions = ({
  stockNames,
  updateStocks,
}: stockData) => {

  const [opening, setOpeningData] = useState("");

  const [closing, setClosingData] = useState("");

  return (
    <div className="grid gap-4">
      <Input
        type="date"
        onChange={(e) => updateStocks("date", e.target.value)}
      />
      <div className="flex items-center gap-3">
        <Select
          label="opening stocks"
          onChange={(e) => {
            setOpeningData(e.target.value);
          }}
        >
          {stockNames &&
            stockNames.map((data, index) => (
              <SelectItem key={`opening_${index}`} value={data}>
                {data}
              </SelectItem>
            ))}
        </Select>
        <Input
          type="number"
          className="h-[3rem]"
          onChange={(e) => {
            updateStocks(opening, e.target.value);
          }}
          placeholder="opening stocks"
        />
      </div>
      <div className="flex items-center gap-3">
        <Select
          label="closing stocks"
          onChange={(e) => {
            setClosingData(e.target.value);
          }}
        >
          {stockNames &&
            stockNames.map((data, index) => (
              <SelectItem key={`closing_${index}`}>{data}</SelectItem>
            ))}
        </Select>
        <Input
          type="number"
          placeholder="closing stocks"
          onChange={(e) => {
            updateStocks(closing, e.target.value);
          }}
        />
      </div>
    </div>
  );
};

import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import axios from "axios";

import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

interface stockData {
  openingData: amountDataType;
  updateStocks: Function;
}

interface amountDataType {
  openingAmount: number;
  gst1: number;
  gst2: number;
}

export const AddOpeningAmount = ({
  previousTotal,
  setIsAdded,
}: {
  previousTotal: any;
  setIsAdded: Function;
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [openingData, setOpeningData] = useState({
    openingAmount: 0,
    gst1: 0,
    gst2: 0,
  });

  const updateStocks = (key: string, value: number) => {
    setOpeningData({ ...openingData, [key]: value });
  };

  const handleOpeningAmount = async () => {
    if (
        openingData.gst1 === 0 ||
        openingData.openingAmount === 0 ||
        openingData.gst2 === 0
      ) {
        Swal.fire({
          icon: "error",
          title: "oops...",
          text: `all fields are required`,
          showConfirmButton: false,
          timer: 1000,
        });
        return;
      }
      try {
        const res = await axios.post("/api/add-opening-amount", openingData);
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
            text: `opening Data added successfully`,
            showConfirmButton: false,
            timer: 1500,
          });
          setIsAdded(true);
          onClose();
          setOpeningData({
            openingAmount: res.data.data.opening | 0,
            gst1: 0,
            gst2: 0,
          });
        }
        console.log(res)
      } catch (error) {
        console.log(error);
        Swal.fire({
          icon: "error",
          title: "oops...",
          text: `Error details ${error}`,
          showConfirmButton: false,
          timer: 1000,
        });
      }
  }

  useEffect(() => {
    setOpeningData({...openingData, openingAmount: previousTotal.openingAmount, gst1: previousTotal.gst1, gst2: previousTotal.gst2})
  },[previousTotal])

  return (
    <>
      <Button onPress={onOpen} color="primary">
        Add Opening data
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
              openingData={openingData}
              updateStocks={updateStocks}
            />
            <p>openingAmount: {openingData.openingAmount}</p>
            <p>GST 1: {openingData.gst1}</p>
            <p>GST 2: {openingData.gst2}</p>
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" color="danger" onClick={onClose}>
              Close
            </Button>
            <Button
              onClick={() => {
                handleOpeningAmount()
              }}
            >
              Add Stock
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

const StocksOptions = ({ openingData, updateStocks }: stockData) => {
  return (
    <div className="grid gap-4">
      <Input
        isClearable
        required
        type="number"
        label="opening amount"
        variant="bordered"
        value={`${openingData.openingAmount}`}
        min={0}
        onChange={(e) =>
          updateStocks("openingAmount", parseInt(e.target.value))
        }
      />
      <div className="flex items-center gap-3">
        <Input
          isClearable
          type="number"
          className="h-[3rem]"
          label="GST 1"
          variant="bordered"
          min={0}
          onChange={(e) => {
            updateStocks("gst1", parseInt(e.target.value));
          }}
        />
        <Input
          isClearable
          type="number"
          className="h-[3rem]"
          label="GST 2"
          variant="bordered"
          min={0}
          onChange={(e) => {
            updateStocks("gst2", parseInt(e.target.value));
          }}
        />
      </div>
    </div>
  );
};

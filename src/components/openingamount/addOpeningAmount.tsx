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

import React, { useEffect, useMemo, useRef, useState } from "react";
import Swal from "sweetalert2";

interface stockData {
  openingData: amountDataType;
  updateStocks: Function;
}

interface amountDataType {
  currentAccount: number;
  cbfs: number;
  cash: number;
  others: number;
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
    currentAccount: 0,
    cbfs: 0,
    cash: 0,
    others: 0,
    openingAmount: 0,
    gst1: 0,
    gst2: 0,
  });
  const countRef= useRef(0);

  const updateStocks = (key: string, value: number) => {
    countRef.current = 1;
    if (isNaN(value)) {
      setOpeningData({ ...openingData, [key]: 0 });
      return;
    }
    setOpeningData({ ...openingData, [key]: value });
  };

  const handleOpeningAmount = async () => {
    if (
      openingData.gst1 === 0 ||
      openingData.currentAccount === 0 ||
      openingData.cbfs === 0 ||
      openingData.cash === 0 ||
      openingData.others === 0 ||
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

    const totalAmount =
      openingData.cash +
      openingData.cbfs +
      openingData.currentAccount +
      openingData.openingAmount +
      openingData.others;

    const obj = {
      ...openingData,
      openingAmount: totalAmount,
      closingAmount: totalAmount,
    };
    setOpeningData({ ...openingData, openingAmount: totalAmount });

    const result = await Swal.fire({
      title: "Are you sure?",
      text: `You won't be able to revert this! total- ${totalAmount}`,
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, add it!",
    });
    if (result.isConfirmed) {
      await sendOpeningAmount(obj);
    }
  };

  const sendOpeningAmount = async (obj: any) => {
    try {
      const res = await axios.post("/api/add-opening-amount", obj);
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
          currentAccount: 0,
          cbfs: 0,
          cash: 0,
          others: 0,
          openingAmount: res.data.data.opening | 0,
          gst1: 0,
          gst2: 0,
        });
      }
      console.log(res);
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
  };

  // useEffect(() => {
  //   const timeId = setTimeout(() => {
  //     totalRef.current =
  //       openingData.cash +
  //       openingData.cbfs +
  //       openingData.currentAccount +
  //       openingData.openingAmount +
  //       openingData.others;
  //   }, 1000);
  //   return () => clearTimeout(timeId);
  // }, [openingData, setOpeningData]);

  const total = useMemo(() => {
    if(countRef.current > 0){
      return (
        openingData.cash +
        openingData.cbfs +
        openingData.currentAccount +
        openingData.openingAmount +
        openingData.others
      );
    }
    else{
      return 0;
    }
  }, [openingData, setOpeningData]);

  useEffect(() => {
    setOpeningData({
      ...openingData,
      cash: previousTotal.cash ? previousTotal.cash : 0,
      openingAmount: previousTotal.closingAmount
        ? previousTotal.closingAmount
        : 0,
      gst1: previousTotal.gst1 ? previousTotal.gst1 : 0,
      gst2: previousTotal.gst2 ? previousTotal.gst2 : 0,
    });
  }, [previousTotal]);

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
          <ModalHeader className="flex flex-col gap-1">Add Balance</ModalHeader>
          <ModalBody>
            <StocksOptions
              openingData={openingData}
              updateStocks={updateStocks}
            />
            <p>Current Account: {openingData.currentAccount}</p>
            <p>CBFS Amount: {openingData.cbfs}</p>
            <p>Cash Amount: {openingData.cash}</p>
            <p>Others Amount: {openingData.others}</p>
            <p>opening Amount: {total}</p>
            <p>GST 1: {openingData.gst1}</p>
            <p>GST 2: {openingData.gst2}</p>
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" color="danger" onClick={onClose}>
              Close
            </Button>
            <Button
              onClick={() => {
                handleOpeningAmount();
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
    <div className="grid grid-2 gap-4">
      <div className="flex items-center gap-3">
        <Input
          isClearable
          required
          type="number"
          label="Current Account"
          variant="bordered"
          value={`${openingData.currentAccount}`}
          min={0}
          onChange={(e) =>
            updateStocks("currentAccount", parseInt(e.target.value))
          }
        />
        <Input
          isClearable
          required
          type="number"
          label="CBFS Amount"
          variant="bordered"
          value={`${openingData.cbfs}`}
          min={0}
          onChange={(e) => updateStocks("cbfs", parseInt(e.target.value))}
        />
      </div>
      <div className="flex items-center gap-3">
        <Input
          isClearable
          required
          type="number"
          label="Cash Amount"
          variant="bordered"
          value={`${openingData.cash}`}
          min={0}
          onChange={(e) => updateStocks("cash", parseInt(e.target.value))}
        />
        <Input
          isClearable
          required
          type="number"
          label="Others Amount"
          variant="bordered"
          value={`${openingData.others}`}
          min={0}
          onChange={(e) => updateStocks("others", parseInt(e.target.value))}
        />
      </div>
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
    </div>
  );
};

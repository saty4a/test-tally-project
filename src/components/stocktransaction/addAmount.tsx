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
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

interface stockData {
  amountData: amountDataType;
  updateStocks: Function;
}

interface amountDataType {
  date: string;
  openingAmount: number;
  cylinders: number;
  loadAmount: number;
  soldCylinders: number;
  soldAmount: number;
  total: number;
}

export const AddAmount = ({previousTotal, setIsAdded} : {previousTotal: number; setIsAdded: Function;}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [amountData, setAmountData] = useState({
    date: "",
    openingAmount: previousTotal | 0,
    cylinders: 0,
    loadAmount: 0,
    soldCylinders: 0,
    soldAmount: 0,
    total: 0,
  });
  let totalAmount = 0;

  const updateStocks = (key: string, value: number) => {
    if (key === 'soldAmount') {
      if(amountData.openingAmount < amountData.loadAmount){
        Swal.fire({
          icon: "error",
          title: "oops...",
          text: `opening amount cannot be less than load amount`,
          showConfirmButton: false,
          timer: 1500,
        });
        return;
      }
      totalAmount = (amountData.openingAmount - amountData.loadAmount) + (value);
    }
    // if(key === 'openingAmount'){
    //   setAmountData({ ...amountData, [key]: amountData.openingAmount + value, total: totalAmount });
    //   return;
    // }
    setAmountData({ ...amountData, [key]: value, total: totalAmount });
  };


  const addAmountData = async () => {
    if (
      amountData.date === "" ||
      amountData.openingAmount === 0 ||
      amountData.soldAmount === 0 ||
      amountData.soldCylinders === 0 ||
      amountData.total === 0
    ) {
      Swal.fire({
        icon: "error",
        title: "oops...",
        text: `required fields should be`,
        showConfirmButton: false,
        timer: 1000,
      });
      return;
    }
    try {
      const res = await axios.post('/api/stocktransaction', amountData);
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
          text: `stocks amount added successfully`,
          showConfirmButton: false,
          timer: 1500,
        });
        setIsAdded(true);
        onClose();
        setAmountData({
          date: "",
          openingAmount: res.data.data.total | 0,
          cylinders: 0,
          loadAmount: 0,
          soldCylinders: 0,
          soldAmount: 0,
          total: 0,
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
    setAmountData({ ...amountData, openingAmount: previousTotal });
  },[previousTotal])

  return (
    <>
      <Button onPress={onOpen} color="primary">
        Add Transaction data
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
            <StocksOptions amountData={amountData} updateStocks={updateStocks} />
            <p>Total: {amountData.total}</p>
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" color="danger" onClick={onClose}>
              Close
            </Button>
            <Button
              onClick={() => {
                // addStocksData();
                addAmountData();
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

const StocksOptions = ({amountData, updateStocks }: stockData) => {
  return (
    <div className="grid gap-4">
      <Input
        type="date"
        label="date"
        variant="bordered"
        onChange={(e) => updateStocks("date", e.target.value)}
      />
      <Input
        isClearable
        required
        type="number"
        label="opening amount"
        variant="bordered"
        value={`${amountData.openingAmount}`}
        min={0}
        onChange={(e) => updateStocks("openingAmount", parseInt(e.target.value))}
      />
      <div className="flex items-center gap-3">
        <Input
          isClearable
          type="number"
          className="h-[3rem]"
          label="Total Cylinders"
          variant="bordered"
          min={0}
          onChange={(e) => {
            updateStocks("cylinders", parseInt(e.target.value));
          }}
          placeholder="cylinders"
        />
        <Input
          isClearable
          type="number"
          className="h-[3rem]"
          label="Total Load Amount"
          variant="bordered"
          min={0}
          onChange={(e) => {
            updateStocks("loadAmount", parseInt(e.target.value));
          }}
          placeholder="load Amount"
        />
      </div>
      <div className="flex items-center gap-3">
        <Input
          isClearable
          required
          type="number"
          className="h-[3rem]"
          label="Sold Cylinders"
          variant="bordered"
          min={0}
          onChange={(e) => {
            updateStocks("soldCylinders", parseInt(e.target.value));
          }}
          placeholder="sold Cylinders"
        />
        <Input
          isClearable
          required
          type="number"
          className="h-[3rem]"
          label="Sold Amount"
          placeholder="Sold Amount"
          variant="bordered"
          min={0}
          onChange={(e) => {
            updateStocks("soldAmount", parseInt(e.target.value));
          }}
        />
      </div>
    </div>
  );
};

// const StocksOptions = ({
//     stockNames,
//     updateStocks,
//   }: stockData) => {

//     const [opening, setOpeningData] = useState("");

//     const [closing, setClosingData] = useState("");

//     return (
//       <div className="grid gap-4">
//         <Input
//           type="date"
//           onChange={(e) => updateStocks("date", e.target.value)}
//         />
//         <div className="flex items-center gap-3">
//           <Select
//             label="opening stocks"
//             onChange={(e) => {
//               setOpeningData(e.target.value);
//             }}
//           >
//             {stockNames &&
//               stockNames.map((data, index) => (
//                 <SelectItem key={`opening_${index}`} value={data}>
//                   {data}
//                 </SelectItem>
//               ))}
//           </Select>
//           <Input
//             type="number"
//             className="h-[3rem]"
//             onChange={(e) => {
//               updateStocks(opening, e.target.value);
//             }}
//             placeholder="opening stocks"
//           />
//         </div>
//         <div className="flex items-center gap-3">
//           <Select
//             label="closing stocks"
//             onChange={(e) => {
//               setClosingData(e.target.value);
//             }}
//           >
//             {stockNames &&
//               stockNames.map((data, index) => (
//                 <SelectItem key={`closing_${index}`}>{data}</SelectItem>
//               ))}
//           </Select>
//           <Input
//             type="number"
//             placeholder="closing stocks"
//             onChange={(e) => {
//               updateStocks(closing, e.target.value);
//             }}
//           />
//         </div>
//       </div>
//     );
//   };
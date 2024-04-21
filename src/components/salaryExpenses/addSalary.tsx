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
import { MutableRefObject, useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import { addOpeningAmount } from "../openingAmountApiCalls/data";

interface stockData {
  salaryAmountData: amountDataType;
  updateSalaryExpenditure: Function;
  type: MutableRefObject<string>;
}

interface amountDataType {
  date: string;
  openingAmount: number;
  total: number;
}

export const AddSalary = ({
  previousTotal,
  previousId,
  setIsAdded,
}: {
  previousTotal: number;
  previousId: string;
  setIsAdded: Function;
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [salaryAmountData, setSalaryAmountData] = useState({
    date: "",
    openingAmount: 0,
    total: 0,
  });
  // const price = useRef(0);
  const type = useRef<string>("");

  const updateSalaryExpenditure = (value: number) => {
    // price.current = value;
    setSalaryAmountData({ ...salaryAmountData, [type.current]: value });
  };

  const addExpenditureData = async () => {
    if (salaryAmountData.date === "" || salaryAmountData.openingAmount === 0) {
      Swal.fire({
        icon: "error",
        title: "oops...",
        text: `required fields should be filled`,
        showConfirmButton: false,
        timer: 1000,
      });
      return;
    }

    let totalAmount = 0;
    const values = Object.values(salaryAmountData);
    for (let index = 1; index < values.length; index++) {
      if (
        salaryAmountData.openingAmount !== values[index] &&
        salaryAmountData.total !== values[index]
      ) {
        totalAmount = totalAmount + +values[index];
      }
    }
    const finalAmount = salaryAmountData.openingAmount - totalAmount;
    setSalaryAmountData({ ...salaryAmountData, total: finalAmount });
    const obj = { ...salaryAmountData, total: finalAmount };
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `You won't be able to revert this! total- ${finalAmount}`,
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, add it!",
    });
    if (result.isConfirmed) {
      await sendExpenditureData(finalAmount, obj);
    }
  };

  const sendExpenditureData = async (finalAmount: number, obj: any) => {
    try {
      await addOpeningAmount(previousId, finalAmount);
      const res = await axios.post("/api/salaryexpenses", { salary: obj });
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
        setSalaryAmountData({
          date: "",
          openingAmount: res.data.data.total | 0,
          total: 0,
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

  useEffect(() => {
    setSalaryAmountData({ ...salaryAmountData, openingAmount: previousTotal });
  }, [previousTotal]);

  return (
    <>
      <Button onPress={onOpen} color="primary">
        Add Salary Expenditure data
      </Button>
      <Modal
        backdrop="blur"
        isOpen={isOpen}
        onClose={onClose}
        placement="bottom-center"
        style={{ width: "600px" }}
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">Add Salary Expenditure data</ModalHeader>
          <ModalBody>
            <StocksOptions
              salaryAmountData={salaryAmountData}
              updateSalaryExpenditure={updateSalaryExpenditure}
              type={type}
            />
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" color="danger" onClick={onClose}>
              Close
            </Button>
            <Button
              onClick={() => {
                addExpenditureData();
              }}
            >
              Add Data
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

const StocksOptions = ({
  salaryAmountData,
  updateSalaryExpenditure,
  type,
}: stockData) => {
  return (
    <div className="grid gap-4">
      <Input
        type="date"
        label="date"
        variant="bordered"
        onChange={(e) => {
          (type.current = "date"), updateSalaryExpenditure(e.target.value);
        }}
      />
      <Input
        isClearable
        required
        type="number"
        label="opening amount"
        variant="bordered"
        value={`${salaryAmountData.openingAmount}`}
        min={0}
        onChange={(e) => {
          (type.current = "openingAmount"),
            updateSalaryExpenditure(parseInt(e.target.value));
        }}
      />
      <div className="flex items-center gap-3">
        <Input
          required
          type="text"
          className="h-[3rem]"
          label="Employee names"
          variant="bordered"
          onChange={(e) => {
            type.current = e.target.value;
          }}
          // placeholder="Daily Expenditure type"
        />
        <Input
          required
          type="number"
          className="h-[3rem]"
          label="Salary Amount"
          // placeholder="Expenditure Amount"
          variant="bordered"
          min={0}
          onChange={(e) => {
            updateSalaryExpenditure(parseInt(e.target.value));
          }}
        />
      </div>
    </div>
  );
};

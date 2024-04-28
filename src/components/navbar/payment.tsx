import React from "react";
import {Popover, PopoverTrigger, PopoverContent, Button} from "@nextui-org/react";
import Image from "next/image";

export const Payment = () => {

    const content = (
        <PopoverContent>
            {(titleprops) => (
                <div className="flex flex-col gap-5 items-center">
                <h4 {...titleprops} className="mt-5">Upi Qr Code</h4>
                <Image src="/upi-qr-code.jpeg" alt="upi-qr-code" width={300} height={300} />
                {/* <a href="upi://pay?pa=yourname@bankname&cu=INR">
                    <button type="button">Click to Pay</button>
                </a> */}
                <p className="mb-5">phone No: 8249162635</p>
                </div>
            )}
        </PopoverContent>
    )

    return(
        <>
        <Popover
        showArrow
        offset={10}
        placement="bottom"
        backdrop="blur"
        >
            <PopoverTrigger>
                <Button>
                   Payment     
                </Button>
            </PopoverTrigger>
            {content}
        </Popover>
        </>
    )
}
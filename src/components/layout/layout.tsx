import React from "react"
import NavBarWrapper from "../navbar/navbar";
import { Footer } from "../footer/footer";

interface Props {
    children: React.ReactNode;
  }

export const Layout = ({ children }: Props) => {
    const [sidebarOpen, setSidebarOpen] = React.useState(false);
    return(
        <div className="flex flex-col min-h-screen">
        <NavBarWrapper>
        {children}
        </NavBarWrapper>
        <Footer />
        </div>
    )
}
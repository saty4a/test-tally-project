import React from "react"
import NavBarWrapper from "../navbar/navbar";

interface Props {
    children: React.ReactNode;
  }

export const Layout = ({ children }: Props) => {
    const [sidebarOpen, setSidebarOpen] = React.useState(false);
    return(
        <div className="flex">
        <NavBarWrapper>
        {children}
        </NavBarWrapper>
        </div>
    )
}
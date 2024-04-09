import React from "react";

import {
  Navbar,
  NavbarMenuToggle,
  NavbarMenuItem,
  NavbarMenu,
  NavbarContent,
  NavbarItem,
  Link,
} from "@nextui-org/react";
import { UserDropdown } from "./user-dropdown";
import { usePathname } from "next/navigation";
import { DarkModeSwitch } from "./darkmodeswitch";

interface Props {
  children: React.ReactNode;
}

const NavBarWrapper = ({ children }: Props) => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const menuItems = [
    {
      label: "Home",
      link: "/",
    },
    {
      label: "Stock Transactions",
      link: "/stocks",
    },
    {
      label: "Transaction",
      link: "/stocktransaction",
    },
    {
      label: "Daily Expenses",
      link: "/dailyexpenses"
    },
    {
      label: "Daily Expenses",
      link: "/dailyexpenses"
    },
    {
      label: "Salary Expenses",
      link: "/salaryexpenses"
    }
  ];

  return (
    <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
      <Navbar
        isBordered
        isMenuOpen={isMenuOpen}
        onMenuOpenChange={setIsMenuOpen}
        classNames={{
          wrapper: "w-full max-w-full",
        }}
      >
        <NavbarContent className="sm:hidden" justify="start">
          <NavbarMenuToggle
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          />
        </NavbarContent>

        <NavbarContent className="hidden sm:flex gap-4" justify="center">
          <NavbarItem 
          isActive={pathname === "/" ? true : false}
          >
            <Link color={pathname === "/" ? "primary" : "foreground"} href="/">
              Home
            </Link>
          </NavbarItem>
          <NavbarItem 
          isActive={pathname === "/stocks" ? true : false}
          >
            <Link color={pathname === "/stocks" ? "primary" : "foreground"} href="/stocks" aria-current="page">
              Stocks
            </Link>
          </NavbarItem>
          <NavbarItem
            isActive={pathname === "/stocktransaction" ? true : false}
          >
            <Link color={pathname === "/stocktransaction" ? "primary" : "foreground"} href="/stocktransaction">
              Stock Transactions
            </Link>
          </NavbarItem>
          <NavbarItem
            isActive={pathname === "/dailyexpenses" ? true : false}
          >
            <Link color={pathname === "/dailyexpenses" ? "primary" : "foreground"} href="/dailyexpenses">
              Daily Expenses
            </Link>
          </NavbarItem>
          <NavbarItem
            isActive={pathname === "/salaryexpenses" ? true : false}
          >
            <Link color={pathname === "/salaryexpenses" ? "primary" : "foreground"} href="/salaryexpenses">
              Salary Expenses
            </Link>
          </NavbarItem>
        </NavbarContent>
        <NavbarContent justify="end">
          <DarkModeSwitch />
          <UserDropdown />
        </NavbarContent>
        <NavbarMenu>
          {menuItems.map((item, index) => (
            <NavbarMenuItem
              key={`${item}-${index}`}
              isActive={pathname === item.link ? true : false}
            >
              <Link className="w-full" href={item.link} size="lg">
                {item.label}
              </Link>
            </NavbarMenuItem>
          ))}
        </NavbarMenu>
      </Navbar>
      {children}
    </div>
  );
};

export default NavBarWrapper;

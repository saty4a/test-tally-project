import Inventory2Icon from "@mui/icons-material/Inventory2";
import PaymentsIcon from "@mui/icons-material/Payments";
import { usePathname } from "next/navigation";
import SidebarItem from "./sidebarItem";

const Sidebar = () => {
  const pathname = usePathname();
  const sidebarItems = [
    {
      title: "stocks",
      icon: <Inventory2Icon sx={{ color: "#71717A" }} />,
      href: "/stocks",
    },

    {
      title: "transaction",
      icon: <PaymentsIcon sx={{ color: "#71717A" }} />,
      href: "#",
    },
  ];
  return (
    <aside className="min-h-screen z-[202] sticky top-0 flex flex-col gap-2">
      {sidebarItems &&
        sidebarItems.map((data, index) => (
          <SidebarItem
            title={data.title}
            icon={data.icon}
            href={data.href}
            isActive={pathname === data.href}
          />
        ))}
    </aside>
  );
};

export default Sidebar;

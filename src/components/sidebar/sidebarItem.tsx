import Link from "next/link";
import React from "react";

interface Props {
  title: string;
  icon: React.ReactNode;
  isActive?: boolean;
  href?: string;
}

const SidebarItem = ({ icon, title, isActive, href }: Props) => {
  return (
    <Link
      href={`${href}`}
      className="text-default-900 active:bg-none max-w-full"
    >
      <div
        className={`flex gap-2 min-h-[44px] items-center px-3.5 rounded-xl cursor-pointer transition-all duration-150 active:scale-[0.98] ${
          isActive && isActive
            ? "bg-primary-100 [&_svg_path]:fill-primary-500"
            : "hover:bg-default-100"
        }`}
      >
        {icon}
        <span className="text-default-900">{title}</span>
      </div>
    </Link>
  );
};

export default SidebarItem;

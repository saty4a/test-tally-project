import { UserButton, useUser } from "@clerk/nextjs";

export const UserDropdown = () => {
  return (
    <div className="profile flex items-center">
      <UserButton />
    </div>
  );
};

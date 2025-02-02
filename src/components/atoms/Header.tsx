// components/ui/Header.tsx
import { Button } from "@/components/ui/button";
import { Settings, Bell } from "lucide-react"; // Example icons

export const Header = () => {
  return (
    <header className="flex items-center justify-between p-4 bg-gray-800 text-white shadow-md">
      {/* Left Side - Title */}
      <h1 className="text-xl font-semibold">Admin Dashboard</h1>

      {/* Right Side - Notifications and Profile Settings */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" className="text-white">
          <Bell className="h-5 w-5" />
        </Button>
        <Button variant="ghost" className="text-white">
          <Settings className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
};

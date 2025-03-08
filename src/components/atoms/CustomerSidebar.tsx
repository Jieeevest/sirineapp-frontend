import React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { Home, ShoppingCart, FileText } from "lucide-react";
import { NavUser } from "./NavUser";

const prefix = "/customer";

const transactionalItems = [
  {
    title: "Dashboard",
    url: `${prefix}/dashboard`,
    icon: Home,
  },
  {
    title: "Catalog",
    url: `/`,
    icon: ShoppingCart,
  },
  {
    title: "Orders",
    url: `${prefix}/orders`,
    icon: FileText,
  },
];
const user = {
  name: localStorage?.getItem("userName"),
  email: localStorage?.getItem("userEmail"),
  role: localStorage?.getItem("userRoleName"),
  avatar: "/avatars/shadcn.jpg",
};
export function CustomerSidebar() {
  return (
    <Sidebar>
      {/* Logo Section */}
      <div className="flex items-center p-4 ">
        <div className="text-2xl font-bold">
          <a
            href="#"
            className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600"
            style={{
              textShadow:
                "2px 2px 4px rgba(0, 0, 0, 0.1), 0 0 25px rgba(0, 0, 0, 0.3), 0 0 50px rgba(0, 0, 0, 0.3)",
            }}
          >
            Gudang Sirine
          </a>
        </div>
      </div>

      {/* Sidebar Content */}
      <SidebarContent>
        {/* Transactional Group */}
        <SidebarGroup>
          <SidebarGroupLabel>Transactional</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {transactionalItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a
                      href={item.url}
                      className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
                    >
                      <item.icon className="h-5 w-5 text-gray-500" />
                      <p className="text-base">{item.title}</p>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}

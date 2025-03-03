import React from "react";
import Image from "next/image";

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

import {
  Home,
  Box,
  ShoppingCart,
  Tag,
  User,
  Users,
  FileText,
} from "lucide-react";
import { NavUser } from "./NavUser";

const prefix = "/admin";

const masterDataItems = [
  {
    title: "Products",
    url: `${prefix}/products`,
    icon: Box,
  },
  {
    title: "Categories",
    url: `${prefix}/categories`,
    icon: Tag,
  },
  {
    title: "Roles",
    url: `${prefix}/roles`,
    icon: Users,
  },
  {
    title: "Users",
    url: `${prefix}/users`,
    icon: User,
  },
];

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
export function AppSidebar() {
  return (
    <Sidebar>
      {/* Logo Section */}
      <div className="flex items-center p-4 bg-gray-50 border-b border-gray-200">
        <Image
          src="/siren.svg"
          alt="App Logo"
          width={10}
          height={10}
          className="h-6 w-6"
        />
        <span className="text-lg font-semibold text-gray-800 pt-1 ml-2">
          Sirine App
        </span>
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

        {/* Master Data Group */}
        {user.role == "Admin" ||
          (user.role == "Super Admin" && (
            <SidebarGroup>
              <SidebarGroupLabel>Master Data</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {masterDataItems.map((item) => (
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
          ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}

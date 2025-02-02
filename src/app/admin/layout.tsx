"use client";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/atoms/AppSidebar";
import { Provider } from "react-redux";
import { store } from "@/store";
import { Header } from "@/components/atoms/Header";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Provider store={store}>
      <SidebarProvider>
        {/* Sidebar */}
        <AppSidebar />
        <main className="flex flex-1 flex-col">
          {/* Header */}
          <Header />
          {/* Sidebar Trigger (optional for mobile) */}
          <SidebarTrigger />
          {/* Main Content */}
          <div className="p-4">{children}</div>
        </main>
      </SidebarProvider>
    </Provider>
  );
}

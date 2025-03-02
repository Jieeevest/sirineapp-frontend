"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { Provider } from "react-redux";
import { store } from "@/store";
import { CustomerSidebar } from "@/components/atoms/CustomerSidebar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Provider store={store}>
      <SidebarProvider>
        {/* Sidebar */}
        <CustomerSidebar />
        <main className="flex flex-1 flex-col">
          <div className="p-4">{children}</div>
        </main>
      </SidebarProvider>
    </Provider>
  );
}

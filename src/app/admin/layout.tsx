"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/atoms/AppSidebar";
import { Provider } from "react-redux";
import { store } from "@/store";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Provider store={store}>
      <SidebarProvider>
        <AppSidebar />
        <main className="flex flex-1 flex-col">
          <div className="p-4">{children}</div>
        </main>
      </SidebarProvider>
    </Provider>
  );
}

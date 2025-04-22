import type { Metadata } from "next";
import "bootstrap/dist/css/bootstrap.min.css"
import Navbar from "@/componets/Navbar";
import { Toaster } from "react-hot-toast";
import { AppProvider } from "@/context/AppProvider";





export const metadata: Metadata = {
  title: "Next App",
  description: "Auth and CRUD next app with Laravel",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
       <AppProvider>
        <Toaster />
          <Navbar />
          {children}
       </AppProvider>
      </body>
    </html>
  );
}

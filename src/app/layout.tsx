import type {Metadata} from "next";
import "./globals.css";
import {montserrat} from "@/app/fonts";

export const metadata: Metadata = {
    title: "Shipment History Timeline",
    description: "Development of Shipment History UI Webpage",
    icons: [
        {
            rel: "icon", url: "./favicon.ico",
        },
        {
            rel: "apple-icon", url: "./apple-touch-icon.png",
        }
    ],

    appleWebApp: {
        capable: true,
        title: "Shipment History Timeline",
        statusBarStyle: "black-translucent"
    },
    manifest: "site.webmanifest",
};

export default function RootLayout({ children }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${montserrat.className} antialiased`}
            >
                {children}
            </body>
        </html>
    );
};

import "./globals.css";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "Better Exams | An Alternative To Examinations.ie",
    keywords: "examinations.ie, exams, leaving cert, junior cert, papers",
    description: "The best way to search for and access exam papers sourced from examinations.ie",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={inter.className}>{children}</body>
            <Analytics />
        </html>
    );
}

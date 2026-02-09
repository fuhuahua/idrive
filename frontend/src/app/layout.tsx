import "./globals.css";
import WalletContextProvider from "@/components/WalletProvider";

export const metadata = {
    title: "Proof of Drive",
    description: "Solana-based Vehicle Identity & Honors System",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className="bg-slate-900 text-white min-h-screen">
                <WalletContextProvider>
                    {children}
                </WalletContextProvider>
            </body>
        </html>
    );
}

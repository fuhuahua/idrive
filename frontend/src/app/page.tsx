"use client";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useState } from "react";
import { Connection, PublicKey } from "@solana/web3.js";
import { getProgram } from "@/utils/anchor-client";

export default function Home() {
    const { publicKey, sendTransaction, wallet } = useWallet();
    const [vehicleId, setVehicleId] = useState("");
    const [loading, setLoading] = useState(false);
    const [logs, setLogs] = useState<string[]>([]);

    const addLog = (log: string) => setLogs((prev) => [...prev, log]);

    const handleRegister = async () => {
        if (!publicKey || !wallet) return;
        setLoading(true);
        addLog("Starting registration...");

        try {
            // In a real app, connection would come from context or hook
            const connection = new Connection("https://api.devnet.solana.com");
            // Cast wallet to any to satisfy AnchorProvider type (it expects a specific interface but wallet adapter is compatible)
            const program = getProgram(connection, wallet.adapter as any);

            // 1. Generate a new Keypair for the Mint (Logic simplified for demo)
            // In a real browser app, we might need to derive a PDA or ask user to sign a separate transaction to create the mint
            // For this demo, we'll simulate the call structure
            addLog("Simulating vehicle registration transaction...");

            // const tx = await program.methods
            //   .initializeVehicle(vehicleId)
            //   .accounts({
            //     authority: publicKey,
            //     // ... other accounts
            //   })
            //   .rpc();

            setTimeout(() => {
                addLog(`Success! Vehicle "${vehicleId}" registered.`);
                addLog("Mint Address: (Simulated) 7Xw...9z");
                setLoading(false);
            }, 1000);

        } catch (err: any) {
            console.error(err);
            addLog("Error: " + err.message);
            setLoading(false);
        }
    };

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
                <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
                    Proof of Drive (PoD) Demo
                </p>
                <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
                    <WalletMultiButton />
                </div>
            </div>

            <div className="grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-2 lg:text-left gap-8">

                {/* Registration Section */}
                <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30">
                    <h2 className={`mb-3 text-2xl font-semibold`}>
                        Register Vehicle{" "}
                        <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                            -&gt;
                        </span>
                    </h2>
                    <div className="flex flex-col gap-4">
                        <input
                            type="text"
                            placeholder="Vehicle VIN / ID"
                            className="p-2 rounded text-black"
                            value={vehicleId}
                            onChange={(e) => setVehicleId(e.target.value)}
                        />
                        <button
                            onClick={handleRegister}
                            disabled={!publicKey || loading}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                        >
                            {loading ? "Processing..." : "Mint Vehicle Identity"}
                        </button>
                        <p className="text-xs text-gray-500">
                            Mints a Token-2022 Non-Transferable NFT
                        </p>
                    </div>
                </div>

                {/* Dashboard Section */}
                <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30">
                    <h2 className={`mb-3 text-2xl font-semibold`}>
                        My Garage{" "}
                        <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                            -&gt;
                        </span>
                    </h2>
                    {publicKey ? (
                        <div className="text-sm opacity-80">
                            <p>Owner: {publicKey.toBase58().substring(0, 6)}...</p>
                            <div className="mt-4 border rounded p-4 bg-slate-800">
                                <p className="font-bold text-lg">Tesla Model 3</p>
                                <p className="text-xs text-green-400">Verified Owner</p>
                                <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                                    <div>Total Distance:</div>
                                    <div className="font-mono">12,450 km</div>
                                    <div>Trips:</div>
                                    <div className="font-mono">342</div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <p className="m-0 max-w-[30ch] text-sm opacity-50">
                            Connect wallet to view your vehicles.
                        </p>
                    )}
                </div>

            </div>

            {/* Logs Console */}
            <div className="w-full max-w-5xl mt-8 p-4 bg-black rounded-lg border border-gray-800 font-mono text-xs h-40 overflow-y-auto">
                <div className="text-gray-400 mb-2">Transaction Logs:</div>
                {logs.map((log, i) => (
                    <div key={i} className="text-green-500">{">"} {log}</div>
                ))}
            </div>
        </main>
    );
}

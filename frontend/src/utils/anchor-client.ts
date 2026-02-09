import { Connection, PublicKey } from "@solana/web3.js";
import { AnchorProvider, Program, Idl, setProvider } from "@coral-xyz/anchor";
import { WalletContextState } from "@solana/wallet-adapter-react";

// In a real app, import the IDL JSON file
// import idl from "../../../anchor/target/idl/pod_program.json";

// Mock IDL for demo purposes if file doesn't exist yet
const IDL: Idl = {
    version: "0.1.0",
    name: "pod_program",
    instructions: [
        {
            name: "initializeVehicle",
            accounts: [
                { name: "authority", isMut: true, isSigner: true },
                { name: "mint", isMut: true, isSigner: false },
                { name: "tokenAccount", isMut: true, isSigner: false },
                { name: "drivingRecord", isMut: true, isSigner: false },
                { name: "tokenProgram", isMut: false, isSigner: false },
                { name: "systemProgram", isMut: false, isSigner: false },
                { name: "rent", isMut: false, isSigner: false },
            ],
            args: [{ name: "vehicleId", type: "string" }],
        },
        {
            name: "recordDrive",
            accounts: [
                { name: "authority", isMut: false, isSigner: true },
                { name: "drivingRecord", isMut: true, isSigner: false },
                { name: "vehicleMint", isMut: false, isSigner: false },
                { name: "owner", isMut: false, isSigner: false },
            ],
            args: [{ name: "distance", type: "u64" }],
        },
    ],
};

export const PROGRAM_ID = new PublicKey(
    "Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS"
);

export const getProgram = (connection: Connection, wallet: any) => {
    const provider = new AnchorProvider(
        connection,
        wallet,
        AnchorProvider.defaultOptions()
    );
    setProvider(provider);
    return new Program(IDL, PROGRAM_ID, provider);
};

import {
    Keypair,
    Transaction,
    SystemProgram,
    LAMPORTS_PER_SOL,
    sendAndConfirmTransaction,
    clusterApiUrl,
    Connection,
    PublicKey
} from "@solana/web3.js"

export async function sendSol(amount, account, receiver) {

    let rKey = new PublicKey(receiver)

    let sKey = new PublicKey(account.addr)

    console.log(rKey)

    console.log("Solana account: a", account)

    let transaction = new Transaction();

    transaction.add(
        SystemProgram.transfer({
            fromPubkey: sKey,
            toPubkey: rKey,
            lamports: amount,
        }),
    );

    let connection = new Connection(clusterApiUrl("testnet"));

    let kp =  Keypair.fromSecretKey(account.sk)


    let data = await sendAndConfirmTransaction(connection, transaction, [kp]);

    return data

}
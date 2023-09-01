import ethers from 'ethers'
// 2. Define network configurations
const providerRPC = {
  moonbeam: {
    name: 'moonbase-alpha',
    rpc: 'https://rpc.api.moonbase.moonbeam.network',
    chainId: 1287, // 0x507 in hex,
  },
};
// 3. Create ethers provider
let provider = new ethers.providers.JsonRpcProvider(
  providerRPC.moonbeam.rpc, 
  {
    chainId: providerRPC.moonbeam.chainId,
    name: providerRPC.moonbeam.name,
  }
);


export async function sendMoon(amount=0, account, receiver) {

    let wallet = new ethers.Wallet(account.sk, provider)

    //console.log(wallet)

    //let balance = await wallet.getBalance()

    //console.log("balance: ", balance)

    let nonce = await wallet.getTransactionCount()

    console.log("nonce:", nonce)

    let txn = 

    {
        // Required unless deploying a contract (in which case omit)
        to: receiver,  // the target address or ENS name
        // These are always optional (but for call, data is usually specified)
        data: "0x",         // extra data for the transaction, or input for call
        value: amount,           // the amount (in wei) this transaction is sending
        chainId: provider.chainId          // the network ID; usually added by a signer
    }

    let data = await wallet.sendTransaction(txn)

    console.log(data)

    return data

}
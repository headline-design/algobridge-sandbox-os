import ethers from 'ethers'


let provider = ethers.getDefaultProvider('goerli');


export async function sendEth(amount=0, account, receiver) {

    let wallet = new ethers.Wallet(account.sk, provider)

    //console.log(wallet)

    //let balance = await wallet.getBalance()

    //console.log("balance: ", balance)

    let nonce = await wallet.getTransactionCount()

    let gasPrice = await provider.getGasPrice()

    let txn = 

    {
        // Required unless deploying a contract (in which case omit)
        to: receiver,  // the target address or ENS name
    
        //These are optional/meaningless for call and estimateGas
        nonce: nonce,           // the transaction nonce
        gasLimit: 25000,        // the maximum gas this transaction may spend
        gasPrice: 25000,        // the price (in wei) per unit of gas
    
        // These are always optional (but for call, data is usually specified)
        data: "0x",         // extra data for the transaction, or input for call
        value: amount,           // the amount (in wei) this transaction is sending
        chainId: provider.chainId          // the network ID; usually added by a signer
    }

    let data = await wallet.sendTransaction(txn)

    console.log(data)

    return data


}
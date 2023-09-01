import { TatumBtcSDK } from '@tatumio/btc';
//import { YOUR_API_KEY_HERE } from '@tatumio/shared-testing-common';
import crypto from 'crypto'


export async function sendBTC(amount, account, receiver) {

    const btcSDK = TatumBtcSDK({ apiKey: "4631e682-ad70-427e-956a-7e17c3e47fa1" });

    // If the source is a list of blockchain addresses

    const bodyFromAddress = {
        fromAddress: [
            {
                address: account.addr,
                privateKey: account.sk,
            },
        ],
        to: [
            {
                address: receiver,
                value: amount,
            },
        ],
        fee: '0.00001',
        changeAddress: receiver//'19T7R7R8ZcgcWmrpSzCXiLs8g8fQsCXRCe',
    };

    console.log(bodyFromAddress)

    // If the source is a list of UTXOs


    const txDataFromAddress = await btcSDK.transaction.sendTransaction(bodyFromAddress, { testnet: true });

    console.log(txDataFromAddress)
    return txDataFromAddress
}

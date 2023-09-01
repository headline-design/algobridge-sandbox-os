import algosdk from "algosdk";

const MainNode = 'https://node.testnet.algoexplorerapi.io';
const indexer = "https://algoindexer.testnet.algoexplorerapi.io/v2/"

const token = '';
const server = MainNode;
const port = '';
const algodclient = new algosdk.Algodv2(token, server, port);

export async function sendAlgos(amount,account,address2){

    let params = await algodclient.getTransactionParams().do()

    console.log(params)

    let txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
        from: account.addr,
        suggestedParams: params,
        to: address2,
        amount: parseInt(amount),
        note: new Uint8Array(Buffer.from("First Bridge TXN"))
      });

     

      let signedTxn = txn.signTxn(account.sk);

      let response = await algodclient.sendRawTransaction(signedTxn).do();

      return response
}
import { ECPairFactory } from 'ecpair';
import * as ecc from 'tiny-secp256k1';
import * as bitcoin from 'bitcoinjs-lib';
import fetch from 'node-fetch';
import algosdk from 'algosdk';
import { sendAlgos } from './sendAlgo.js';
import { sendBTC } from './sendBTC.js';
import { sendSol } from './sendSol.js';
import { sendEth } from './sendEth.js';
import { sendMoon } from './sendMoon.js';
import ethers from 'ethers'
import crypto from 'node:crypto'
import { Keypair, Connection, clusterApiUrl, PublicKey} from '@solana/web3.js'

const minimums = {

    algorand: 2001000,

    bitcoin: 0.00001,

    solana: 20000,

    ethereum: 25000,

    moonbeam: 25000

}

function cBuffer(text) {
    let array = []
    for (let i = 0; i < text.length; i++) {
        array.push(text.charCodeAt(i))
    }

    let buffer = Uint8Array.from(array)
    return buffer
}

function deBuffer(array) {
    let text = String.fromCharCode(...array)
    return text
}



const ECPair = ECPairFactory(ecc);
const TESTNET = bitcoin.networks.testnet;


function genBitAccount() {
    //const keyPair = ECPair.makeRandom(); //mainnet

    const TESTNET = bitcoin.networks.testnet;

    const keyPair = ECPair.makeRandom({ network: TESTNET })

    const { address } = bitcoin.payments.p2pkh({
        pubkey: keyPair.publicKey,
        network: TESTNET
    });

    var wif = keyPair.toWIF()
    let privateKey = keyPair.privateKey.toString('hex')

    return {
        addr: address,
        sk: privateKey,
        wif: wif
    }
}

async function checkBitBalance(addr, amount) {
    try {
        let data = await fetch("https://blockstream.info/testnet/api/address/" + addr)
        let dataJSON = await data.json()
        let balance = dataJSON["chain_stats"]["funded_txo_sum"] || 0

        balance = balance

        console.log("bitcoin balance: " + balance)

        if (balance > 0){
            balance = balance / 100000000 //convert satoshis to bitcoin
        }

        if (balance > amount ) { //change to amount for real usage
            return true
        }
    }
    catch (e) {
        console.log("error occured with bicoin indexer")
        console.log(e)
        return false
    }
}

async function checkAlgoBalance(addr, amount) {
    try {

        let data = await fetch("https://algoindexer.testnet.algoexplorerapi.io/v2/accounts/" + addr)

        let dataJSON = await data.json()
        console.log(dataJSON)
        let balance = dataJSON.account.amount

        if (balance >= amount) {
            return true
        }
    }
    catch (e) {
        console.log("error occured with algorand indexer")
        return false
    }
}

async function checkSolBalance(account, amount) {
    try {

        let connection = new Connection(clusterApiUrl("testnet"));

        let pKey = new PublicKey(account.addr)

        let balance = await connection.getBalance(pKey)

        console.log(balance)

        if (balance >= amount) {
            return true
        }
    }

    catch (e) {
        console.log("error occured with solana indexer")
        console.log(e)
        return false
    }
}

async function checkEthorMoonBalance(account, amount,eth=true) {
    try {

        let provider = undefined

        if (eth){
            provider = ethers.getDefaultProvider('goerli');
        }
        else {
            const providerRPC = {
                moonbeam: {
                    name: 'moonbase-alpha',
                    rpc: 'https://rpc.api.moonbase.moonbeam.network',
                    chainId: 1287, // 0x507 in hex,
                },
            };

            provider = new ethers.providers.JsonRpcProvider(
                providerRPC.moonbeam.rpc,
                {
                    chainId: providerRPC.moonbeam.chainId,
                    name: providerRPC.moonbeam.name,
                }
            );
        }

        let wallet = new ethers.Wallet(account.sk, provider)

        let balance = await wallet.getBalance()

        console.log(balance.toBigInt())
    
        //console.log("balance: ", balance)

        if (balance >= amount) {
            return true
        }
    }
    catch (e) {
        console.log("error occured with ethereum or moonbeam indexer")
        console.log(e)
        return false
    }
}

function genEthAccount(){
    let id = crypto.randomBytes(32).toString('hex');
    let privateKey = "0x" + id;
    //console.log("SAVE BUT DO NOT SHARE THIS:", privateKey);

    let wallet = new ethers.Wallet(privateKey);

    return {
        addr: wallet.address,
        sk: privateKey
    }
}

function genSolAccount(){

    let keyPair = Keypair.generate()

    let acct = {
        addr: keyPair.publicKey.toString(),
        sk: keyPair.secretKey
    }

    return acct
}

function createEscrow(chain) {
    switch (chain) {
        case "algorand":
            return algosdk.generateAccount()
        case "bitcoin":
            return genBitAccount()
        case "ethereum":
            return genEthAccount()
        case "solana":
            return genSolAccount()
        case "moonbeam":
            return genEthAccount()
        default:
            break

    }
}

async function checkBalance(chain, address, amount,account={}) {
    switch (chain) {
        case "algorand":
            return await checkAlgoBalance(address, amount)
        case "bitcoin":
            return await checkBitBalance(address, amount)
        case "moonbeam":
            return await checkEthorMoonBalance(account, amount, false)
        case "ethereum":
            return await checkEthorMoonBalance(account, amount, true)
        case "solana":
                return await checkSolBalance(account, amount)
        default:
            return false
    }

}

async function sendCoins(order,first){

    let args = []

    let chain = ""

    if (first) {
        args = [order.price, order.escrow2, order.receiver]
        chain = "outputChain"
    }
    else {
        args = [order.amount, order.escrow1, order.receiver2]
        chain = "inputChain"
    }


    switch (order[chain]) {
        case "algorand":
            let data = await sendAlgos(...args)
            return data
        case "bitcoin":
            let data2 = await sendBTC(...args)
            return data2
        case "solana":
            let data3 = await sendSol(...args)
            return data3
        case "ethereum":
            let data4 = await sendEth(...args)
            return data4
        case "moonbeam":
            let data5 = await sendMoon(...args)
            return data5
        default:
            break
    }
}


export {
    checkBalance,
    cBuffer,
    deBuffer,
    genBitAccount,
    checkBitBalance,
    createEscrow,
    sendCoins,
    genEthAccount
}


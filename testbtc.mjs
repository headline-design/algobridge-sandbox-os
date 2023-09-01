import { genBitAccount, genEthAccount, sendCoins} from "./utils.js"
import { sendBTC } from "./sendBTC.js"
import { sendEth } from "./sendEth.js"
import { sendSol } from "./sendSol.js"
import { sendMoon } from "./sendMoon.js"
import {checkBalance,createEscrow} from './utils.js'




/* let testAccount = {
    addr:"19T7R7R8ZcgcWmrpSzCXiLs8g8fQsCXRCe",
    sk:"63db1c6c7ae4f23f5b1d52bf01346e8998c2e817edf7d4967dfa2d577c4d0450"
} */

let testAccount = {
    addr: '0xe5855e065BcB48386820D30b532cdbb88335f7c7',
    sk: '0x35d21727c23b1e71fc18fb9b098989d6d8e134818888d6d1a453814305d6064f'
  }


//let newAddr = genBitAddr()
//console.log(newAddr)

//let testAccount = genEthAccount()

//console.log(testAccount)

//sendEth( 0,testAccount,"0xccb67bfd35782096a951962d5d52be00abfb7893").then(d => {console.log(d)})

/*checkBalance("ethereum",testAccount.addr,0, testAccount).then(d => {
  console.log(d)
}) */

/*checkBalance("algorand","TFZHINPZDMZGGXLAYEMHIW36II6EFQZ5VTLKFBQNDR3X73KPK7KELSI5ZA",1).then(data => {
    console.log(data)
})*/


let solAccount =  {
    addr: '5x3Kw4QNXTGmLK5V7zKJBrdWCyKH2w2moUcToutNgwFC',
    sk: Uint8Array.from( [
      130,  63, 173, 223, 251,  75,  40, 161, 123, 139,  79,
       12, 110,  29,  80, 106, 240, 166, 126, 251,  93,  84,
       26, 219,  37,  25, 148, 116, 171,  46,  99, 158,  73,
      136,  82, 155, 206,  25,  21,  20, 168, 176, 207,  31,
       13,  95,  10,  29,  30, 175,  56, 171,  95,  45, 149,
       99, 200, 250,  33, 230, 197,  64,  18,  23
    ])
  }

  checkBalance("solana",solAccount.addr,0,solAccount)

//sendSol(1,solAccount,solAccount.addr).then(d => console.log(d))


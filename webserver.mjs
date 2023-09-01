import { createRequire } from 'module'
import { clearInterval } from 'timers';
import { cBuffer, createEscrow, deBuffer, sendCoins } from './utils.js'
import nacl from 'tweetnacl'
import algosdk from 'algosdk';
import { checkBalance } from './utils.js'

const require = createRequire(import.meta.url)

var express = require('express');
var app = express();

var fs = require('fs')

const path = require('path');

const cors = require('cors');

const bodyParser = require('body-parser');

let sellIndex = 0

let orderSafe = {}

let orders = {}

//comment out below for real usage

/*orders["0"] = {
    escrow2: {addr: "mj4RWwfx5NVxN6wZWB9D61wAx4GnCp3rY5"},
    escrow1: {addr:"DEXAGE6LAV5XL2Q3B6PE45U66KUCPMZHLO5SIWSJH7CTIAVON5PMQAXLYQ"},
    price: 0,
    amount: 0,
    receiver: "muv8Cx1KzUtndpWmZj3XCZSDy3eT7ibHnn",
    receiver2: "K3NSXYMHPRCK7PMYT3QUQXUGPZJ4MKWJXW2HJRYPVMQUMKJAOJEIEO4HK4",
    inputChain:"algorand",
    outputChain:"bitcoin",
    inStatus: "pending"
}

orderSafe = orders // comment out for real usage

console.log(orders)

*/


app.use(cors(), express.json());

app.get('/index/:name', function (req, res) {

    switch (req.params.name) {
        case "buy":
            res.send(buySafe)
            break
        case "sell":
            res.send(orderSafe)
            break
        default:
            res.send({ message: "index is working, but param not found" })
            break
    }
})



app.post('/upload/:name', async function (req, res) {

    switch (req.params.name) {
        case "list":


            try {
                console.log(req.body)
                //Object.assign(listingData, req.body)

                let amount = req.body.amount

                let a = req.body.inputChain // input chain

                let b = req.body.outputChain // output chain

                let c = createEscrow(a)
                let d = createEscrow(b)

                let obj = {
                    receiver: req.body.address,
                    receiver2: req.body.address,
                    inputChain: a,
                    outputChain: b,
                    escrow1: c,
                    escrow2: d,
                    amount: parseInt(amount),
                    price: req.body.price,
                    inStatus: "pending",
                    buyTime: "undefined",
                    date: Date.now()

                }

                let safeObj = { ...obj }

                safeObj.escrow1 = obj.escrow1.addr
                safeObj.escrow2 = obj.escrow2.addr

                orders[sellIndex] = obj
                orderSafe[sellIndex] = safeObj

                sellIndex += 1

                res.send({
                    message: "send $ to " + a + " address " + c.addr + " to receive money at " + b + " address " + d.addr,
                    escrow: d
                })




            }
            catch (e) {
                console.log(e)
                res.send({ message: "Error occured" })
            }
            break

        case "delete":

            try {
                //console.log("Request: ", req.body)
                let acct2 = algosdk.decodeAddress(req.body.address)

                let txn2 = cBuffer(req.body.txn)
                let verified2 = nacl.sign.open(txn2, acct2.publicKey)

                if (verified2 !== null) {

                    let key2 = req.body.address
                    if (shuffles[key2].ref !== undefined) {
                        let ref = shuffles[key2].ref
                        clearInterval(ref)
                    }

                    delete shuffles[key2]
                    delete shufflesSafe[key2]
                    res.send({ message: "Shuffle deleted" })
                }
                else {
                    res.send({ message: "Authentication failed" })
                }
            }
            catch (e) {
                console.log(e)
                res.send({ message: "Error occured" })
            }
            break;

        case "buy":

            console.log(req.body)

            try {

                if (orders[req.body.index].buyTime === "undefined") {



                    orders[req.body.index].buyTime = Date.now()
                    orderSafe[req.body.index].buyTime = Date.now()

                    orders[req.body.index].receiver2 = req.body.address
                    orderSafe[req.body.index].receiver2 = req.body.address


                    res.send({ message: "Buy Order Locked! Send funds (price + min balance) to Escrow2 to execute."})
                }
                else {
                    res.send({ message: "Not Available" })
                }
            }
            catch (e) {
                console.log(e)
                res.send({ message: "Error occured" })
            }
        break
        default:
            break

    }

    /* console.log(req.params.name)

    gameWorld[req.params.name] = req.body.action

    console.log(gameWorld) */

    // saveFile(req.params.name, JSON.stringify(req.body))
})



function saveFile(name, body) {

    let newPath = path.resolve('./') + name + ".txt"
    let data = loadFile(name)
    console.log(data)
    fs.writeFile(newPath, body, (err) => {
        if (err) {
            console.log('Error saving');
        } else {
            console.log('It\'s saved!');
            console.log("Path: ", newPath)
        }
    });

}

function loadFile(name) {
    let newPath = path.resolve('./') + name + ".txt"

    if (fs.existsSync(newPath)) {

        let fileContents = fs.readFileSync(newPath)
        let obj = JSON.parse(fileContents.toString())
        console.log(obj)
        console.log("Loaded database")
        return obj

    }
    else {
        console.log("No database found. Will be created on next backup.")
        return {}
    }

}

app.listen(8888, function () {
    console.log('Node server now listening on port 8888!');
});




async function checkAndSend() {

    console.log("running...")

        let keys = Object.keys(orders)

        for (let i = 0; i < keys.length; i++) {

            let order = orders[keys[i]]

            let key = keys[i]

            let funded = await checkBalance(
                order.inputChain,
                order.escrow1.addr,
                order.amount,
                order.escrow1
            )


            if (funded) {
                order.inStatus = "funded"
                orderSafe[keys[i]].inStatus = "funded"
            }

            let funded2 = await checkBalance(
                order.outputChain,
                order.escrow2.addr,
                order.price,
                order.escrow2
            )

            if (funded2) {

                let data1 = await sendCoins(order, true)
                console.log(data1)

                let data2 = await sendCoins(order, false)
                console.log(data2)

                delete orders[key]
                delete orderSafe[key]
                
                console.log("delete check: ", orders[key])
            }
        }

    //add code here to remove filled orders
    setTimeout(checkAndSend, 5000)
}

checkAndSend()

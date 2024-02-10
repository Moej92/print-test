const express = require("express");
const app = express();

const escpos = require('escpos');
escpos.USB = require('escpos-usb');

const { usb, getDeviceList, findByIds, findBySerialNumber  } = require("usb");
const devices = getDeviceList();

console.log("devices: ", devices)

console.log("escpos.USB: ", escpos.USB.findPrinter())

const device = findByIds(7072, 8709);
console.log("device: ", device)

app.get("/", (req, res) => {
    res.send("<div><h1>Hello World!</h1><a href='/print'>Print</a></div>")
})

app.get("/print", (req, res) => {
    
    // const device  = new escpos.USB(7072, 8709);
    // const device = findByIds(7072, 8709);

    const options = { encoding: "GB18030" /* default */ }
    // encoding is optional
    
    const printer = new escpos.Printer(device, options);
    
    const tableData = [
        { item: "Hair Cut", price: "35.00", qty: "1" },
        { item: "Wax", price: "20.00", qty: "1" },
        { item: "Massage", price: "60.00", qty: "2" },
        { item: "Menicure", price: "15.00", qty: "1" }
    ]

    device.open(function(error){
        console.log("opened")
        printer
            .font("A")
            .align("CT")
            .size(1, 1)
            .text("Leen Beauty Salon \n")
            .size(0.5, 0.5)
            .text("+962 79 1758393 \n")
            .align("LT")
            .size(1, 1)
            .text("Invoice: #221 \n")
            .align("CT")
            .size(0.5, 0.5)
            .text("2/8/2024 3:43 \n")
            .size(1, 1)
            .text("------------------------")
            .font("B")
            .size(1, 1)
        
        tableData.forEach(row => {
            printer.text(row.qty + " " + row.item.padEnd(20) + row.price.padEnd(10) + '\n')
        })

        printer
            .text("\n")
            .text("Subtotal:".padEnd(20) + "130.00".padEnd(10) + "\n")
            .text("Discount:".padEnd(20) + "-20.00".padEnd(10) + "\n")
            .font("A")
            .size(2, 2)
            .text("Payment".padEnd(10) + "110.00".padEnd(5) + "\n")
            // .tableCustom([
            //     {
            //         text: "Subtotal",
            //         align: "LEFT",
            //         width: 0.4
            //     },
            //     {
            //         text: "130.00 \n",
            //         align: "RIGHT",
            //         width: 0.15
            //     },
            // ])
            // .tableCustom([
            //     {
            //         text: "Discount",
            //         align: "LEFT",
            //         width: 0.4
            //     },
            //     {
            //         text: "-20.00 \n",
            //         align: "RIGHT",
            //         width: 0.15
            //     },
            // ])
            // .size(2, 2)
            // .tableCustom([
            //     {
            //         text: "Payment",
            //         align: "LEFT",
            //         width: 0.4
            //     },
            //     {
            //         text: "110.00 \n",
            //         align: "RIGHT",
            //         width: 0.15
            //     },
            // ])
        printer
            .cut()
            .close()
    });
    res.send("print");
})



app.listen(3000, () => console.log("Server is listening on port 3000"));
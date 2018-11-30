var _ = require('lodash');
var Block = require("./Block.js")
var Blockchain = require("./Blockchain.js");
let blockChain = new Blockchain();

var transaction_map = [];
var TRANSACTION_SIZE = 3;


exports.blockchain_upload = function (transaction) {

    return new Promise(async function (resolve, reject) {
        transaction_map.push(transaction);

        console.log("blockchain_upload");
        console.log(transaction_map);

        if (transaction_map.length === TRANSACTION_SIZE) {
            let nb = await createNewBlock(transaction_map);

            await insertIntoBlockchain(nb)
            console.log(" transaction_map = [];")
            transaction_map.length = 0;
            console.log(transaction_map);
            resolve();

        }
        else {
            resolve();
        }
    });
};


exports.blockchain_read = function () {
    return new Promise(async function (resolve, reject) {

        console.log('blockchain_read');
        console.log(blockChain);
        // console.log(await blockChain.blockRead());

        resolve({
            'data': blockChain,
            'transaction': transaction_map
        });

    });
}


var createNewBlock = function (data) {
    return new Promise(function (resolve, reject) {
        var new_block = new Block(new Date(), data);
        console.log('new Block');
        console.log(JSON.stringify(new_block));
        resolve(new_block);
    });
}

var insertIntoBlockchain = function (block) {
    return new Promise(async function (resolve, reject) {
        blockChain = await blockChain.addBlock(block);
        console.log("**insertIntoBlockchain blockChain.chain");
        console.log(blockChain);
        resolve();
    });
}

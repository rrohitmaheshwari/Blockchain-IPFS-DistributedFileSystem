var _ = require('lodash');
var Block = require("./Block.js")
var Blockchain = require("./Blockchain.js");
var blockChain = new Blockchain();

var transaction_map = [];
var TRANSACTION_SIZE = 3;


exports.blockchain_upload = function (transaction) {

    return new Promise(function (resolve,reject) {
        transaction_map.push(transaction);

        console.log("blockchain_upload");

        if (transaction_map.length === TRANSACTION_SIZE) {
            insertIntoBlockchain(createNewBlock(transaction_map)).then(() => {
                transaction_map = [];
                transaction_map.length=0;
                resolve();
            });

        }
        else {
            resolve();
        }
    });
};


exports.blockchain_read = new Promise(function (resolve, reject) {

    console.log('blockchain_read');
    let data = blockChain.blockRead();

    let response = {
        'data': data,
        'transaction': transaction_map
    }
    resolve(response);

});


var createNewBlock = function (data) {
    var new_block = new Block(new Date(), data);
    return new_block;
}

var insertIntoBlockchain = function (block) {
    return new Promise(function (resolve,reject) {
        blockChain.addBlock(block);

        console.log("insertIntoBlockchain");
        console.log(blockChain);
        resolve();
    });
}

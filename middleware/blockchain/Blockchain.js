var Block = require("./Block.js")

module.exports = class Blockchain {
    constructor() {
        this.chain = [this.createGenesis()];
    }

    createGenesis() {
        return new Block("Genesis block", "0")
    }

    latestBlock() {
        return this.chain[this.chain.length - 1]
    }

    async addBlock(newBlock) {
        newBlock.previousHash = this.latestBlock().hash;
        newBlock.hash = newBlock.calculateHash();
        this.chain.push(newBlock);
        console.log(JSON.stringify(this.chain));
        return (this.chain);
    }


    async blockRead() {
        console.log('blockRead');
        console.log(JSON.stringify(this.chain));
        return (this.chain);
    }

    checkValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }

            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }

        return true;
    }
}

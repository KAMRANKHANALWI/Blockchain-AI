const express = require('express')
const axios = require('axios')
const {utils} = require('ethers')
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
require('dotenv').config()

const app = express()
const apiKEY = process.env.API_KEY
class Block{
    constructor(timeStamp, blockReward) {
        this.timeStamp = timeStamp;
        this.blockReward = blockReward;
    } 
}

// https://api.etherscan.io/api
//    ?module=block
//    &action=getblockreward
//    &blockno=2165403
//    &apikey=YourApiKeyToken

const fetchData = async () => {
    try {
        const listOfBlocks = [];
        for(let blockNumber = 17469923; blockNumber<17469973; blockNumber++) {
            const apiUrl = `https://api.etherscan.io/api?module=block&action=getblockreward&blockno=${blockNumber}&apikey=${apiKEY}`
            // const response = await axios.get(apiUrl); // new fxn
            const response = await axios.get(apiUrl, { timeout: 8000 }); // 8000 milliseconds
            const rewardEther = utils.formatEther(response.data.result.blockReward) // etherValue
            const timeStamp = response.data.result.timeStamp
            // console.log(response.data.result.blockReward)
            // console.log(response.data.result.timeStamp)
            const block = new Block(timeStamp, rewardEther)
            console.log(block)
            listOfBlocks.push(block)
        }
        exportToCsv(listOfBlocks)
        // console.log(listOfBlocks)
    } catch(error) {
        // console.error(error)
        if (error.code === 'ECONNRESET') {
            console.error('Connection reset by peer. Retrying...');
            // can implement retry logic here 
        } else {
            console.error('An error occurred:', error.message);
        }
    }
}

const exportToCsv = (data) => {
    console.log("Hello")
    const csvWriter = createCsvWriter({
        path: 'testing_data.csv',
        header: [
        { id: 'timeStamp', title: 'timestamp' },
        { id: 'blockReward', title: 'blockReward' }
        ]
    });

    csvWriter
        .writeRecords(data)
        .then(() => {
            console.log('CSV file created successfully!');
        })
        .catch((error) => {
            console.error(error);
        });
    };

(async() => {
    try {
        await fetchData()
        app.listen(3000, () => {
            console.log("Server is running")
})
    } catch (error) {
        console.log(error)
    }
})()

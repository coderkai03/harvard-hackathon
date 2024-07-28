require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { ethers } = require('ethers');
const { HDNodeWallet } = require('ethers/wallet');

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(bodyParser.json());

console.log('Starting app...');

// Setup Moonbeam provider
const provider = new ethers.JsonRpcProvider(process.env.MOONBEAM_RPC_URL);

// Derive wallet from mnemonic
let wallet;
try {
    wallet = HDNodeWallet.fromPhrase(process.env.MNEMONIC).connect(provider);
    console.log('Wallet initialized successfully');
    console.log('Wallet address:', wallet.address);
} catch (error) {
    console.error('Error initializing wallet:', error.message);
    process.exit(1);
}

// NFT contract ABI (replace with your actual ABI)
const contractABI = [
    "function mintNFT(address to, string memory tokenURI) public returns (uint256)"
];

const nftContract = new ethers.Contract(process.env.CONTRACT_ADDRESS, contractABI, wallet);

// Endpoint to handle POST requests for minting NFTs
app.post('/mint-nft', async (req, res) => {
    const { playerName, tokenURI } = req.body;

    try {
        const tx = await nftContract.mintNFT(wallet.address, tokenURI);
        const receipt = await tx.wait();

        console.log(`Minted NFT for ${playerName}, Token URI: ${tokenURI}, Transaction: ${receipt.transactionHash}`);

        res.json({ success: true, transactionHash: receipt.transactionHash });
    } catch (error) {
        console.error('Error minting NFT:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Endpoint to handle POST requests
app.post('/data', (req, res) => {
    console.log('Received data:', req.body);
    res.send('Data received');
});

// Endpoint to handle GET requests to /data
app.get('/data', (req, res) => {
    console.log('This is the data endpoint. Please use a POST request to send data.');
    res.send('This is the data endpoint. Please use a POST request to send data.');
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
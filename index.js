const express = require('express');
const axios = require('axios');
const crypto = require('crypto');
const path = require('path');

const app = express();

const apiKey = 'vbgHJ15jjI0SwbfCGuK4MduAME9y6JuSYIra9FiCm4Lh4e7YsMCy81CX2chuStQR';
const apiSecret = 'kYKCPtTUpwZG7pg4vEdRiJzaejMgvkPMTNbfyfeEbvdGCj0FOSQzr0DCSIx61jLC';

const baseUrl = 'https://testnet.binance.vision/api/v3'; 
const endpoint = '/account';

// Middleware para obtener el saldo de USDT
const getUSDTBalance = async () => {
  const timestamp = Date.now();
  const signature = crypto.createHmac('sha256', apiSecret)
    .update(`timestamp=${timestamp}`)
    .digest('hex');

  try {
    const response = await axios.get(`${baseUrl}${endpoint}`, {
      headers: {
        'X-MBX-APIKEY': apiKey,
      },
      params: {
        timestamp,
        signature,
      },
    });
    
    // Filtrar los activos en USDT
    const assetsInUSDT = response.data.balances.find(asset => asset.asset === 'USDT');
    return assetsInUSDT.free;
  } catch (error) {
    console.error('Error fetching USDT balance:', error);
    return null;
  }
};

// Ruta para mostrar el HTML con el saldo de USDT en el título
app.get('/', async (req, res) => {
  try {
    const usdtBalance = await getUSDTBalance();
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>USDT Balance: ${usdtBalance}</title>
      </head>
      <body>
        <h1>Your USDT Balance is: ${usdtBalance}</h1>
      </body>
      </html>
    `;
    res.send(htmlContent);
  } catch (error) {
    res.status(500).send(`<h1>Error: ${error.toString()}</h1>`);
  }
});

// Ruta para obtener el saldo de USDT en formato JSON
app.get('/account', async (req, res) => {
  try {
    const usdtBalance = await getUSDTBalance();
    res.json({ balance: usdtBalance });
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});

// Configuración del puerto para Render
const port = process.env.PORT || 3000;

// Iniciar el servidor y escuchar en el puerto configurado
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

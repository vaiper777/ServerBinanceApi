const express = require('express');
const axios = require('axios');
const crypto = require('crypto');

const app = express();

const apiKey = 'vbgHJ15jjI0SwbfCGuK4MduAME9y6JuSYIra9FiCm4Lh4e7YsMCy81CX2chuStQR';
const apiSecret = 'kYKCPtTUpwZG7pg4vEdRiJzaejMgvkPMTNbfyfeEbvdGCj0FOSQzr0DCSIx61jLC';

const baseUrl = 'https://testnet.binance.vision/api/v3'; 
const endpoint = '/account';

app.get('/account', async (req, res) => {
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
    
    res.json(assetsInUSDT);
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

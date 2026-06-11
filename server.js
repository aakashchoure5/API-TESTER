const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Serve frontend files
app.use(express.static(path.join(__dirname, 'public')));

// Auto-fetch Models Endpoint
app.post('/api/models', async (req, res) => {
    let { apiKey, baseUrl } = req.body;
    if (!baseUrl) baseUrl = 'https://api.openai.com/v1';
    baseUrl = baseUrl.replace(/\/+$/, '');

    try {
        const response = await axios.get(`${baseUrl}/models`, {
            headers: { 'Authorization': `Bearer ${apiKey}` }
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ 
            error: "Failed to fetch models. Check your API Key and Base URL.", 
            details: error.response?.data || error.message 
        });
    }
});

// Chat Test Endpoint
app.post('/api/chat', async (req, res) => {
    let { apiKey, baseUrl, model, messages } = req.body;
    if (!baseUrl) baseUrl = 'https://api.openai.com/v1';
    baseUrl = baseUrl.replace(/\/+$/, '');

    try {
        const response = await axios.post(`${baseUrl}/chat/completions`, {
            model: model,
            messages: messages
        }, {
            headers: { 
                'Authorization': `Bearer ${apiKey}`, 
                'Content-Type': 'application/json' 
            }
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ 
            error: "Chat failed.", 
            details: error.response?.data || error.message 
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

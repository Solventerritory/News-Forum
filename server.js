const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/api/subscribe', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ success: false, message: 'Email is required.' });
        }

        const subscribers = await readSubscribers();
        subscribers.push({ email });
        await writeSubscribers(subscribers);

        return res.json({ success: true, message: 'Subscription successful!' });
    } catch (error) {
        console.error('Error during subscription:', error);
        return res.status(500).json({ success: false, message: 'An internal server error occurred.' });
    }
});

async function readSubscribers() {
    try {
        const data = await fs.readFile('subscribers.json', 'utf8');
        return JSON.parse(data) || [];
    } catch (error) {
        if (error.code === 'ENOENT') {
            return [];
        }
        console.error('Error reading subscribers:', error);
        return [];
    }
}

async function writeSubscribers(subscribers) {
    try {
        await fs.writeFile('subscribers.json', JSON.stringify(subscribers, null, 2), 'utf8');
    } catch (error) {
        console.error('Error writing subscribers:', error);
    }
}

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

const express = require('express');
const fs = require('fs');
const dotenv = require('dotenv');

const app = express();
const port = process.env.PORT || 3000;

// Load secrets from Vault file
const vaultSecretsPath = '/vault/secrets/config';
if (fs.existsSync(vaultSecretsPath)) {
    dotenv.config({ path: vaultSecretsPath });
    console.log('Vault secrets loaded successfully.');
} else {
    console.error('Vault secrets file not found.');
}

// Retrieve secrets
const dbUser = process.env.DB_USER || 'defaultUser';
const dbPassword = process.env.DB_PASSWORD || 'defaultPassword';

app.get('/', (req, res) => {
    res.send(`Hello from Node.js App! Database User: ${dbUser}`);
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

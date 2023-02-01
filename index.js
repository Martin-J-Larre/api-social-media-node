const express = require('express');
const cors = require('cors');
require('dotenv').config();


const connection = require('./db/config');

const app = express();
connection();

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});
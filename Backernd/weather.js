const express = require('express');
const cors = require('cors');
const path = require('path');

const weatherRoute = require('./routes/weather');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/weather', weatherRoute);

app.listen(PORT, () => {
  console.log(`🌱 Servidor activo en http://localhost:${PORT}`);
});
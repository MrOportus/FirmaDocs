// src/server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const { port, mongoURI } = require('./config');
const formRoutes = require('./routes/formRoutes');

const app = express();

app.use(bodyParser.json());
app.use(cors());

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Conectado a MongoDB'))
    .catch(err => console.error('Error conectando a MongoDB', err));

app.use('/api/forms', formRoutes);

app.listen(port, () => console.log(`Servidor corriendo en el puerto ${port}`));

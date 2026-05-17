const express = require ('express');
const cors = require('cors');

const resourceRoutes = require('./routes/resourceRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const projectRoutes = require('./routes/projectRoutes');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/resources',resourceRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/projects',projectRoutes);

app.get('/',(req,res)=>{
    res.send('Serveur BTP operationnel');
});

app.listen(PORT,()=>{
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
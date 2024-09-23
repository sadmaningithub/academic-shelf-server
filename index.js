const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

app.get('/', (req,res)=>{
    res.send('Academic Shelf server is running.')
})

app.listen(port, (req,res)=>{
    console.log(`Academic Shelf server running on port ${port}`);
})
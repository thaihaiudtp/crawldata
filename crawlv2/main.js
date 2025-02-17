const express = require('express');
const router = require('./router/router')
const app = express();
const cors = require('cors');
const port = 7022;
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true
}));
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
router(app)
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
const express = require('express')
const chalk = require('chalk')
const path = require('path')

const app = express()

const port = process.env.PORT || 9000

const publicPath = path.join(__dirname, '../public')

app.use(express.static(publicPath))

app.listen( port, () => {
    console.log(chalk.cyan(`Chat App Live at Port: ${port}`))
})
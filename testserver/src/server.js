const express = require('express')
const port = process.env.PORT || 8991
const bodyParser = require('body-parser')
import routes from './routes'

/*
 * Initialize express
 */
const app = express()

app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(bodyParser.json())

routes(app)

app.listen(port)

console.log('Notifier test server started on: ' + port)
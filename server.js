const express = require('express')
const app = express()
const fs = require('fs')
const bodyParser = require('body-parser')

app.use(bodyParser.raw({ type: '*/*' }))

let serverState = {
    items: {},
    listName : "clothes"
}

app.get('/getListName',(req,res)=>{
    res.send(serverState.listName)
})

app.post("/changeListName",(req,res)=>{
    serverState.listName = req.body.toString()
    res.send("SUCCESS")
})

// The following two endpoints are so that the browser can load the HTML and Javascript
app.get('/', (req, res) => res.send(fs.readFileSync('./public/index.html').toString()))
app.get('/app.js', (req, res) => res.send(fs.readFileSync('./public/app.js').toString()))

app.get('/clearItems', (req, res)=>{
    serverState.items = {};
    res.send('list cleared')
})

app.post('/reverse', (req, res)=>{
    let parsedBody = req.body.toString();
    let reversed = serverState.items[parsedBody];
    reversed = reversed.reverse();
    //console.log(reversed)
    res.send('list reversed')
})

app.post('/items', (req, res) => {
    let parsedBody = JSON.parse(req.body.toString())
    let listName = parsedBody.listName;
    let items = serverState.items[listName];
    if(!items) items = []
    res.send(JSON.stringify(items));
})

app.post('/addItem', (req, res) => {
    // Remember: the body of an HTTP response is just a string.
    // You need to convert it to a javascript object
    let parsedBody = JSON.parse(req.body.toString());
    // This is just a convenience to save some typing later on
    let listName = parsedBody.listName;
    // If the list doesn't exist, create it
    if(!serverState.items[listName]) { serverState.items[listName] = [] }
    // The following could be rewritten in a shorter way using push.
    // Try rewriting it. It will help you understand it better.
    serverState.items[listName] = serverState.items[listName].concat(parsedBody.item)
    res.send(JSON.stringify(serverState.items[listName]));
})

app.listen(3000, () => console.log('Example app listening on port 3000!'))

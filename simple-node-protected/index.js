const express = require("express")
const bodyParser = require("body-parser")

const app = express()

app.use(bodyParser.json())

app.post("/protected/nested/route", (req, res) => {
    console.log("client IP", req.ip)
    console.log("body", req.body)
    console.log("headers", req.headers)
    return res.status(200).json({
        msg: "protected resource available"
    })
})

app.use("*", (req, res) => res.status(404).json({ err: "not found" }))

const listener = app.listen(3000, () => {
    console.log(`server running on http://localhost:${listener.address().port}`)
});
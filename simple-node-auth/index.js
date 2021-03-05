const express = require("express")
const bodyParser = require("body-parser")

const app = express()

app.use(bodyParser.json())

app.use("/auth", (req, res) => {
    console.log("path", req.path, "method", req.method, "remote", req.connection.remoteAddress)
    console.log("headers", req.headers)
    console.log("conn remote addr", req.connection.remoteAddress)
    console.log("client IP", req.ip)
    console.log("sckt remote addr", req.socket.remoteAddress)
    console.log("req conn sckt add", req.connection?.socket?.remoteAddress)
    if (req.headers["x-api-key"] !== "this is a super secret key") {
        console.log("failed to authenticate")
        return res.status(401).json({
            err: "authentication failed"
        })
    }

    console.log("authenticated successfully")
    res.setHeader("org-name", "dummy-org")
    return res.status(200).json({
        msg: "success"
    })
})

const listener = app.listen(3000, () => {
    console.log(`server running on http://localhost:${listener.address().port}`)
});
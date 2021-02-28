const express = require("express")
const bodyParser = require("body-parser")

const app = express()

app.use(bodyParser.json())

app.use("/auth", (req, res) => {
    console.log("path", req.path, "method", req.method, "remote", req.connection.remoteAddress)
    console.log("originalURL", req.originalUrl)
    console.log("baseURL", req.baseUrl)
    console.log("originalURL + baseURL", req.originalUrl + req.baseUrl)
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
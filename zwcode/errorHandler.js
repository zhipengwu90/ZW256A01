const { webLog } = require("./webLog");
const path = require("path");
const SERVER_ERROR_PAGE = path.join(__dirname, "../zwroot/errorpages/500.html");
const fs = require("fs").promises;

exports.errorHandler = (req, res, err) => {
  fs.readFile(SERVER_ERROR_PAGE)

    .then((contents) => {
      res.writeHead(500, {
        "Content-Type": "text/html",
        "Content-Length": contents.length,
      });
      res.end(contents);
      webLog(`${req.method} ${req.url}`, 500, err);
    })
    .catch((err) => {
      webLog(`${req.method} ${req.url}`, 500, err);
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("500 Internal Server Error");
      process.exit(1);
    });
};

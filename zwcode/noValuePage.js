const fs = require("fs").promises;
const {errorHandler} = require('./errorHandler');
const {webLog} = require('./webLog');

exports.noValuePage = async (res, req, noValuePath, status, err) => {
    await fs
      .readFile(noValuePath)
      .then((result) => {
        res.writeHead(status, {
          "Cache-Control": "no-cache",
          "Content-Type": "text/html",
          "Content-length": result.length,
          Date: new Date().toISOString,
          Zhipeng: "wu",
        });
        res.end(result);
        webLog(`${req.method} ${req.url}`, status, err);
      })
      .catch((err) => {
        errorHandler(req,res, err);
      });
  };
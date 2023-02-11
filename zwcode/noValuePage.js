const fs = require("fs").promises;
const {errorHandler} = require('./errorHandler');

exports.noValuePage = async (res, req, noValuePath, status) => {
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
      })
      .catch(() => {
        console.log("error");
        errorHandler(res);
      });
  };
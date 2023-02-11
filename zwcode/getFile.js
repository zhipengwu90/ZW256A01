const fs = require("fs").promises;
const {errorHandler} = require('./errorHandler');
const path = require("path");
const SERVER_ERROR_PAGE = path.join(__dirname, "../zwroot/errorpages/500.html");

exports.getFile = async (res, req, localPath, contentType, status) => {
    await fs
      .readFile(localPath)
      .then((contents) => {
        res.writeHead(status, {
          "Cache-Control": "no-cache",
          "Content-Type": contentType,
          "Content-length": contents.length,
          Date: new Date().toISOString,
          Zhipeng: "wu",
        });
        res.end(contents);
      })
      .catch((err) => {
        fs.readFile(SERVER_ERROR_PAGE)
        
          .then((contents) => {
            res.writeHead(500, {
              "Content-Type": "text/html",
              "Content-Length": contents.length,
            });
            res.end(contents);
          })
          .catch(()=>{errorHandler(res)});
      });
      // webLog(`${req.method} ${req.url}`, 200);
  };
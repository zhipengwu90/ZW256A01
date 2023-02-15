const fs = require("fs").promises;
const {errorHandler} = require('./errorHandler');
const path = require("path");
const SERVER_ERROR_PAGE = path.join(__dirname, "../zwroot/errorpages/500.html");
const {webLog} =require("./webLog");

exports.getFile = async (res, req, localPath, contentType, status, err) => {
    await fs
      .readFile(localPath)
      .then((contents) => {
        res.writeHead(status, {
          "Cache-Control": "no-cache",
          "Content-Type": contentType,
          "Content-length": contents.length,
          "Date": new Date().toISOString,
          "Zhipeng": "wu",
        });
        res.end(contents);
        webLog(`${req.method} ${req.url}`, status, err) ;
      })
   .catch((err)=>{errorHandler(req,res, err)});
  };
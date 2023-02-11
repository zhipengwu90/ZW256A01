const fs = require("fs");
const path = require("path");
const getLogPath = path.join(__dirname, "../zwdata/logs/web.log");


exports.webLog = (request, status, errorMessage =null) => {
    const logMessage = `${new Date().toISOString()} | ${request} | ${status} | ${errorMessage}\n`;
    
    fs.appendFile(getLogPath, logMessage, (err) => {
      if (err) {
        console.log(err);
      }
    });
  };
  
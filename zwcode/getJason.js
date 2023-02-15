const fs = require("fs").promises;
const {noValuePage} = require('./noValuePage');
const path = require("path");
const NO_VALUE_MATCH_PAGE = path.join( __dirname, "../zwroot/errorpages/416.html"
);
const {webLog} = require("./webLog");

exports.getJason = async (res,req, jsonPath, field, value) => {
    await fs
      .readFile(jsonPath)
      .then((result) => {
        result = JSON.parse(result.toString());
        if (field === "year") {
          let data = result.filter((el) => el[field] === Number(value));
          if (!data.length) {
            throw err;
          } else {
            
          return JSON.stringify(data.sort((a, b) => a.model.localeCompare(b.model)).sort((a, b) => a.make.localeCompare(b.make)))
          };
        } else if (field === "cost") {
          let data = result.filter((el) => Number(el[field]) <= Number(value));
          if (!data.length) {
            throw err;
          } else return JSON.stringify(data.sort((a, b) => a.model.localeCompare(b.model)).sort((a, b) => a.make.localeCompare(b.make)));
        } else {
          let data = result.filter(
            (el) => el[field].toLowerCase() === value.toLowerCase()
          );
          if (!data.length) {
            throw err;
          } else return JSON.stringify(data.sort((a, b) => a.model.localeCompare(b.model)).sort((a, b) => a.make.localeCompare(b.make)));
        }
      })
      .then((data) => {
        res.writeHead(200, {
          "Cache-Control": "no-cache",
          "Content-Type": "application/json",
          "Date": new Date().toISOString,
          "Zhipeng": "wu",
        });
        res.end(data);
        webLog(`${req.method} ${req.url}`, 200);
        
      })
      .catch((err) => {
        noValuePage(res, req, NO_VALUE_MATCH_PAGE, 416,"Range not satisfiable" );
        
      });
  };
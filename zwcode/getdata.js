const fs = require("fs").promises;
const {noValuePage} = require('./noValuePage');
const path = require("path");
const NO_VALUE_MATCH_PAGE = path.join( __dirname, "../zwroot/errorpages/416.html"
);
const {webLog} = require("./webLog");


exports.getdata = async (res, req, getdataPath, value) => {
    await fs
      .readFile(getdataPath)
      .then((result) => {
        result = JSON.parse(result.toString());
        let keyIndex = Object.keys(result);
        if (keyIndex.find((el) => el.toLowerCase() === value)) {
          let data = { [value]: result[value] };
          return data;
        } else {
          
          throw err ="Range not satisfiable" ;
        }
      })
      .then((data) => {
        res.writeHead(200, {
          "Cache-Control": "no-cache",
          "Function": "Simple Search",
          "Content-Type": "text/html",
          "Date": new Date().toISOString,
          "Zhipeng": "wu",
        });
        res.end(
          `
        <html>
          <body>
            <h1>The ${Object.keys(data)} is ${Object.values(data)}</h1>
          </body>
        </html>
        `
        );
        webLog(`${req.method} ${req.url}`, 200);
      })
      .catch((err) => {
        noValuePage(res,req, NO_VALUE_MATCH_PAGE, 416, err );
      });
  };
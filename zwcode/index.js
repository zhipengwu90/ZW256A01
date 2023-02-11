const http = require("http");
const fs = require("fs").promises;
const url = require("url");
const path = require("path");
const { mimeTypes } = require("./contentType");
const {getFile} =require('./getFile');
const {noValuePage} = require('./noValuePage');
const {getJason} =require("./getJason");
const {getdata} = require("./getdata");

const PORT = 9000;
const WEBROOT = path.join(__dirname, "../zwroot/public");
const DEFAULT_FILE = "index.html";
const DEFAULT_EXT = ".html";
const FAVICON_NAME = "favicon.ico";
const UNSUPPORTED_TYPE_PAGE = path.join(
  __dirname,
  "../zwroot/errorpages/415.html"
);
const NOT_FOUND_ERROR_PAGE = path.join(
  __dirname,
  "../zwroot/errorpages/404.html"
);

const NO_VALUE_PAGE = path.join(__dirname, "../zwroot/errorpages/406.html");
const getdataPath = path.join(__dirname, "../zwdata/details.json");

http
  .createServer((req, res) => {
    let urlObject = url.parse(req.url, true);
    let pathOject = path.parse(urlObject.pathname);
    let filename = pathOject.base || DEFAULT_FILE;
    let pathname = pathOject.dir;
    let ext = pathOject.ext || DEFAULT_EXT;
    let contentType = mimeTypes[ext];
    let localPath = path.join(WEBROOT, pathname, filename);
    const pathParts = urlObject.pathname.split("/");
    const ALLOWED_FIELDS = ["model", "make", "year", "condition", "cost"];
    let field = pathParts[2] || null;
    let isfiledNull = field ? field.toLowerCase() : null;
    let value = pathParts[3] ? decodeURI(pathParts[3]) : null;
    let IsFiledExit = ALLOWED_FIELDS.find((el) => el === isfiledNull);

    let getdataIndex = pathParts
      .map((el) => el.toLowerCase())
      .indexOf("getdata");

    let dataValue = pathParts[pathParts.length - 1];

    if (getdataIndex !== -1) {
      if (getdataIndex === pathParts.length - 1 || !dataValue) {
        noValuePage(res,req, NO_VALUE_PAGE, 406);
      } else if (getdataIndex !== -1 && getdataIndex === pathParts.length - 2) {
        getdata(res, req, getdataPath, dataValue.toLowerCase());
      }
    } else if (pathParts[1].toLowerCase() === "cars" && IsFiledExit) {
      let jsonPath = path.join(__dirname, "../zwdata/cars.json");
      if (!value) {
        noValuePage(res, req, NO_VALUE_PAGE, 406);
      } else {
        getJason(res, req,jsonPath, isfiledNull, value);
      }
    } else if (contentType) {
      fs.stat(localPath)
        .then((stats) => {
          if (stats.isDirectory()) {
            localPath = path.join(localPath, DEFAULT_FILE);
          }
          fs.access(localPath).then(() => {
            getFile(res, req, localPath, contentType, 200);
          })
          .catch(()=>{
            getFile(res,req,  NOT_FOUND_ERROR_PAGE, "text/html", 404);
          });
        })
        .catch((err) => {
          if (filename === FAVICON_NAME) {
            res.writeHead(204);
            res.end();
          } else {
            getFile(res,req,  NOT_FOUND_ERROR_PAGE, "text/html", 404);
          }
        });
    } else {
      getFile(res,req,  UNSUPPORTED_TYPE_PAGE, "text/html", 415);
    }
  })
  .listen(PORT);

console.log(`Listening on port ${PORT}`);

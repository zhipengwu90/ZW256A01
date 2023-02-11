exports.errorHandler = (res) => {
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end("500 Internal Server Error");
    process.exit(1);
  };
  
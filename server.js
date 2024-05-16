const express = require('express');
const { createServer } = require('https');
const { parse } = require('url');
const next = require('next');
const fs = require('fs');

const port = 443;  // HTTPS端口
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const options = {
  key: fs.readFileSync('/root/.acme.sh/panda-website.top_ecc/panda-website.top.key'),
  cert: fs.readFileSync('/root/.acme.sh/panda-website.top_ecc/panda-website.top.cer')
};

app.prepare().then(() => {
  const server = express();

  server.all('*', (req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  createServer(options, server).listen(port, err => {
    if (err) throw err;
    console.log(`> Ready on https://localhost:${port}`);
  });
});

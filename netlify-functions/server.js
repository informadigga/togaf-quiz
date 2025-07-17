const { createServer } = require('http');
const app = require('../dist/index.js');

const server = createServer(app);

exports.handler = async (event, context) => {
  return new Promise((resolve, reject) => {
    const req = {
      method: event.httpMethod,
      url: event.path,
      headers: event.headers,
      body: event.body
    };

    const res = {
      statusCode: 200,
      headers: {},
      body: '',
      setHeader: function(name, value) {
        this.headers[name] = value;
      },
      writeHead: function(statusCode, headers) {
        this.statusCode = statusCode;
        if (headers) {
          Object.assign(this.headers, headers);
        }
      },
      write: function(chunk) {
        this.body += chunk;
      },
      end: function(chunk) {
        if (chunk) this.body += chunk;
        resolve({
          statusCode: this.statusCode,
          headers: this.headers,
          body: this.body
        });
      }
    };

    app(req, res);
  });
};
// utils/cors.js

import Cors from 'cors';

const cors = Cors({
  methods: ['GET', 'POST', 'OPTIONS'], // Allowed methods
  origin: '*', // Allow all origins
});

function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

export default function handler() {
  return async (req, res) => {
    await runMiddleware(req, res, cors);
    return handler(req, res);
  };
}

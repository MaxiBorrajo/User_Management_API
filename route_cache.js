const NodeCache = require("node-cache");
const CustomError = require("./src/global_utils/custom_error");
const CACHE = new NodeCache();

module.exports = (duration) => (req, res, next) => {
  if (req.method !== "GET") {
    return next();
  }

  const KEY = req.originalUrl;
  const CACHED_RESPONSE = CACHE.get(KEY);

  if (CACHED_RESPONSE) {
    res.send(CACHED_RESPONSE);
  } else {
    res.originalSend = res.send;
    res.send = (body) => {
      res.originalSend(body);
      CACHE.set(KEY, body, duration);
    };
    next();
  }
  
};

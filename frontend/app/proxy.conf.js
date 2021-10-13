const PROXY_CONFIG = {
    "/": {
      "target": process.env.FRONTEND_TARGET || "http://localhost:8100",
      "secure": false
    }
}

console.log('STARTING FRONTEND WITH TARGET URL: ' + PROXY_CONFIG['/'].target)

module.exports = PROXY_CONFIG;
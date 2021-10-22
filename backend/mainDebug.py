# This file is Only for debugging while running docker in dev mode.
# docker will not run this file if in production mode.
import logging
from app.mainController import app
import ptvsd


logger = logging.getLogger('app.' + __name__)  # make this logger part of the 'app' module. (that is how to distinguish app logs with vendor module logs)

# start debugging
logger.critical('CRITICAL: RUNNING IN DEBUG MODE')
try:
    ptvsd.enable_attach(address=('0.0.0.0', 8081))
except Exception as e:
    logger.warning('DEBUGGING IS DISABLED. (make sure flask is running without debug mode (environment variable FLASK_DEBUG: 0)')


if __name__ == "__main__":
    # below line set debug=False to enable debugging (I know its counterintuitive) but that will disable auto-reloading
    # set debug=True to disable debugging but enable auto-reloading app
    app.run(host="0.0.0.0", debug=True, port=8080)


# This file is Only for debugging while running docker in dev mode.
# docker will not run this file if in production mode.
import logging
from app.mainController import app
import ptvsd


logger = logging.getLogger(__name__)

if __name__ == "__main__":
    # start debugging
    logger.critical('CRITICAL: RUNNING IN DEBUG MODE')
    try:
        ptvsd.enable_attach(address=('0.0.0.0', 8081))
    except Exception as e:
        logger.warn('DEBUGGING IS DISABLED. (make sure flask is running with debug=False)')  
    # below line set debug=False to enable debugging (I know its counterintuitive) but that will disable auto-reloading
    # set debug=True to disable debugging but enable auto-reloading app
    app.run(host="0.0.0.0", debug=True, port=8080)


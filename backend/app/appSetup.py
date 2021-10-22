import logging
import socket
import sys
import os
from pathlib import Path
import atexit
from flask.app import Flask

from flask_login import LoginManager
from apscheduler.schedulers.background import BackgroundScheduler

from .auth import auth_mapper
from .auth.auth_service_google import update_google_dynamic_dns_to_current_ip
from .utils.string_utils import encoded_string_to_bytes


logger = logging.getLogger(__name__)


def __init_login_manager(app):
    # get app secret key
    app_secret_key = os.environ.get('FLASK_SECRET_KEY')
    if app_secret_key is None or len(app_secret_key) < 10:
        logger.critical('CRITICAL: App secret key not found. Generating random key and no sessions can be reclaimed')
        app_secret_key = os.urandom(24)
    else:
        encoded_string_to_bytes(app_secret_key)

    app.secret_key = app_secret_key

    login_manager = LoginManager()
    login_manager.init_app(app)

    @login_manager.user_loader
    def load_user_inner(user_id):
        return auth_mapper.get(user_id)


def __init_logger():
    formatter = logging.Formatter('[%(asctime)s] {%(filename)s:%(lineno)d - %(name)s} %(levelname)s - %(message)s')
    Path("logs/backend_logs").mkdir(exist_ok=True)

    # set up log for this project (warn/debug/console)
    warn_file_handler = logging.FileHandler(filename='logs/backend_logs/logs_warn.log')
    warn_file_handler.setLevel(logging.WARN)
    warn_file_handler.setFormatter(formatter)
    debug_file_handler = logging.FileHandler(filename='logs/backend_logs/logs_debug.log')
    debug_file_handler.setLevel(logging.DEBUG)
    debug_file_handler.setFormatter(formatter)
    stderr_handler = logging.StreamHandler(sys.stderr)
    stderr_handler.setLevel(logging.DEBUG)
    stderr_handler.setFormatter(formatter)
    # add handlers to the logger
    my_root = logging.getLogger('app')
    my_root.setLevel(logging.DEBUG)
    my_root.propagate = False
    my_root.addHandler(warn_file_handler)
    my_root.addHandler(debug_file_handler)
    my_root.addHandler(stderr_handler)

    # set up log for other modules (warn/console)
    warn_file_handler = logging.FileHandler(filename='logs/backend_logs/logs_modules_warn.log')
    warn_file_handler.setLevel(logging.WARN)
    warn_file_handler.setFormatter(formatter)
    # add handlers to the logger
    root = logging.getLogger('')
    root.setLevel(logging.INFO)
    root.addHandler(warn_file_handler)
    root.addHandler(stderr_handler)


def __setup_chron_jobs(app: Flask):

    def wrapper(func):  # wrap functions with app contect
        def wrapped_func():
            with app.app_context():
                func()
        return wrapped_func

    scheduler = BackgroundScheduler()
    # Fix to ensure only one worker grabs the scheduled task
    try:
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.bind(("127.0.0.1", 47200))
    except socket.error:
        pass
    else:
        # Shut down the scheduler when exiting the app
        atexit.register(lambda: scheduler.shutdown())
        scheduler.start()

    scheduler.add_job(func=wrapper(update_google_dynamic_dns_to_current_ip), trigger="interval", seconds=50)


__init_done = False
def setup_app(app):
    # Make sure init only called once
    global __init_done
    if __init_done:
        logger.error("setup app called twice. Should never happen")
    __init_done = True

    __init_logger()
    __init_login_manager(app)
    __setup_chron_jobs(app)
"""Main Controller of the application, the Flask app and all entrypoints are defined here."""

import logging
from flask import Flask

from .appSetup import setup_app
from .auth.auth_blueprint import bp

app = Flask(__name__)

setup_app(app)  # setup logger, login_manager, etc.


app.register_blueprint(bp, url_prefix='/api/auth')

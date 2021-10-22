import logging
from flask import Flask

app = Flask(__name__)

from .appSetup import setup_app
setup_app(app)  # setup logger, login_manager, etc.

from .auth.auth_blueprint import bp


app.register_blueprint(bp, url_prefix='/api/auth')

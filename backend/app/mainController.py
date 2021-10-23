"""Main Controller of the application, the Flask app and all entrypoints are defined here."""

from flask import Flask

from .base.appSetup import setup_app
from .auth.auth_blueprint import bp

app = Flask(__name__)

with app.app_context():
    setup_app()  # setup logger, login_manager, etc.


app.register_blueprint(bp, url_prefix='/api/auth')

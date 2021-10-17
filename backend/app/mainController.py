import logging
from flask import Flask

app = Flask(__name__)


from .auth.auth_login_manager import LoginManager  # import necessary to ensure auth_login_manager has successfully setup LoginManager
from .auth.auth_blueprint import bp


app.register_blueprint(bp, url_prefix='/api/auth')

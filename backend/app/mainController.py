"""Main Controller of the application, the Flask app and all entrypoints are defined here."""

from flask import Flask

from .base.appSetup import setup_app
from .auth.auth_blueprint import bp as auth_bp
from .pdf.pdf_blueprint import bp as pdf_bp

app = Flask(__name__)

with app.app_context():
    setup_app(app)


app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(pdf_bp, url_prefix='/api/pdf')

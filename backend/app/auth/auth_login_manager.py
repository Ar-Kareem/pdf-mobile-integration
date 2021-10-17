import os
import logging
from flask_login import LoginManager

from ..mainController import app
from . import auth_mapper
from ..utils.string_utils import encoded_string_to_bytes


logger = logging.getLogger(__name__)


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
def load_user(user_id):
    return auth_mapper.get(user_id)

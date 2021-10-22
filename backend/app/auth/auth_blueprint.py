import logging
from flask import Blueprint, request
from flask_login import current_user

from .auth_service_google import google_login, google_after_login_redirect


logger = logging.getLogger(__name__)

bp = Blueprint('auth_blueprint', __name__)


@bp.route("/", methods=['GET', 'POST'])
def index():
    return {'resp': 'AUTHENTICATED:' + str(current_user.is_authenticated)}


@bp.route("/login")
def login():
    base_url = request.base_url
    if 'http://' in base_url:  # oauth MUST use https, convert
        base_url = base_url.replace('http://', 'https://')
    redirect_uri = base_url + "/callback"
    return google_login(redirect_uri)


@bp.route('/login/callback')
def after_auth():
    # Get authorization code Google sent back to you
    user_code = request.args.get("code")
    return google_after_login_redirect(user_code)

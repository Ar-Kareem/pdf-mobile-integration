import logging
from typing import Union
from flask import Blueprint, request
from flask_login import current_user
from flask_login.mixins import AnonymousUserMixin
from flask_login.utils import login_required, logout_user

from backend.app.auth.User import User

from .auth_service_google import google_login, google_after_login_redirect


logger = logging.getLogger(__name__)

bp = Blueprint('auth_blueprint', __name__)
current_user: Union[User, AnonymousUserMixin]


@bp.route("/", methods=['GET', 'POST'])
def get_user():
    if current_user.is_authenticated and isinstance(current_user, User):
        return {
            'given_name': current_user.given_name,
            'family_name': current_user.family_name,
            'email': current_user.email,
            'picture': current_user.picture,
            'is_authenticated': current_user.is_authenticated,
        }
    else:
        return {
            'is_authenticated': current_user.is_authenticated,
            'given_name': None,
            'family_name': None,
            'email': None,
            'picture': None,
        }


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


@bp.route('/logout', methods=['POST'])
@login_required
def logout():
    resp = logout_user()
    return {'resp': resp}

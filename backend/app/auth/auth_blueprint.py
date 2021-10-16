from flask import Blueprint

auth_bp = Blueprint('auth_blueprint', __name__)

@auth_bp.route('/', methods=['GET'])
def base_auth_get():
    return 'HELLO WORLD IN AUTH!'

@auth_bp.route('/', methods=['POST'])
def base_auth():
    return {'resp': 'BLUEPRINT'}

@auth_bp.route('/redirected', methods=['POST'])
def after_auth():
    return {'resp': 'redirected'}

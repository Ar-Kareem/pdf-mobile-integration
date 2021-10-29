import logging

from flask import request
from flask.blueprints import Blueprint
from flask_login.utils import login_required


logger = logging.getLogger(__name__)

bp = Blueprint('pdf_blueprint', __name__)

last_saved_pdf = None

@bp.route("/download", methods=['POST'])
@login_required
def download():
    global last_saved_pdf
    last_saved_pdf = request.json['url']
    # with urllib.request.urlopen(request.json['url']) as f:
    #     pdf = f.read()
    #     last_saved_pdf = pdf
    return {}


@bp.route("/last_saved", methods=['POST'])
@login_required
def last_saved():
    return {'last_saved_pdf': last_saved_pdf}

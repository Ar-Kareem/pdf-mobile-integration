import logging

from flask import request
from flask.blueprints import Blueprint
from flask_login.utils import login_required
from flask import make_response

from ..utils.json_utils import deep_serialize
from ..utils.ServerError import ServerError

from . import pdf_service


logger = logging.getLogger(__name__)

bp = Blueprint('pdf_blueprint', __name__)

last_saved_pdf = None


@bp.route("/request", methods=['POST'])
@login_required
def create_request():
    try:
        result = pdf_service.create_request()
    except ServerError as e:
        return e.publicMessage, 201
    return {'result': result}


@bp.route("/get_all_request", methods=['POST'])
@login_required
def get_all_request():
    try:
        result = pdf_service.get_user_requests()
    except ServerError as e:
        return e.publicMessage, 201
    return {'result': deep_serialize(result)}


@bp.route("/download", methods=['POST'])
@login_required
def download():
    if request.json is None:
        return 'Request Format Error', 400
    req = request.json['req']
    url = request.json['url']
    try:
        pdf_service.download(req, url)
    except ServerError as e:
        return e.publicMessage, 201
    return {}


@bp.route("/progress", methods=['POST'])
@login_required
def progress():
    """Retreive the progress of a list of requests

    Args:
        req (list[str]): A list of request IDs to retreive the progress of

    Returns:
        dict[str, (int, int)]: dictionary of request IDs to the progress represented as two numbers (bytes downloaded, bytes total)
    """
    if request.json is None:
        return 'Request Format Error', 400
    req: list[str] = request.json['req']
    try:
        result = pdf_service.get_progress(req)
    except ServerError as e:
        return e.publicMessage, 201
    return {'result': result}


@bp.route("/retreive/<req>", methods=['GET'])
@login_required
def retreive(req: str):
    try:
        pdfdata = pdf_service.retreive(req)
    except ServerError as e:
        return e.publicMessage, 201

    response = make_response(pdfdata)
    response.headers.set('Content-Type', 'application/pdf')
    return response

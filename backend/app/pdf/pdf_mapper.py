import base64
import os
from typing import Dict

from flask_login import current_user

from ..models.PdfRequest import PdfRequest
from ..auth.User import User

temp_status_database: Dict[str, PdfRequest] = {}
current_user: User


def get_user_requests():
    user_requests = [pdfrequest for pdfrequest in temp_status_database.values() if pdfrequest.user == current_user.id]
    for i, r in enumerate(user_requests):
        request_copy = PdfRequest()

        request_copy.request_id = r.request_id
        request_copy.user = r.user
        request_copy.given_name = r.given_name
        request_copy.len = r.len
        request_copy.done = r.done
        request_copy.result = None
        user_requests[i] = request_copy
    return user_requests


def get_request(req: str):
    return temp_status_database[req]


def is_valid_request(req: str):
    return (req in temp_status_database) and (temp_status_database[req].user == current_user.id)


def create_request():
    req = base64.b64encode(os.urandom(10)).decode('ascii')
    new_req = PdfRequest()
    new_req.request_id = req
    new_req.user = current_user.id
    temp_status_database[req] = new_req
    return req


def set_request_content_len(req: str, content_len: int):
    temp_status_database[req].len = content_len


def set_request_done_size(req: str, done: int):
    temp_status_database[req].done = done


def set_request_result(req: str, result: bytes):
    temp_status_database[req].result = result

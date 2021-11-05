import base64
import os
from typing import Dict

from flask_login import current_user

from ..base.base_mapper import get_db
from ..models.PdfRequest import PdfRequest
from ..auth.User import User

temp_status_database: Dict[str, PdfRequest] = {}
current_user: User


def get_user_requests():
    db = get_db()
    result = db.execute(
        """
        SELECT
            request_id, user, given_name, url, len, done
        FROM
            pdf
        WHERE
            user = ?
        """, (current_user.id, )
    ).fetchall()

    results: list[PdfRequest] = []
    for r in result:
        model = PdfRequest()
        model.request_id = r[0]
        model.user = r[1]
        model.given_name = r[2]
        model.url = r[3]
        model.len = r[4]
        model.done = r[5]
        model.result = None
        results.append(model)
    return results


def get_request(req: str):
    db = get_db()
    result = db.execute(
        """
        SELECT
            request_id, user, given_name, url, len, done, result
        FROM
            pdf
        WHERE
            request_id = ? AND user = ?
        """, (req, current_user.id)
    ).fetchone()

    if not result:
        return None

    model = PdfRequest()
    model.request_id = result[0]
    model.user = result[1]
    model.given_name = result[2]
    model.url = result[3]
    model.len = result[4]
    model.done = result[5]
    model.result = result[6]
    return model

def is_valid_request(req: str):
    db = get_db()
    result = db.execute(
        """
        SELECT
            id
        FROM
            pdf
        WHERE
            request_id = ? AND user = ?
        """, (req, current_user.id)
    ).fetchone()

    return True if result else False


def create_request():
    req = base64.b64encode(os.urandom(9)).decode('ascii')
    req = req.replace('/', '_')  # / is a subdelim in url, replace with unreserved char
    req = req.replace('+', '-')  # + is a subdelim in url, replace with unreserved char

    db = get_db()
    db.execute(
        """
        INSERT INTO pdf (
            request_id, user
        ) VALUES (
            ?, ?
        )
        """, (req, current_user.id),
    )
    db.commit()
    return req


def set_request_content_len(req: str, content_len: int):
    db = get_db()
    db.execute(
        """
        UPDATE pdf
        SET len = ?
        WHERE request_id = ? AND user = ?
        """, (content_len, req, current_user.id),
    )
    db.commit()


def set_request_done_size(req: str, done: int):
    db = get_db()
    db.execute(
        """
        UPDATE pdf
        SET done = ?
        WHERE request_id = ? AND user = ?
        """, (done, req, current_user.id),
    )
    db.commit()


def set_request_url(req: str, url: str):
    db = get_db()
    db.execute(
        """
        UPDATE pdf
        SET url = ?
        WHERE request_id = ? AND user = ?
        """, (url, req, current_user.id),
    )
    db.commit()


def set_request_name(req: str, given_name: str):
    db = get_db()
    db.execute(
        """
        UPDATE pdf
        SET given_name = ?
        WHERE request_id = ? AND user = ?
        """, (given_name, req, current_user.id),
    )
    db.commit()


def set_request_result(req: str, result: bytes):
    db = get_db()
    db.execute(
        """
        UPDATE pdf
        SET result = ?
        WHERE request_id = ? AND user = ?
        """, (result, req, current_user.id),
    )
    db.commit()

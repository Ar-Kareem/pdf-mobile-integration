import logging
from typing import List
from urllib import request
import io

from ..utils.ServerError import ServerError
from . import pdf_mapper

logger = logging.getLogger(__name__)


def create_request():
    return pdf_mapper.create_request()


def get_user_requests():
    return pdf_mapper.get_user_requests()


def download(req: str, url: str):
    if not pdf_mapper.is_valid_request(req):
        raise ServerError(publicMessage='Invalid Request Parameter')

    if pdf_mapper.get_request(req).done is not None:
        raise ServerError(publicMessage='Request Already occupied by a download')

    pdf_mapper.set_request_done_size(req, -1)  # set done size to mark that download for this rquest started

    with request.urlopen(url) as response:
        content_len = response.getheader('content-length')
        block_size = 1000000  # default value

        if content_len:
            content_len = int(content_len)
            block_size = max(4096, content_len // 20)

        pdf_mapper.set_request_content_len(req, content_len)

        buffer_all = io.BytesIO()
        size = 0
        while True:
            temp_buffer = response.read(block_size)
            if not temp_buffer:
                break
            buffer_all.write(temp_buffer)
            size += len(temp_buffer)
            pdf_mapper.set_request_done_size(req, size)

        pdf_mapper.set_request_result(req, buffer_all.getvalue())


def get_progress(req_list: List[str]):
    return {r: _get_progress_single(r) for r in req_list}


def _get_progress_single(req: str):
    if not pdf_mapper.is_valid_request(req):
        raise ServerError(publicMessage='Invalid Request Parameter')

    reqObj = pdf_mapper.get_request(req)
    return reqObj.done, reqObj.len


def retreive(req: str):
    if not pdf_mapper.is_valid_request(req):
        raise ServerError(publicMessage='Invalid Request Parameter')

    return pdf_mapper.get_request(req).result

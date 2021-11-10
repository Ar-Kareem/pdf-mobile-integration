import logging
from typing import List
from urllib import request
import io
import ssl

from ..utils.ServerError import ServerError
from . import pdf_mapper

logger = logging.getLogger(__name__)


def create_request():
    return pdf_mapper.create_request()


def get_user_requests():
    return pdf_mapper.get_user_requests()


def download(req: str, url: str):
    model = pdf_mapper.get_request(req)
    if not model:
        raise ServerError(publicMessage='Invalid Request Parameter')

    if model.url is not None:
        raise ServerError(publicMessage='Request Already occupied by a download')

    pdf_mapper.set_request_url(req, url)

    # Ok to turn off here because we don't care about authenticity of url, users responsibility.
    myssl = ssl.create_default_context()
    myssl.check_hostname = False
    myssl.verify_mode = ssl.CERT_NONE
    with request.urlopen(url, context=myssl) as response:
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
    model = pdf_mapper.get_request(req)
    if not model:
        raise ServerError(publicMessage='Invalid Request Parameter')
    return model.done, model.len


def retreive(req: str):
    model = pdf_mapper.get_request(req)
    if not model:
        raise ServerError(publicMessage='Invalid Request Parameter')
    return model.result


def set_request_name(req: str, new_name: str):
    if not pdf_mapper.is_valid_request(req):
        raise ServerError(publicMessage='Invalid Request Parameter')
    if len(str(new_name)) > 128:
        raise ServerError(publicMessage='Name is too long.')
    pdf_mapper.set_request_name(req, new_name)

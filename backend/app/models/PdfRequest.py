from typing import Optional


class PdfRequest:

    request_id: str
    """The Unique ID of this request."""

    user: int
    """The Unique ID of the user that owns this request. No other user should be able to access or use this request."""

    len: Optional[int] = None
    """The Length (number of bytes) of the requested pdf."""

    done: Optional[int] = None
    """The number of bytes downloaded from the requested pdf."""

    result: Optional[bytes] = None
    """The bytes of the actual PDF downloaded."""

    given_name: Optional[str] = None
    """The name given to this PDF."""

    def serialize(self):
        return {
            'request_id': self.request_id,
            'user': self.user,
            'len': self.len,
            'done': self.done,
            'result': self.result,
            'given_name': self.given_name,
            }

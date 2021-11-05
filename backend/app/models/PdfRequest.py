from typing import Optional, Type, TypeVar


T = TypeVar('T', bound='PdfRequest')


class PdfRequest:

    request_id: str
    """The Unique ID of this request."""

    user: int
    """The Unique ID of the user that owns this request. No other user should be able to access or use this request."""

    url: Optional[str] = None
    """The source URL of the PDF to download from."""

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
            'url': self.url,
            'len': self.len,
            'done': self.done,
            'result': self.result.decode("utf-8") if self.result is not None else None,
            'given_name': self.given_name,
            }

    @classmethod
    def copy(cls: Type[T], orig: T) -> T:
        new = cls()
        new.request_id = orig.request_id
        new.user = orig.user
        new.url = orig.url
        new.len = orig.len
        new.done = orig.done
        new.result = orig.result
        new.given_name = orig.given_name
        return new

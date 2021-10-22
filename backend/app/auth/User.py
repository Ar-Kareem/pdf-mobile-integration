"""Define User Model."""
from flask_login import UserMixin


class User(UserMixin):
    """Represents a basic User Model. Inherits from UserMixin thus is understanded by flask.

    Attributes:
        id_: unique ID that identifies this user.
    """

    def __init__(self, id_):
        """Init User."""
        self.id = id_

"""Define User Model."""
from flask_login import UserMixin


class User(UserMixin):
    """Represents a basic User Model. Inherits from UserMixin thus is understanded by flask.

    Attributes:
        id_: unique ID that identifies this user.
    """

    def __init__(self, id_,
                 gid,
                 given_name,
                 family_name,
                 picture,
                 email,
                 ):
        """Init User."""
        self.id = id_
        self.gid = gid
        self.given_name = given_name
        self.family_name = family_name
        self.picture = picture
        self.email = email

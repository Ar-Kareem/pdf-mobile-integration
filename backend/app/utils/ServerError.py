"""Define Different Exceptions."""


class BaseError(Exception):
    """Base Exception Error."""


class ServerError(BaseError):
    """All Server Errors that contain a Public Message to be seen by users."""

    def __init__(self, message=None, publicMessage=None):
        """Create Base Exception with a message and a public message.

        Args:
            message (str): A message privately stored
            publicMessage (str): A public message to be seen by the user in the frontend
        """
        super().__init__(message)
        self.publicMessage = publicMessage

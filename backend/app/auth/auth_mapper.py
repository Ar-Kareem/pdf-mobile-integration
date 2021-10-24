"""Implement queries related to authorization."""
from ..base.base_mapper import get_db
from .User import User


def get_user(user_id: int):
    """Return User based on id."""
    db = get_db()
    user = db.execute(
        "SELECT * FROM user WHERE id = ?", (user_id,)
    ).fetchone()
    if not user:
        return None

    user = User(id_=user[0])
    return user


def create_user(id_: int):
    """Create new User in the database."""
    db = get_db()
    db.execute(
        "INSERT INTO user (id) "
        "VALUES (?)",
        (id_,),
    )
    db.commit()

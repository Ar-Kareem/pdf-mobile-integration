"""Implement queries related to authorization."""
from typing import Optional
from ..base.base_mapper import get_db
from .User import User


def get_user(user_id: int):
    """Return User based on id."""
    db = get_db()
    user = db.execute(
        """
        SELECT
            id,
            gid,
            first_name,
            last_name,
            email,
            picture
        FROM
            users
        WHERE
            id = ?
        """, (user_id,)
    ).fetchone()

    if not user:
        return None

    user = User(id_=user[0],
                gid=user[1],
                given_name=user[2],
                family_name=user[3],
                email=user[4],
                picture=user[5],
                )
    return user


def get_id_from_gid(gid: str) -> Optional[str]:
    """Return a User id based on the google unique id.

    Arguments:
        gid: Google Unique ID received from OAuth
    Returns:
        id: The unique user id
    """
    db = get_db()
    result = db.execute(
        """
        SELECT
            id
        FROM
            users
        WHERE
            gid = ?
        """, (gid,)
    ).fetchone()

    if not result:
        return None

    return result[0]


def create_user(gid,
                first_name,
                last_name,
                email,
                picture):
    """Create new User in the database.

    Raises:
        ValueError: When gid already exists in the database
    """
    db = get_db()
    if get_id_from_gid(gid) is not None:
        raise ValueError('User already exists with given gid.')
    db.execute(
        """
        INSERT INTO users (
            gid,
            first_name,
            last_name,
            email,
            picture
        ) VALUES (
            ?,
            ?,
            ?,
            ?,
            ?
        )
        """, (gid, first_name, last_name, email, picture),
    )
    db.commit()

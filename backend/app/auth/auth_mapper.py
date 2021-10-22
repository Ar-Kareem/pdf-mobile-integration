import sqlite3
from flask import current_app, g
from flask.cli import with_appcontext

from .User import User


def get_db():
    if "db" not in g:
        g.db = sqlite3.connect(
            "sqlite_db", detect_types=sqlite3.PARSE_DECLTYPES
        )
        g.db.row_factory = sqlite3.Row

    return g.db


def close_db(e=None):
    db = g.pop("db", None)

    if db is not None:
        db.close()


def init_db():
    db = get_db()

    sql = '''
    CREATE TABLE user (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            profile_pic TEXT NOT NULL
        );
    '''
    db.executescript(sql)


@with_appcontext
def init_db_command():
    """Clear the existing data and create new tables."""
    init_db()
    print("Initialized the database.")


def init_app(app):
    app.teardown_appcontext(close_db)
    app.cli.add_command(init_db_command)


def get_user(user_id):
    db = get_db()
    user = db.execute(
        "SELECT * FROM user WHERE id = ?", (user_id,)
    ).fetchone()
    if not user:
        return None

    user = User(id_=user[0])
    return user


def create_user(id_):
    db = get_db()
    db.execute(
        "INSERT INTO user (id) "
        "VALUES (?)",
        (id_,),
    )
    db.commit()

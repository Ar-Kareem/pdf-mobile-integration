"""Contains useful basic function to interact with the database."""
from pathlib import Path
import sqlite3
from sqlite3.dbapi2 import Connection
from flask import g


def get_db() -> Connection:
    """Get database object from flask, if not exist, will initiate a new connection and assign it to flask globals."""
    if "db" not in g:
        g.db = sqlite3.connect("/app/database/main.db")
        g.db.row_factory = sqlite3.Row
    return g.db


def close_db(exception):
    """Remove database from flask globals if exist and close the connection."""
    db = g.pop("db", None)
    if db is not None:
        db.close()


def init_db():
    """Init database, if doesn't exist, will create one."""
    Path("/app/database").mkdir(exist_ok=True)
    db = get_db()

    sql = '''
    CREATE TABLE IF NOT EXISTS user (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            profile_pic TEXT NOT NULL
        );
    '''
    db.executescript(sql)

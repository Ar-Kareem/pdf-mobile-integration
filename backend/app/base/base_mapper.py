"""Contains useful basic function to interact with the database."""
import logging
from pathlib import Path
import sqlite3
from sqlite3.dbapi2 import Connection
from flask import g

logger = logging.getLogger(__name__)


def get_db() -> Connection:
    """Get database object from flask, if not exist, will initiate a new connection and assign it to flask globals."""
    if "db" not in g:
        g.db = _get_specific_db_version(_CURRENT_DB_VERSION)
    return g.db


def _get_specific_db_version(version):
    db = sqlite3.connect(f"/app/database/main-v{version}.db")
    db.row_factory = sqlite3.Row
    return db


def close_db():
    """Remove database from flask globals if exist and close the connection."""
    db = g.pop("db", None)
    if db is not None:
        db.close()


def init_db():
    """Init database, if doesn't exist, will create one."""
    Path("/app/database").mkdir(exist_ok=True)
    db = get_db()

    sql = '''
    CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            gid TEXT NOT NULL UNIQUE,
            first_name TEXT NOT NULL,
            last_name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            picture TEXT
        );
    '''
    db.executescript(sql)

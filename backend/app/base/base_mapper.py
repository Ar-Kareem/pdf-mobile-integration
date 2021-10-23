from pathlib import Path
import sqlite3
from flask import g


def get_db():
    if "db" not in g:
        g.db = sqlite3.connect("/app/database/main.db")
        g.db.row_factory = sqlite3.Row
    return g.db


def close_db(exception):
    db = g.pop("db", None)
    if db is not None:
        db.close()


def init_db():
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

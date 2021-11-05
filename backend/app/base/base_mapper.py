"""Contains useful basic function to interact with the database."""
import logging
import os
import re
from pathlib import Path
import sqlite3
from sqlite3.dbapi2 import Connection
from flask import g

logger = logging.getLogger(__name__)

_CURRENT_DB_VERSION = 1


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
    """Init database, if doesn't exist, will create one and upgrade from previous versions if available."""
    Path("/app/database").mkdir(exist_ok=True)
    db_versions = [re.findall('v(.+)\\.', f) for f in os.listdir(Path('/app/database'))]
    db_versions = [int(v[0]) for v in db_versions if len(v) > 0]

    if len(db_versions) == 0:  # no db exists
        logger.info('No DB Found, Creating fresh one.')
    else:  # 1 or more db exists
        if max(db_versions) > _CURRENT_DB_VERSION:
            logger.error('Database Exists on file that is larger than the current app DB version. This should not be possible')
        if _CURRENT_DB_VERSION not in db_versions:
            db_versions = [v for v in db_versions if v <= _CURRENT_DB_VERSION]  # filter versions larger than current just in case
            _upgrade_db(from_version=max(db_versions), to_version=_CURRENT_DB_VERSION)

    db = get_db()
    _create_tables(db, _CURRENT_DB_VERSION)


def _create_tables(db, version):
    if version == 1:
        sql = '''
            CREATE TABLE IF NOT EXISTS users (
                    id INTEGER PRIMARY KEY,
                    gid TEXT NOT NULL UNIQUE,
                    first_name TEXT NOT NULL,
                    last_name TEXT NOT NULL,
                    email TEXT UNIQUE NOT NULL,
                    picture TEXT
                );
        '''
        db.executescript(sql)
        sql = '''
            CREATE TABLE IF NOT EXISTS pdf (
                    request_id TEXT PRIMARY KEY,
                    user INTEGER NOT NULL,
                    given_name TEXT,
                    url TEXT,
                    len INTEGER,
                    done INTEGER,
                    result BLOB
                );
        '''
        db.executescript(sql)
    else:
        logger.critical(f'Do not know how to create tables for version {version}.')
        raise ValueError(f'Do not know how to create tables for version {version}.')


def _upgrade_db(from_version: int, to_version: int):
    if from_version >= to_version:
        logger.error(f'from_version >= to_version, should not happen. {from_version}>={to_version}')
        return
    if (to_version - from_version) >= 2:  # need to upgrade more than one version
        for ver in range(from_version, to_version):
            _upgrade_db(ver, ver + 1)
        return
    logger.info(f'Upgrading from version {from_version} to {to_version}...')

    db_from = _get_specific_db_version(from_version)
    db_to = _get_specific_db_version(to_version)
    _create_tables(db_to, to_version)

    if from_version == 1 and to_version == 2:
        # users = db_from.execute('SELECT id, gid, first_name, last_name, email, picture FROM users').fetchall()
        # for u in users:
        #     db_to.execute(
        #         """INSERT INTO
        #             users (id, gid, first_name, last_name, email, picture)
        #             VALUES (?, ?, ?, ?, ?, ?)
        #         """,
        #         (u[0], u[1], u[2], u[3], u[4], u[5]),
        #     )
        db_to.commit()
    else:
        logger.error(f'Do not know how to upgrade from version {from_version} to {to_version}.')

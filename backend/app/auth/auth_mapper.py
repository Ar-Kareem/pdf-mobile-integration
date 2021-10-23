from .User import User



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

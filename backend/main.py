# This file is Only for debugging while developing outside of docker.
# docker will not run this file.

from app.mainController import app

if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True, port=5000)

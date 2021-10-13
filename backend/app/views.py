from .mainController import app

@app.route('/')
def home():
   return "hello world! test 6"

@app.route('/TESTT')
def home2():
   return "hello world! TESTT"

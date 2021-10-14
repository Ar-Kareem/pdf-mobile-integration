from .mainController import app

@app.route('/api/')
def home():
   return "hello world! test 9"

@app.route('/api/TESTT')
def home2():
   return "hello world! TESTT"

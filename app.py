from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
from chat import get_response

app = Flask(__name__)
CORS(app)

@app.get("/")

def index_get():
    return render_template("base.html")

@app.route('/login')
def login():
    return render_template("login.html")

@app.route('/admin')
def admin():
    return render_template("admin.html")

@app.route('/about')
def about_us():
    return render_template("about_us.html")


@app.post("/predict")

def predict():
    text = request.get_json().get("message")
    #TODO : check if text is valid
    response = get_response(text)
    message = {"answer" : response}
    return jsonify(message)

if __name__ == "__main__":
    app.run(debug=True)


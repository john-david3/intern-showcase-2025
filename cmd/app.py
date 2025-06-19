from flask import Flask, session, request, jsonify
from flask_session import Session
from flask_cors import CORS
import requests

app = Flask(__name__)
app.config["SECRET_KEY"] = ""
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)
CORS(app, supports_credentials=True, origins=["http://localhost:5173"])


# AUTHENTICATION ROUTES
@app.route("/signup", methods=["GET", "POST"])
def signup():
    if not request.get_json():
        return jsonify({"message": "Expected JSON data"}), 400
    
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    password2 = data.get("password2")
    location = data.get("location")

    send_data = {
        "email": email,
        "password": password,
        "password2": password2,
        "location": location
    }

    try:
        _ = requests.post("http://localhost:8080/api/signup", data=send_data)
        return jsonify({"account_created": True})
    except Exception:
        return jsonify({"account_created": False})
    
@app.route("/login", methods=["GET", "POST"])
def login():
    if not request.get_json():
        return jsonify({"message": "Expected JSON data"}), 400
    
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    send_data = {
        "email": email,
        "password": password,
    }

    try:
        res = requests.post("http://localhost:8080/api/login", data=send_data)
        res_json = res.json()

        user_id = res_json.get("user_id")
        if user_id:
            session["user_id"] = user_id
            print("Successfully added session key", session["user_id"])
            return jsonify({"logged_in": True})
        else:
            print("could get session")
            return jsonify({"logged_in": False})
        
    except Exception:
        print("exception in login")
        return jsonify({"logged_in": False})

@app.route("/logout")
def logout():
    session.clear()
    return jsonify({"logged_in": False})

# GROUP ROUTES
@app.route("/get_groups", methods=["GET", "POST"])
def get_groups():
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"error": "user not logged in"}), 401
    
    headers = {
        "X-User-ID": str(user_id),
    }

    try:
        res = requests.post("http://localhost:8080/api/get_groups", headers=headers)
        data = res.json()
        return jsonify(data)
    except Exception:
        print("Failed to get groups", flush=True)
        return jsonify({"error": "failed to get groups"})

@app.route("/create_group", methods=["GET", "POST"])
def create_group():
    if not request.get_json():
        return jsonify({"message": "Expected JSON data"}), 400

    data = request.get_json()
    name = data.get("name")
    desc = data.get("desc")
    is_random = data.get("is_random")

    if is_random == "on":
        is_random = 1
    else:
        is_random = 0

    send_data = {
        "name": name,
        "desc": desc,
        "is_random": is_random
    }

    print(send_data)

    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"error": "user not logged in"}), 401

    headers = {
        "X-User-ID": str(user_id),
    }

    try:
        res = requests.post("http://localhost:8080/api/create_group", headers=headers, data=send_data)
        data = res.json()
        return jsonify(data)
    except Exception:
        print("failed to create group", flush=True)
        return jsonify({"error": "failed to get groups"})

@app.route("/join_group", methods=["GET", "POST"])
def join_group():
    if not request.get_json():
        return jsonify({"message": "Expected JSON data"}), 400

    data = request.get_json()
    code = data.get("code")
    user_id = session.get("user_id")

    send_data = {
        "code": code
    }

    headers = {
        "X-User-ID": str(user_id),
    }

    try:
        res = requests.post("http://localhost:8080/api/join_group", headers=headers, data=send_data)
        data = res.json()
        return jsonify(data)
    except Exception:
        print("Failed to join group")
        return jsonify({"error": "failed to join group"})

@app.route("/join_random_group", methods=["GET", "POST"])
def join_random_group():
    user_id = session.get("user_id")
    headers = {
        "X-User-ID": str(user_id),
    }

    try:
        res = requests.post("http://localhost:8080/api/join_random_group", headers=headers)
        data = res.json()
        print(data)
        return jsonify(data)
    except Exception:
        print("Failed to join random group")
        return jsonify({"error": "failed to join random group"})


# GROUP PAGE ROUTES
@app.route("/get_options", methods=["GET", "POST"])
def get_options():
    """
    Returns a map of all the loadable information on the group page
    """

    if not request.get_json():
        return jsonify({"message": "Expected JSON data"}), 400

    data = request.get_json()
    group_id = data.get("group_id")

    wheel_info = get_wheel_info(group_id)

    info = {
        "wheel_info": wheel_info
    }

    return jsonify(info)


def get_wheel_info(group_id: str) -> requests.Response | None:
    send_data = {
        "group_id": group_id
    }

    try:
        r = requests.post("http://localhost:8080/api/wheel_info", data=send_data)
        return r
    except Exception:
        print("Failed to get wheel information")
        return None

@app.route("/get_group_info/<string:group_id>", methods=["GET", "POST"])
def get_group_info(group_id):
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"error": "user not logged in"}), 401

    headers = {
        "X-User-ID": str(user_id),
    }

    send_data = {
            "group_id": group_id
    }

    try:
        r = requests.post("http://localhost:8080/api/get_group_info", data=send_data, headers=headers)
        return r.json()
    except Exception:
        print("Failed to get group info")
        return None

# SESSION ROUTES
@app.route("/session_status", methods=["GET"])
def session_status():
    user_id = session.get("user_id")
    if user_id:
        return jsonify({"logged_in": True, "user_id": user_id})
    else:
        return jsonify({"logged_in": False})


# HELPER METHODS
def is_logged_in(user_id):
    pass
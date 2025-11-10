from flask import Flask, jsonify
from flask_cors import CORS
import psutil
from utils import get_uptime

app = Flask(__name__)

# Allow all origins (for dev)
CORS(app, resources={r"/*": {"origins": "*"}})

@app.route('/')
def home():
    return jsonify({"status": "Backend is running"})

@app.route('/metrics')
def metrics():
    cpu = psutil.cpu_percent(interval=1)
    memory = psutil.virtual_memory().percent
    uptime = get_uptime()
    return jsonify({
        "cpu_percent": cpu,
        "memory_percent": memory,
        "uptime": uptime
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)

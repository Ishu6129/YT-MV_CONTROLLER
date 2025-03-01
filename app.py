from flask import Flask, render_template
from flask_socketio import SocketIO, emit
import pyautogui

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")

@app.route("/")
def index():
    return render_template("index.html")

@socketio.on("moveMouse")
def move_mouse(data):
    x, y = data["x"], data["y"]
    current_x, current_y = pyautogui.position()
    pyautogui.moveTo(current_x + x, current_y + y, duration=0.1)

@socketio.on("pressKey")
def press_key(key):
    key_map = {
        "up": "up",
        "down": "down",
        "left": "left",
        "right": "right",
        "space": "space",
        "speed-up": "{",
        "speed-down": "}",
        "ctrl+w": ["ctrl", "w"]
    }
    mapped_key = key_map.get(key)
    if mapped_key:
        if isinstance(mapped_key, list):
            pyautogui.hotkey(*mapped_key)
        else:
            pyautogui.press(mapped_key)

@socketio.on("mouseClick")
def mouse_click(button):
    if button in ["left", "right"]:
        pyautogui.click(button=button)

if __name__ == '__main__':
    socketio.run(app, host="0.0.0.0", port=5000, debug=True)

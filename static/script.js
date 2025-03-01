const socket = io();
const joystick = document.getElementById("joystick");
const joystickInner = document.getElementById("joystickInner");
const buttons = document.querySelectorAll(".btn");
const leftClickBtn = document.getElementById("leftClick");
const rightClickBtn = document.getElementById("rightClick");

let isDragging = false;

joystick.addEventListener("touchstart", () => isDragging = true);
joystick.addEventListener("touchend", () => {
    isDragging = false;
    joystickInner.style.transition = "transform 0.2s ease-out";
    joystickInner.style.transform = "translate(-50%, -50%)";
    setTimeout(() => joystickInner.style.transition = "", 200);
});

joystick.addEventListener("touchmove", (event) => {
    if (!isDragging) return;

    let rect = joystick.getBoundingClientRect();
    let touch = event.touches[0];
    let x = touch.clientX - rect.left - rect.width / 2;
    let y = touch.clientY - rect.top - rect.height / 2;

    let maxDistance = 40;
    let distance = Math.sqrt(x * x + y * y);
    if (distance > maxDistance) {
        x *= maxDistance / distance;
        y *= maxDistance / distance;
    }

    joystickInner.style.transform = `translate(${x}px, ${y}px)`;
    socket.emit("moveMouse", { x: x / 2, y: y / 2 });
});

buttons.forEach(button => {
    button.addEventListener("click", () => {    
        const key = button.dataset.key;
        socket.emit("pressKey", key);
    });
});

leftClickBtn.addEventListener("click", () => socket.emit("mouseClick", "left"));
rightClickBtn.addEventListener("click", () => socket.emit("mouseClick", "right"));

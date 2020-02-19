// @ts-ignore
class MousePointer {

    constructor() {
        this.MAX_MOUSE_HISTORY = 100;
        this.mouseHistory = [];
        this.mouse = document.createElement('img');
        this.mouse.src = chrome.extension.getURL('normal.svg');
        this.mouse.classList.add('follow-cursor')
        document.body.appendChild(this.mouse);
        document.body.style.cursor = 'none'
        document.addEventListener('mousemove', this._onMouseMove)

    }

    _onMouseMove = (event) => {
        if (this.mouseHistory.length >= this.MAX_MOUSE_HISTORY) this.mouseHistory.shift();
        let x = event.clientX;
        let y = event.clientY;
        this.mouseHistory.push({
            x,
            y
        });
        let deg = 0;

        let avgX = 0;
        let avgY = 0;

        this.mouseHistory.forEach(e => {
            avgX += e.x;
            avgY += e.y;
        });

        avgX = avgX / this.MAX_MOUSE_HISTORY;
        avgY = avgY / this.MAX_MOUSE_HISTORY;

        if (avgY > y && avgX < x) {
            const sumY = avgY - y;
            const sumX = x - avgX;
            deg = this._radiansToDegrees(Math.atan(sumX / sumY));
        }
        if (avgY > y && avgX > x) {
            const sumY = avgY - y;
            const sumX = avgX - x;
            deg = this._radiansToDegrees(Math.atan(sumY / sumX)) + 270;
        }
        if (avgY < y && avgX > x) {
            const sumY = y - avgY;
            const sumX = avgX - x;
            deg = this._radiansToDegrees(Math.atan(sumX / sumY)) + 180;
        }
        if (avgY < y && avgX < x) {
            const sumY = y - avgY;
            const sumX = x - avgX;
            deg = this._radiansToDegrees(Math.atan(sumY / sumX)) + 90;
        }

        deg = this._correctAngle(deg);

        this.mouse.style.left = `${x}px`;
        this.mouse.style.top = `${y}px`;
        this.mouse.style.transform = `translateX(-30px) translateY(-30px) rotate(${deg}deg)`;
    }
    _correctAngle(angle) {
        const FULL_ANGLE = 360;
        const negative = angle < 0;
        if (negative) angle *= -1;
        angle = this._getOneSegment(angle, FULL_ANGLE);
        if (negative) angle = FULL_ANGLE - angle;
        return angle;
    }

    _getOneSegment(value, maxNumber) {
        const result = Math.floor(value / maxNumber) * maxNumber + maxNumber;
        return maxNumber - (result - value);
    }


    _radiansToDegrees(radians) {
        return radians * (180 / Math.PI);
    }



    message() {
        console.info('Follow Cursor Loaded')
    }

}

const mousePointer = new MousePointer();
mousePointer.message();
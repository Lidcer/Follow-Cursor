import { onMessage, getURL, storageGet } from "./crossBrowserSupport";

class MousePointer {
  private readonly MUTATION_OBSERVER_CONFIG: MutationObserverInit = {
    attributes: true,
    childList: true,
    subtree: true
  };
  private maxMouseHistory: number;
  private mouseHistory = [];
  private mouse = document.createElement("img");
  private deg = 0;
  private mutationObserver: MutationObserver;
  constructor(maxMouseHistory = 15) {
    this.maxMouseHistory = maxMouseHistory;
    onMessage((request, sender, sendResponse) => {
      if (request && request.type) {
        if (request.type === "sensitivity") {
          if (request.sensitivity && Number.isInteger(request.sensitivity)) {
            this.maxMouseHistory = request.sensitivity;
            if (this.mouseHistory.length > request.sensitivity) {
              while (this.mouseHistory.length > request.sensitivity) {
                this.mouseHistory.shift();
              }
            }
          }
        }
      }
    });

    this.mouse.src = getURL("assets/images/normal.svg");
    this.mouse.classList.add("follow-cursor");
    document.body.appendChild(this.mouse);
    document.body.style.cursor = "none";
    document.addEventListener("mousemove", this.onMouseMove, true);
    this.mutationObserver = new MutationObserver(this.onObserve);
    this.mutationObserver.observe(document, this.MUTATION_OBSERVER_CONFIG);
    this.removeCursors();
  }

  private removeCursors() {
    [...document.getElementsByTagName("*")].forEach(element => {
      const HTMLElement = element as HTMLElement;
      if (HTMLElement && HTMLElement.style) {
        HTMLElement.style.cursor = "none";
      }
    });
  }

  private onObserve = (mutationRecord: MutationRecord[]) => {
    mutationRecord.forEach(element => {
      const target = element.target as HTMLElement;
      if (target !== this.mouse) {
        target.style.cursor = "none";
      }
    });
  };

  private onMouseMove = event => {
    const element = document.elementFromPoint(
      event.pageX,
      event.pageY
    ) as HTMLDivElement;
    if (element && element.style) {
      element.style.cursor = "none";
    }

    if (this.mouseHistory.length >= this.maxMouseHistory)
      this.mouseHistory.shift();
    const x = event.clientX;
    const y = event.clientY;
    this.mouseHistory.push({
      x,
      y
    });
    let deg = this.deg;

    let avgX = 0;
    let avgY = 0;

    this.mouseHistory.forEach(e => {
      avgX += e.x;
      avgY += e.y;
    });

    avgX = avgX / this.maxMouseHistory;
    avgY = avgY / this.maxMouseHistory;

    if (avgY > y && avgX < x) {
      const sumY = avgY - y;
      const sumX = x - avgX;
      deg = this.radiansToDegrees(Math.atan(sumX / sumY));
    }
    if (avgY > y && avgX > x) {
      const sumY = avgY - y;
      const sumX = avgX - x;
      deg = this.radiansToDegrees(Math.atan(sumY / sumX)) + 270;
    }
    if (avgY < y && avgX > x) {
      const sumY = y - avgY;
      const sumX = avgX - x;
      deg = this.radiansToDegrees(Math.atan(sumX / sumY)) + 180;
    }
    if (avgY < y && avgX < x) {
      const sumY = y - avgY;
      const sumX = x - avgX;
      deg = this.radiansToDegrees(Math.atan(sumY / sumX)) + 90;
    }

    this.deg = this.correctAngle(deg);

    this.mouse.style.left = `${x}px`;
    this.mouse.style.top = `${y}px`;
    this.mouse.style.transform = `translateX(-30px) translateY(-30px) rotate(${deg}deg)`;
  };

  private correctAngle(angle) {
    const FULL_ANGLE = 360;
    const negative = angle < 0;
    if (negative) angle *= -1;
    angle = this.getOneSegment(angle, FULL_ANGLE);
    if (negative) angle = FULL_ANGLE - angle;
    return angle;
  }

  getOneSegment(value, maxNumber) {
    const result = Math.floor(value / maxNumber) * maxNumber + maxNumber;
    return maxNumber - (result - value);
  }

  radiansToDegrees(radians) {
    return radians * (180 / Math.PI);
  }

  message() {
    console.info("Follow Cursor Loaded");
  }
}

function main() {
  if (origin.startsWith("chrome")) return;
  storageGet("origins", data => {
    const shouldBeArray: string[] = data.origins;
    if (Array.isArray(shouldBeArray)) {
      if (shouldBeArray.includes(new URL(location.href).hostname)) return;
    }

    storageGet("sensitivity", data => {
      const mousePointer = new MousePointer(data.sensitivity);
      mousePointer.message();
    });
  });
}

onMessage((request, _sender, _sendResponse) => {
  if (request && request.type) {
    if (request.type === "refresh") location.reload();
  }
});

main();

import { Borders } from "./road";
import { Sensors } from "./sensors";
import { Car, ICar } from "./car";

export enum Key {
  LEFT = "ArrowLeft",
  RIGHT = "ArrowRight",
  FORWARD = "ArrowUp",
  BACKWARD = "ArrowDown",
}

export class CarMain extends Car {
  private sensors: Sensors;

  constructor(args: ICar) {
    super(args);
    this.forward = false;
    this.maxSpeed = 4;
    this.acceleration = this.friction * 3;
    this.addControlListeners();
    this.sensors = new Sensors({
      rayCount: 7,
      rayLength: 100,
      raySpread: Math.PI,
    });
  }

  private addControlListeners() {
    document.addEventListener("keydown", (e) => {
      switch (e.key) {
        case Key.FORWARD: {
          this.backward = false;
          this.forward = true;
          break;
        }
        case Key.BACKWARD: {
          this.forward = false;
          this.backward = true;
          break;
        }
        case Key.LEFT: {
          this.right = false;
          this.left = true;
          break;
        }
        case Key.RIGHT: {
          this.left = false;
          this.right = true;
          break;
        }
      }
    });

    document.addEventListener("keyup", (e) => {
      switch (e.key) {
        case Key.FORWARD: {
          this.forward = false;
          break;
        }
        case Key.BACKWARD: {
          this.backward = false;
          break;
        }
        case Key.LEFT: {
          this.left = false;
          break;
        }
        case Key.RIGHT: {
          this.right = false;
          break;
        }
      }
    });
  }

  public updateMainCar({
    borders,
    traffic,
  }: {
    borders: Borders;
    traffic: Car[];
  }): void {
    super.update({ borders, traffic });
    this.sensors.update({
      carAngle: this.angle,
      carX: this.x,
      carY: this.y,
      borders,
      traffic,
    });
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    if (this.damaged) {
      ctx.fillStyle = "gray";
    } else {
      ctx.fillStyle = "black";
    }
    this.sensors.draw(ctx as CanvasRenderingContext2D);
    super.draw(ctx, true);
  }
}

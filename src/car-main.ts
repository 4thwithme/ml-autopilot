import { Borders } from "./road";
import { Sensors } from "./sensors";
import { Car, ICar } from "./car";
import { Network } from "./network";
import { polysIntersect } from "./utils";
import carImg from "../img/22.png";

const img = new Image();
img.src = carImg;

export enum Key {
  LEFT = "ArrowLeft",
  RIGHT = "ArrowRight",
  FORWARD = "ArrowUp",
  BACKWARD = "ArrowDown",
}

export enum ControlType {
  KEYS = "KEYS",
  AI = "AI",
}

interface ISensors {
  rayCount: number;
  rayLength: number;
  raySpread: number;
}

export class CarMain extends Car {
  private sensors: Sensors;
  public network: Network;
  controlType: ControlType;

  constructor(args: ICar & ISensors & { controlType: ControlType }) {
    super(args);
    this.forward = false;
    this.maxSpeed = 5;
    this.acceleration = this.friction * 2.2;
    this.controlType = args.controlType;
    if (args.controlType === ControlType.KEYS) {
      this.addControlListeners();
    }
    this.sensors = new Sensors({
      rayCount: args.rayCount,
      rayLength: args.rayLength,
      raySpread: args.raySpread,
    });
    this.network = new Network({ neuronCounts: [args.rayCount, 6, 4] });
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
    if (!this.damaged) {
      super.update();
      this.damaged = this.assessDamage({ borders, traffic });
      this.sensors.update({
        carAngle: this.angle,
        carX: this.x,
        carY: this.y,
        borders,
        traffic,
      });
      const offsets = Object.values(this.sensors.readings).map((s) =>
        !!s.offset ? 1 - s.offset : 0
      );

      const outputs = Network.feedForward({
        network: this.network,
        givenInputs: offsets,
      });

      if (this.controlType === ControlType.AI) {
        this.forward = !!outputs[0];
        this.left = !!outputs[1];
        this.right = !!outputs[2];
        this.backward = !!outputs[3];
      }
    }
  }

  private assessDamage({
    borders,
    traffic,
  }: {
    borders: Borders;
    traffic: Car[];
  }): boolean {
    for (let i = 0; i < borders.length; i++) {
      if (polysIntersect(this.polygon, borders[i])) {
        return true;
      }
    }
    for (let i = 0; i < traffic.length; i++) {
      if (polysIntersect(this.polygon, traffic[i].polygon)) {
        return true;
      }
    }
    return false;
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    if (this.damaged) {
      ctx.fillStyle = "gray";
    } else {
      ctx.fillStyle = "black";
    }

    ctx.beginPath();
    ctx.moveTo(this.polygon[0].x, this.polygon[0].y);
    for (let i = 1; i < this.polygon.length; i++) {
      ctx.lineTo(this.polygon[i].x, this.polygon[i].y);
    }
    ctx.fill();

    this.sensors.draw(ctx as CanvasRenderingContext2D);
    super.draw(ctx, true);
  }
}

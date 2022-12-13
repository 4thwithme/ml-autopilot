import { Borders } from "./road";
import { Sensors } from "./sensors";
import { Car, ICar } from "./car";
import { Network } from "./network";

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
    this.maxSpeed = 3;
    this.acceleration = this.friction * 3;
    this.controlType = args.controlType;
    if (args.controlType === ControlType.KEYS) {
      this.addControlListeners();
    }
    this.sensors = new Sensors({
      rayCount: args.rayCount,
      rayLength: args.rayLength,
      raySpread: args.raySpread,
    });
    this.network = new Network({ neuronCounts: [args.rayCount, 20, 4] });
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

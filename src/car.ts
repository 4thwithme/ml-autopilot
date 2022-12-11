import { Sensors } from "./sensors";

enum Key {
  LEFT = "ArrowLeft",
  RIGHT = "ArrowRight",
  FORWARD = "ArrowUp",
  BACKWARD = "ArrowDown",
}

export interface ICar {
  x: number;
  y: number;
  width: number;
  height: number;
}

export class Car {
  private width: number;
  private height: number;
  public x: number;
  public y: number;

  private speed: number;
  public angle: number;
  private maxSpeed: number;
  private turnRate: number;
  private friction: number;
  private acceleration: number;
  private forward: boolean;
  private backward: boolean;
  private left: boolean;
  private right: boolean;
  private sensors: Sensors;

  constructor({ x, y, width, height }: ICar) {
    // size
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    // controls
    this.speed = 0;
    this.maxSpeed = 1;
    this.friction = 0.05;
    this.acceleration = 0.1;
    this.turnRate = 0.02;
    this.angle = 0;
    this.forward = false;
    this.backward = false;
    this.left = false;
    this.right = false;
    this.addControlListeners();
    this.sensors = new Sensors({
      rayCount: 6,
      rayLength: 100,
      raySpread: Math.PI,
    });
  }

  public update() {
    this.move();
    this.sensors.update({ carAngle: this.angle, carX: this.x, carY: this.y });
  }

  private move() {
    if (this.forward) this.speed = this.speed + this.acceleration;
    if (this.backward) this.speed = this.speed - this.acceleration;

    if (this.speed > this.maxSpeed * 2) this.speed = this.maxSpeed * 2;
    if (this.speed < -this.maxSpeed) this.speed = -this.maxSpeed;

    if (this.speed > 0) this.speed = this.speed - this.friction;
    if (this.speed < 0) this.speed = this.speed + this.friction;
    if (Math.abs(this.speed) < this.friction) this.speed = 0;

    if (this.speed) {
      const flip = this.speed > 0 ? 1 : -1;
      if (this.left)
        this.angle = this.angle + this.turnRate * flip * this.speed;
      if (this.right)
        this.angle = this.angle - this.turnRate * flip * this.speed;
    }

    this.x = this.x - Math.sin(this.angle) * this.speed;
    this.y = this.y - Math.cos(this.angle) * this.speed;
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

  public draw(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(-this.angle);
    ctx.beginPath();
    ctx.rect(-this.width / 2, -this.height / 2, this.width, this.height);
    ctx.fill();

    ctx.restore();
    this.sensors.draw(ctx as CanvasRenderingContext2D);
  }
}

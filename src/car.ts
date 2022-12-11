import { XY } from "./road";

export interface ICar {
  x: number;
  y: number;
  width: number;
  height: number;
}

const COLORS = ["red", "blue", "orange", "white", "green", "olive"];

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
  protected forward: boolean;
  protected backward: boolean;
  protected left: boolean;
  protected right: boolean;
  protected damaged: boolean;
  protected polygon: XY[];
  private color: string;

  constructor({ x, y, width, height }: ICar) {
    // size
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    // controls
    this.forward = false;
    this.backward = false;
    this.left = false;
    this.right = false;

    // movements
    this.speed = 0;
    this.maxSpeed = 4;
    this.friction = 0.03;
    this.acceleration = this.friction * 2;
    this.turnRate = 0.06;
    this.angle = 0;
    this.color = `rgb(
      ${Math.floor(Math.random() * 256)},
      ${Math.floor(Math.random() * 256)},
      ${Math.floor(Math.random() * 256)})
    `;

    // info
    this.damaged = false;
    this.polygon = [];
  }

  private createPolygon(): XY[] {
    const points = [];
    const rad = Math.hypot(this.width, this.height) / 2;
    const alpha = Math.atan2(this.width, this.height);
    points.push({
      x: this.x - Math.sin(this.angle - alpha) * rad,
      y: this.y - Math.cos(this.angle - alpha) * rad,
    });
    points.push({
      x: this.x - Math.sin(this.angle + alpha) * rad,
      y: this.y - Math.cos(this.angle + alpha) * rad,
    });
    points.push({
      x: this.x - Math.sin(Math.PI + this.angle - alpha) * rad,
      y: this.y - Math.cos(Math.PI + this.angle - alpha) * rad,
    });
    points.push({
      x: this.x - Math.sin(Math.PI + this.angle + alpha) * rad,
      y: this.y - Math.cos(Math.PI + this.angle + alpha) * rad,
    });

    return points;
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
      if (this.left) {
        this.angle =
          this.angle +
          (this.turnRate * flip) / Math.max(this.maxSpeed * 0.8, this.speed);
      }
      if (this.right) {
        this.angle =
          this.angle -
          (this.turnRate * flip) / Math.max(this.maxSpeed * 0.8, this.speed);
      }
    }

    this.x = this.x - Math.sin(this.angle) * this.speed;
    this.y = this.y - Math.cos(this.angle) * this.speed;
  }

  public update(): void {
    if (!this.damaged) {
      this.move();
      this.polygon = this.createPolygon();
    }
  }

  public draw(ctx: CanvasRenderingContext2D, skipColor?: boolean): void {
    if (!skipColor) {
      ctx.fillStyle = this.color;
    }
    ctx.beginPath();
    ctx.moveTo(this.polygon[0].x, this.polygon[0].y);
    for (let i = 1; i < this.polygon.length; i++) {
      ctx.lineTo(this.polygon[i].x, this.polygon[i].y);
    }
    ctx.fill();
  }
}

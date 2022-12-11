import { Borders, XY } from "./road";
import { getIntersection, lerp } from "./utils";

interface ISensors {
  rayCount: number;
  rayLength: number;
  raySpread: number;
}

type Ray = [{ x: number; y: number }, { x: number; y: number }];

type IRays = Ray[];

export class Sensors {
  private rayCount: number;
  private rayLength: number;
  private raySpread: number;
  public rays: IRays;
  private readings: Record<string, XY & { offset: number }>;

  constructor({ rayCount, rayLength, raySpread }: ISensors) {
    this.rayCount = rayCount;
    this.rayLength = rayLength;
    this.raySpread = raySpread;
    this.rays = [];
    this.readings = {};
  }

  public update({
    carAngle,
    carX,
    carY,
    borders,
  }: {
    carAngle: number;
    carX: number;
    carY: number;
    borders: Borders;
  }) {
    this.castRays({ carAngle, carX, carY });
    this.readings = {};
    for (let i = 0; i < this.rays.length; i++) {
      const reading = this.getReading({ ray: this.rays[i], borders });

      if (reading) {
        this.readings[i] = reading;
      }
    }
  }

  private getReading({
    ray,
    borders,
  }: {
    ray: Ray;
    borders: Borders;
  }): (XY & { offset: number }) | null {
    const touches: (XY & { offset: number })[] = [];

    for (let i = 0; i < borders.length; i++) {
      const touch = getIntersection(
        ray[0],
        ray[1],
        borders[i][0],
        borders[i][1]
      );

      if (touch && ray[0].x >= borders[0][0].x && ray[0].x <= borders[1][0].x) {
        touches.push(touch);
      }
    }

    if (!touches.length) {
      return null;
    } else {
      return (
        touches.reduce(
          (acc, touch) => (touch.offset < acc.offset ? touch : acc),
          touches[0]
        ) ?? null
      );
    }
  }

  private castRays({
    carAngle,
    carX,
    carY,
  }: {
    carAngle: number;
    carX: number;
    carY: number;
  }) {
    this.rays = [];
    for (let i = 0; i <= this.rayCount; i++) {
      const rayAngle =
        lerp(
          this.raySpread / 2,
          -this.raySpread / 2,
          this.rayCount <= 1 ? 0.5 : i / (this.rayCount - 1)
        ) + carAngle;

      const start = { x: carX, y: carY };
      const end = {
        x: carX - Math.sin(rayAngle) * this.rayLength,
        y: carY - Math.cos(rayAngle) * this.rayLength,
      };

      this.rays.push([start, end]);
    }
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    for (let i = 0; i < this.rayCount; i++) {
      let end = this.rays[i][1];

      if (this.readings[i]) {
        end = this.readings[i];
      }
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "yellow";
      ctx.moveTo(this.rays[i][0].x, this.rays[i][0].y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();

      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "red";
      ctx.moveTo(this.rays[i][1].x, this.rays[i][1].y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();
    }
  }
}

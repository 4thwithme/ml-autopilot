import { lerp } from "./utils";

interface ISensors {
  rayCount: number;
  rayLength: number;
  raySpread: number;
}

type IRays = [{ x: number; y: number }, { x: number; y: number }][];

export class Sensors {
  private rayCount: number;
  private rayLength: number;
  private raySpread: number;
  public rays: IRays;

  constructor({ rayCount, rayLength, raySpread }: ISensors) {
    this.rayCount = rayCount;
    this.rayLength = rayLength;
    this.raySpread = raySpread;
    this.rays = [];
  }

  public update({
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
        lerp(this.raySpread / 2, -this.raySpread / 2, i / (this.rayCount - 1)) +
        carAngle;

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
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "yellow";
      ctx.moveTo(this.rays[i][0].x, this.rays[i][0].y);
      ctx.lineTo(this.rays[i][1].x, this.rays[i][1].y);
      ctx.stroke();
    }
  }
}

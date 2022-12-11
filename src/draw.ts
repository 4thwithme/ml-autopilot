import { Car } from "./car";
import { Road } from "./road";

export function draw(
  ctx: CanvasRenderingContext2D | null,
  canvas: HTMLCanvasElement
) {
  if (ctx) {
    const road = new Road({
      x: canvas.width / 2,
      width: canvas.width * 0.9,
      laneCount: 5,
    });
    const car = new Car({
      x: road.getLaneCenter(3),
      y: 600,
      width: 30,
      height: 50,
    });

    animation();

    function animation() {
      car.update();

      canvas.height = window.innerHeight;

      ctx?.save();
      ctx?.translate(0, -car.y + canvas.height * 0.8);

      road.draw(ctx as CanvasRenderingContext2D);
      car.draw(ctx as CanvasRenderingContext2D);

      requestAnimationFrame(animation);
    }
  }
}

import { CarMain } from "./car-main";
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
    const car = new CarMain({
      x: road.getLaneCenter(3),
      y: 600,
      width: 30,
      height: 50,
    });

    const traffic = [
      new Car({
        x: road.getLaneCenter(1),
        y: 200,
        width: 30,
        height: 50,
      }),
      new Car({
        x: road.getLaneCenter(2),
        y: 100,
        width: 40,
        height: 100,
      }),
      new Car({
        x: road.getLaneCenter(3),
        y: 400,
        width: 30,
        height: 50,
      }),
    ];

    animation();

    // TODO:
    // car extends
    // check types
    // use arr methods
    // check animation frame
    // add and delete car after some actions

    function animation() {
      const bor = { borders: road.borders };
      car.update(bor);

      traffic.forEach((car) => car.update(bor));

      canvas.height = window.innerHeight;

      ctx?.save();
      ctx?.translate(0, -car.y + canvas.height * 0.8);

      road.draw(ctx as CanvasRenderingContext2D);
      car.draw(ctx as CanvasRenderingContext2D);
      traffic.forEach((car) => car.draw(ctx as CanvasRenderingContext2D));

      requestAnimationFrame(animation);
    }
  }
}

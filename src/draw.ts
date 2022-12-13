import { CarMain, ControlType } from "./car-main";
import { Car } from "./car";
import { Road } from "./road";
import { Network } from "./network";

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

    const cars = makeGeneration(300, road);

    const traffic: Car[] = new Array(100)
      .fill(0)
      .map(
        () =>
          new Car({
            x: road.getLaneCenter(Math.floor(Math.random() * 5)),
            y: -Math.floor(Math.random() * 200) * 100,
            width: 30,
            height: 50,
          })
      )
      .concat([
        new Car({
          x: road.getLaneCenter(2),
          y: 400,
          width: 30,
          height: 50,
        }),
        new Car({
          x: road.getLaneCenter(3),
          y: 200,
          width: 30,
          height: 50,
        }),
        new Car({
          x: road.getLaneCenter(1),
          y: -100,
          width: 30,
          height: 50,
        }),
      ]);

    let bestCar: CarMain = cars[0];

    document.querySelector("#save")?.addEventListener("click", (e) => {
      console.log("HERE", e, bestCar);
      bestCar &&
        localStorage.setItem("bestCar", JSON.stringify(bestCar.network));
    });

    const lsPrevBestNetwork = localStorage.getItem("bestCar");

    if (lsPrevBestNetwork) {
      for (let i = 0; i < cars.length; i++) {
        cars[i].network = JSON.parse(lsPrevBestNetwork);
        if (i != 0) {
          Network.mutate({ network: cars[i].network, mutation: 0.2 });
        }
      }
    }

    animation();

    // TODO:
    // check types
    // use arr methods
    // check animation frame
    // add and delete car after some actions

    function animation() {
      traffic.forEach((car) =>
        car.update({ borders: road.borders, traffic: [] })
      );

      cars.forEach((car) =>
        car.updateMainCar({ borders: road.borders, traffic })
      );

      canvas.height = window.innerHeight;

      bestCar = cars.reduce((res, car) => {
        if (car.y < res.y) {
          return car;
        }

        return res;
      }, cars[0]);

      ctx?.save();
      ctx?.translate(0, -bestCar.y + canvas.height * 0.8);

      road.draw(ctx as CanvasRenderingContext2D);
      traffic.forEach((car) => car.draw(ctx as CanvasRenderingContext2D));
      cars.forEach((car) => car.draw(ctx as CanvasRenderingContext2D));

      requestAnimationFrame(animation);
    }
  }

  function makeGeneration(N: number, road: Road): CarMain[] {
    return new Array(N).fill(0).map(() => {
      return new CarMain({
        x: road.getLaneCenter(3),
        y: 600,
        width: 30,
        height: 50,
        rayCount: 9,
        rayLength: 150,
        raySpread: Math.PI,
        controlType: ControlType.AI,
      });
    });
  }
}

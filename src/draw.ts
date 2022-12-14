import { CarMain, ControlType } from "./car-main";
import { Car } from "./car";
import { Road } from "./road";
import { Network } from "./network";

let bestCar: CarMain | null = null;

export function draw(
  ctx: CanvasRenderingContext2D | null,
  canvas: HTMLCanvasElement
) {
  if (ctx) {
    const road = makeRoad({ canvas });

    const cars = makeGeneration({ N: 100, road });

    const traffic = makeTraffic({ road });
    addListeners({ bestCar });
    doMutation({ cars });
    animation({
      traffic,
      road,
      cars,
      canvas,
      ctx,
    });
  }
}

function animation({
  traffic,
  road,
  cars,
  canvas,
  ctx,
}: {
  traffic: Car[];
  road: Road;
  cars: CarMain[];
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
}): void {
  traffic.forEach((car) => car.update());

  cars.forEach((car) => {
    if (!car.damaged) {
      car.updateMainCar({ borders: road.borders, traffic });
    }
  });

  canvas.height = window.innerHeight;

  bestCar = cars.reduce((res, car) => {
    if (car.y < res.y) {
      return car;
    }

    return res;
  }, cars[0]);

  const count = cars.reduce((sum, car) => (car.damaged ? sum : sum + 1), 0);

  const carsDiv = document.querySelector("#cars");

  if (carsDiv) {
    carsDiv.textContent = `${count}`;
  }

  ctx?.save();
  ctx?.translate(0, -bestCar.y + canvas.height * 0.8);

  road.draw(ctx as CanvasRenderingContext2D);
  traffic.forEach((car) => car.draw(ctx as CanvasRenderingContext2D));
  cars.forEach((car) => {
    if (!car.damaged) {
      car.draw(ctx as CanvasRenderingContext2D);
    }
  });

  requestAnimationFrame(() =>
    animation({
      traffic,
      road,
      cars,
      canvas,
      ctx,
    })
  );
}

function makeGeneration({ N, road }: { N: number; road: Road }): CarMain[] {
  return new Array(N).fill(0).map(() => {
    return new CarMain({
      x: road.getLaneCenter(2),
      y: 600,
      width: 30,
      height: 50,
      rayCount: 9,
      rayLength: 100,
      raySpread: 1.2 * Math.PI,
      controlType: ControlType.AI,
    });
  });
}

function makeTraffic({ road }: { road: Road }): Car[] {
  return new Array(50)
    .fill(0)
    .map(
      (_, i) =>
        new Car({
          x: road.getLaneCenter(Math.floor(Math.random() * 5)),
          y: -i * 200,
          width: 30,
          height: 50,
        })
    )
    .concat([
      new Car({
        x: road.getLaneCenter(2),
        y: 450,
        width: 30,
        height: 50,
      }),
      new Car({
        x: road.getLaneCenter(3),
        y: -3200,
        width: 30,
        height: 50,
      }),
      new Car({
        x: road.getLaneCenter(3),
        y: -2000,
        width: 30,
        height: 50,
      }),
    ]);
}

function makeRoad({ canvas }: { canvas: HTMLCanvasElement }): Road {
  return new Road({
    x: canvas.width / 2,
    width: canvas.width * 0.9,
    laneCount: 5,
  });
}

function addListeners({ bestCar }: { bestCar: CarMain | null }): void {
  document.querySelector("#save")?.addEventListener("click", () => {
    bestCar && localStorage.setItem("bestCar", JSON.stringify(bestCar.network));
  });

  document.querySelector("#reset")?.addEventListener("click", () => {
    localStorage.removeItem("bestCar");
  });
}

function doMutation({ cars }: { cars: CarMain[] }): void {
  const lsPrevBestNetwork = localStorage.getItem("bestCar");

  if (lsPrevBestNetwork) {
    for (let i = 0; i < cars.length; i++) {
      cars[i].network = JSON.parse(lsPrevBestNetwork);
      if (i != 0) {
        Network.mutate({ network: cars[i].network, mutation: 0.3 });
      }
    }
  }
}

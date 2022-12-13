import "./index.css";
import { draw } from "./draw";

const CANVAS = "canvas";
const CONTEXT = "2d";
const SAVE = "save";

// try {
const makeId = (str: string) => `#${str}`;

const canvas: HTMLCanvasElement | null = document.querySelector(makeId(CANVAS));
if (canvas) {
  canvas.height = window.innerHeight;
  canvas.width = 400;

  draw(canvas.getContext(CONTEXT), canvas);
}
// } catch (error) {
//   throw new Error(error as string);
// }

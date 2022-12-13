import { lerp } from "./utils";
import { Layer } from "./layer";

export interface INetwork {
  neuronCounts: number[];
}

export class Network {
  private levels: Layer[];

  constructor({ neuronCounts }: INetwork) {
    this.levels = [];
    for (let i = 0; i < neuronCounts.length - 1; i++) {
      this.levels.push(
        new Layer({
          inputNeuronsCount: neuronCounts[i],
          outputNeuronsCount: neuronCounts[i + 1],
        })
      );
    }
  }

  static feedForward({
    network,
    givenInputs,
  }: {
    network: Network;
    givenInputs: number[];
  }) {
    let outputs = Layer.feedForward({ givenInputs, layer: network.levels[0] });
    for (let i = 1; i < network.levels.length; i++) {
      outputs = Layer.feedForward({
        givenInputs: outputs,
        layer: network.levels[i],
      });
    }
    return outputs;
  }
  static mutate({
    network,
    mutation,
  }: {
    network: Network;
    mutation: number;
  }): void {
    network.levels.forEach((level) => {
      for (let i = 0; i < level.biases.length; i++) {
        level.biases[i] = lerp(
          level.biases[i],
          Math.random() * 2 - 1,
          mutation
        );
      }
      for (let i = 0; i < level.weights.length; i++) {
        for (let j = 0; j < level.weights[i].length; j++) {
          level.weights[i][j] = lerp(
            level.weights[i][j],
            Math.random() * 2 - 1,
            mutation
          );
        }
      }
    });
  }
}

export interface ILayer {
  inputNeuronsCount: number;
  outputNeuronsCount: number;
}

export class Layer {
  public inputNeurons: number[];
  public outputNeurons: number[];
  public biases: number[];
  public weights: number[][];

  constructor({ inputNeuronsCount, outputNeuronsCount }: ILayer) {
    this.inputNeurons = new Array(inputNeuronsCount);
    this.outputNeurons = new Array(outputNeuronsCount);
    this.biases = new Array(outputNeuronsCount);

    this.weights = [];

    this.setWeightsRandomized({ inputNeuronsCount, outputNeuronsCount });

    Layer.randomize({ level: this });
  }

  private setWeightsRandomized({
    inputNeuronsCount,
    outputNeuronsCount,
  }: ILayer) {
    for (let i = 0; i < inputNeuronsCount; i++) {
      this.weights[i] = new Array(outputNeuronsCount);
    }
  }

  static randomize({ level }: { level: Layer }): void {
    for (let i = 0; i < level.inputNeurons.length; i++) {
      for (let j = 0; j < level.outputNeurons.length; j++) {
        level.weights[i][j] = Math.random() * 2 - 1;
      }
    }

    for (let i = 0; i < level.biases.length; i++) {
      level.biases[i] = Math.random() * 2 - 1;
    }
  }

  static feedForward({
    layer,
    givenInputs,
  }: {
    layer: Layer;
    givenInputs: number[];
  }): number[] {
    for (let i = 0; i < layer.inputNeurons.length; i++) {
      layer.inputNeurons[i] = givenInputs?.[i] ?? 0;
    }

    for (let i = 0; i < layer.outputNeurons.length; i++) {
      let sum = 0;
      for (let j = 0; j < layer.inputNeurons.length; j++) {
        sum += layer.inputNeurons[j] * layer.weights[j][i];
      }

      if (sum > layer.biases[i]) {
        layer.outputNeurons[i] = 1;
      } else {
        layer.outputNeurons[i] = 0;
      }
    }

    return layer.outputNeurons;
  }
}

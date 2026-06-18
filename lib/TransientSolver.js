const MAX_STEPS = 100_000;

export class TransientSolver {
  constructor({ endTime, timeStep }) {
    this.endTime = endTime;
    this.timeStep = timeStep;
    this.time = 0;
    this.results = new Map();
  }

  solve() {
    let stepCount = 0;

    while (this.time <= this.endTime) {
      stepCount++;

      if (stepCount > MAX_STEPS) {
        return {
          success: false,
          error:
            `Simulation exceeded maximum of ${MAX_STEPS} steps. ` +
            `Try increasing timeStep or reducing endTime.`,
          steps: stepCount,
        };
      }

      const result = this._solveStep();
      this.results.set(this.time, result);
      this.time = parseFloat((this.time + this.timeStep).toFixed(10));
    }

    return { success: true, results: this.results };
  }

  _solveStep() {
    // Matrix solve logic goes here
    // Returns the computed values for the current timestep
    return {};
  }
}
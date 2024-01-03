class Square {
  constructor(origin, theta, length) {
    this.origin = origin;
    this.theta = theta;
    this.length = length;
  }
  generateVeritices(array) {
    let ls = this.length * Math.sin(this.theta);
    let lc = this.length * Math.cos(this.theta);
    array[0] = this.origin.x + lc;
    array[1] = this.origin.y + ls;
    array[2] = this.origin.x;
    array[3] = this.origin.y;
    array[4] = this.origin.x - ls;
    array[5] = this.origin.y + lc;
    array[6] = this.origin.x + lc;
    array[7] = this.origin.y + ls;
    array[8] = this.origin.x - ls + lc;
    array[9] = this.origin.y + lc + ls;
    array[10] = this.origin.x - ls;
    array[11] = this.origin.y + lc;
  }
  generateColorRandom(colors) {
    for (let i = 0; i < 18; i++) {
      colors[i] = Math.random();
    }
  }
  generateColorsBetweenColors(startColor, endColor, colors, factor, interval) {
    // for (let i = 0; i < 18; i = i + 3) {
    //   colors[i] = startColor.r + (endColor.r - startColor.r) * factor;
    //   colors[i + 1] = startColor.g + (endColor.g - startColor.g) * factor;
    //   colors[i + 2] = startColor.b + (endColor.b - startColor.b) * factor;
    // }
    let halfInterval = interval / 2;
    let i = 0;
    colors[i] = startColor.r + (endColor.r - startColor.r) * factor;
    colors[i + 1] = startColor.g + (endColor.g - startColor.g) * factor;
    colors[i + 2] = startColor.b + (endColor.b - startColor.b) * factor;
    i = 3;
    colors[i] = startColor.r + (endColor.r - startColor.r) * factor;
    colors[i + 1] = startColor.g + (endColor.g - startColor.g) * factor;
    colors[i + 2] = startColor.b + (endColor.b - startColor.b) * factor;
    i = 6;
    colors[i] =
      startColor.r + (endColor.r - startColor.r) * (factor + halfInterval);
    colors[i + 1] =
      startColor.g + (endColor.g - startColor.g) * (factor + halfInterval);
    colors[i + 2] =
      startColor.b + (endColor.b - startColor.b) * (factor + halfInterval);
    i = 9;
    colors[i] = startColor.r + (endColor.r - startColor.r) * factor;
    colors[i + 1] = startColor.g + (endColor.g - startColor.g) * factor;
    colors[i + 2] = startColor.b + (endColor.b - startColor.b) * factor;
    i = 12;
    colors[i] =
      startColor.r + (endColor.r - startColor.r) * (factor + halfInterval);
    colors[i + 1] =
      startColor.g + (endColor.g - startColor.g) * (factor + halfInterval);
    colors[i + 2] =
      startColor.b + (endColor.b - startColor.b) * (factor + halfInterval);
    i = 15;
    colors[i] =
      startColor.r + (endColor.r - startColor.r) * (factor + halfInterval);
    colors[i + 1] =
      startColor.g + (endColor.g - startColor.g) * (factor + halfInterval);
    colors[i + 2] =
      startColor.b + (endColor.b - startColor.b) * (factor + halfInterval);
  }
}
export default Square;

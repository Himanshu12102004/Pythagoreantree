"use strict";
import { BinaryTree, Node } from "./classes/binaryTree.js";
import Square from "./classes/square.js";
import compileShaders from "./helpers/compileShaders.js";
import createProgram from "./helpers/createProgram.js";
import createVao from "./helpers/createVao.js";
let canvas, gl;
let download = false;
function loadShaderAsync(shaderURL, callback) {
  const req = new XMLHttpRequest();
  req.open("GET", shaderURL, true);
  req.onload = function () {
    if (req.status < 200 && req.status >= 300) {
      callback("couldNot load shaders", null);
    } else {
      callback(null, req.responseText);
    }
  };
  req.send();
}
function init() {
  canvas = document.querySelector("canvas");
  gl = canvas.getContext("webgl2");
  canvas.height = innerHeight;
  canvas.width = innerWidth;
  gl.viewport(0, 0, canvas.width, canvas.height);
  if (!canvas || !gl) {
    throw new Error("Webgl not supported");
  }
  async.map(
    { vsText: "./shaders/3d.vs.glsl", fsText: "./shaders/3d.fs.glsl" },
    loadShaderAsync,
    main
  );
}
function main(loadErrors, shaders) {
  const fragmentShader = compileShaders(shaders[1], "fragmentShader", gl);
  const vertexShader = compileShaders(shaders[0], "vertexShader", gl);
  const program = createProgram(fragmentShader, vertexShader, gl);
  const controllerFolder = new dat.GUI();
  const controllers = {
    rootLength: innerWidth > 500 ? 428 : 100,
    angle: 40,
    level: 10,
  };
  const controlColors = {
    startColor: { r: 255, g: 255, b: 255 },
    endColor: { r: 0, g: 100, b: 29 },
  };
  const normalizedColors = {
    startColor: {
      r: controlColors.startColor.r / 255,
      g: controlColors.startColor.g / 255,
      b: controlColors.startColor.b / 255,
    },
    endColor: {
      r: controlColors.endColor.r / 255,
      g: controlColors.endColor.g / 255,
      b: controlColors.endColor.b / 255,
    },
  };

  // Open the Colors folder by default
  window.addEventListener("resize", () => {
    canvas.height = innerHeight;
    canvas.width = innerWidth;
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform2fv(viewportDimensionsLocation, [innerWidth, innerHeight], 0, 2);
  });

  controllerFolder.add(controllers, "angle", -90, 90).onChange(() => {
    angle = (Math.PI * controllers.angle) / 180;
    binary.root.data.origin.x = -controllers.rootLength / 2;
    binary.root.data.length = controllers.rootLength;
    let array = [];
    bufferArray = [];
    binary.root.data.generateVeritices(array);
    bufferArray = [...array];
    traverseAndUpdateLength(binary.root, 1, array);
    gl.bindVertexArray(vao);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers[0]);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(bufferArray),
      gl.STATIC_DRAW
    );
  });
  controllerFolder.add(controllers, "rootLength", 50, 1000).onChange(() => {
    binary.root.data.origin.x = -controllers.rootLength / 2;
    binary.root.data.length = controllers.rootLength;
    let array = [];
    bufferArray = [];
    binary.root.data.generateVeritices(array);
    bufferArray = [...array];

    traverseAndUpdateLength(binary.root, 1, array);
    gl.bindVertexArray(vao);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers[0]);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(bufferArray),
      gl.STATIC_DRAW
    );
  });

  const colorsFolder = controllerFolder.addFolder("Colors");

  const startColorFolder = colorsFolder.addFolder("Root Color");
  startColorFolder
    .add(controlColors.startColor, "r", 0, 255)
    .name("Red")
    .onChange(changeColor);
  startColorFolder
    .add(controlColors.startColor, "g", 0, 255)
    .name("Green")
    .onChange(changeColor);
  startColorFolder
    .add(controlColors.startColor, "b", 0, 255)
    .name("Blue")
    .onChange(changeColor);

  const endColorFolder = colorsFolder.addFolder("Leaf Color");
  endColorFolder
    .add(controlColors.endColor, "r", 0, 255)
    .name("Red")
    .onChange(changeColor);
  endColorFolder
    .add(controlColors.endColor, "g", 0, 255)
    .name("Green")
    .onChange(changeColor);
  endColorFolder
    .add(controlColors.endColor, "b", 0, 255)
    .name("Blue")
    .onChange(changeColor);
  colorsFolder.open();
  function changeColor() {
    normalizedColors.startColor.r = controlColors.startColor.r / 255;
    normalizedColors.startColor.g = controlColors.startColor.g / 255;
    normalizedColors.startColor.b = controlColors.startColor.b / 255;
    normalizedColors.endColor.r = controlColors.endColor.r / 255;
    normalizedColors.endColor.g = controlColors.endColor.g / 255;
    normalizedColors.endColor.b = controlColors.endColor.b / 255;
    binary.root.data.generateColorsBetweenColors(
      normalizedColors.startColor,
      normalizedColors.endColor,
      colors,
      0,
      1 / (controllers.level - 1)
    );
    colorArray = [...colors];
    function refillColorArray(node, level) {
      if (level == controllers.level) return;
      node.left.data.generateColorsBetweenColors(
        normalizedColors.startColor,
        normalizedColors.endColor,
        colors,
        level / (controllers.level - 1),
        1 / (controllers.level - 1)
      );
      colorArray = [...colorArray, ...colors];
      refillColorArray(node.left, level + 1);
      node.right.data.generateColorsBetweenColors(
        normalizedColors.startColor,
        normalizedColors.endColor,
        colors,
        level / (controllers.level - 1),
        1 / (controllers.level - 1)
      );
      colorArray = [...colorArray, ...colors];
      refillColorArray(node.right, level + 1);
      gl.bindVertexArray(vao);
      gl.bindBuffer(gl.ARRAY_BUFFER, buffers[1]);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array(colorArray),
        gl.STATIC_DRAW
      );
    }
    refillColorArray(binary.root, 1);
  }
  const viewportDimensionsLocation = gl.getUniformLocation(
    program,
    "viewportDimensions"
  );
  let square = new Square(
    { x: -controllers.rootLength / 2, y: -innerHeight },
    0,
    controllers.rootLength
  );
  let lastFrameTime = performance.now();
  let node = new Node(square);
  let binary = new BinaryTree(node);
  let array = [];
  let angle = (Math.PI * controllers.angle) / 180;
  square.generateVeritices(array);
  let bufferArray = [...array];
  let colors = [];
  // square.generateColorRandom(colors);
  square.generateColorsBetweenColors(
    normalizedColors.startColor,
    normalizedColors.endColor,
    colors,
    0,
    1 / (controllers.level - 1)
  );
  let colorArray = [...colors];
  insertNodeInTree(binary.root, 1, array);

  function traverseAndUpdateLength(node, level, [...array]) {
    if (level == controllers.level) return;
    node.left.data.origin.x = array[4];
    node.left.data.origin.y = array[5];
    node.left.data.theta = node.data.theta + angle;
    node.left.data.length = node.data.length * Math.cos(angle);
    node.left.data.generateVeritices(array);
    bufferArray = [...bufferArray, ...array];
    traverseAndUpdateLength(node.left, level + 1, array);
    node.right.data.origin.x = array[0];
    node.right.data.origin.y = array[1];
    node.right.data.theta = node.data.theta - (-angle + Math.PI / 2);
    node.right.data.length = node.data.length * Math.sin(angle);
    node.right.data.generateVeritices(array);
    bufferArray = [...bufferArray, ...array];
    traverseAndUpdateLength(node.right, level + 1, array);
  }
  function insertNodeInTree(node, level, [...array]) {
    if (level == controllers.level) return;
    const leftSquare = new Square(
      { x: array[4], y: array[5] },
      node.data.theta + angle,
      node.data.length * Math.cos(angle)
    );
    leftSquare.generateVeritices(array);
    // leftSquare.generateColorRandom(colors);
    leftSquare.generateColorsBetweenColors(
      normalizedColors.startColor,
      normalizedColors.endColor,
      colors,
      level / (controllers.level - 1),
      1 / (controllers.level - 1)
    );

    colorArray = [...colorArray, ...colors];
    bufferArray = [...bufferArray, ...array];
    binary.insertLeft(node, leftSquare, array);
    insertNodeInTree(node.left, level + 1, array);
    const rightSquare = new Square(
      {
        x: array[0],
        y: array[1],
      },
      node.data.theta - (-angle + Math.PI / 2),
      node.data.length * Math.sin(angle)
    );
    rightSquare.generateVeritices(array);
    // rightSquare.generateColorRandom(colors);
    rightSquare.generateColorsBetweenColors(
      normalizedColors.startColor,
      normalizedColors.endColor,
      colors,
      level / (controllers.level - 1),
      1 / (controllers.level - 1)
    );
    colorArray = [...colorArray, ...colors];
    bufferArray = [...bufferArray, ...array];
    binary.insertRight(node, rightSquare);
    insertNodeInTree(node.right, level + 1, array);
  }
  gl.uniform2fv(viewportDimensionsLocation, [innerWidth, innerHeight], 0, 2);
  const vertices = new Float32Array(bufferArray);
  const colorBuffer = new Float32Array(colorArray);
  const { vao, buffers } = createVao(
    [
      {
        bufferArray: vertices,
        location: gl.getAttribLocation(program, "vertex"),
        howToRead: 2,
        normalized: false,
      },

      {
        bufferArray: colorBuffer,
        location: gl.getAttribLocation(program, "colors"),
        howToRead: 3,
        normalized: true,
      },
    ],
    gl
  );
  binary.traverse(binary.root);

  function gameLoop() {
    requestAnimationFrame(gameLoop);

    changeColor();
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
    gl.bindVertexArray(vao);
    gl.drawArrays(gl.TRIANGLES, 0, bufferArray.length / 2);
    if (download == true) {
      downloadScreenshot();
      download = false;
    }
  }
  gameLoop();
}

try {
  init();
} catch (err) {
  console.error(err);
}
function downloadScreenshot() {
  const link = document.createElement("a");
  link.style.display = "none";

  const screenshotDataUrl = canvas.toDataURL("image/png");

  link.href = screenshotDataUrl;

  link.download = "screenshot.png";

  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
}

const screenshotButton = document.getElementById("screenshot");
screenshotButton.addEventListener("click", () => {
  download = true;
});

function compileShaders(shaderSourceCode, shaderType, gl) {
  let shader;
  if (shaderType == "vertexShader") {
    shader = gl.createShader(gl.VERTEX_SHADER);
  } else if (shaderType === "fragmentShader") {
    shader = gl.createShader(gl.FRAGMENT_SHADER);
  } else throw new Error("Not valid shader type");
  gl.shaderSource(shader, shaderSourceCode);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(shader));
  }
  return shader;
}
export default compileShaders;

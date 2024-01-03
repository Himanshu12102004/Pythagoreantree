import createBuffer from "./createBuffer.js";

function createVao(bufferInfoArray, gl) {
  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);
  let buffers = [];
  bufferInfoArray.forEach((bufferInfo, index) => {
    const bufferArray = bufferInfo.bufferArray;
    buffers.push(createBuffer(bufferArray, gl));
    gl.enableVertexAttribArray(bufferInfo.location);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers[index]);
    gl.vertexAttribPointer(
      bufferInfo.location,
      bufferInfo.howToRead,
      gl.FLOAT,
      bufferInfo.normalized,
      0,
      0
    );
  });
  return { vao, buffers };
}
export default createVao;

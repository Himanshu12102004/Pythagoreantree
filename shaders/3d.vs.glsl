#version 300 es
precision highp float;
in vec2 vertex;
in vec3 colors;
out vec3 vertexColor;
uniform vec2 viewportDimensions;
void main(){
  vertexColor=colors;
  gl_Position=vec4(vertex.x/viewportDimensions.x,vertex.y/viewportDimensions.y,0.0,1.0);

}
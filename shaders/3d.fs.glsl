#version 300 es
precision highp float;
out vec4 color;
in vec3 vertexColor;
void main(){
  color=vec4(vertexColor,1.0);
}
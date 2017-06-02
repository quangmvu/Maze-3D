//Helper functions for WebGL

//set up the canvas for WebGL use
function initWebGL(canvas) {
  if(!canvas){
  	alert("Canvas is null.");
  }
  
  var gl = null;
  
  // Try to grab the standard context. If it fails, fallback to experimental.
  gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
  
  // If we don't have a GL context, give up now
  if (!gl) {
  	alert("Unable to initialize WebGL. Your browser may not support it.");
    console.log("Unable to initialize WebGL. Your browser may not support it.");
  }
  
  return gl;
}


//function for managing shaders
function getShader(gl, id, type) {
  var shaderScript, theSource, currentChild, shader;
  
  //get the shader script from the main HTML document
  shaderScript = document.getElementById(id);
  
  if (!shaderScript) {
    return null;
  }
  
  //the text of the shader script
  theSource = shaderScript.text;
  
  //determine which type of shader it is
  
  //wasn't specified as a parameter
  if (!type) {
    if (shaderScript.type == "x-shader/x-fragment") {
      type = gl.FRAGMENT_SHADER;
    } else if (shaderScript.type == "x-shader/x-vertex") {
      type = gl.VERTEX_SHADER;
    } else {
      // Unknown shader type
      return null;
    }
  }
  
  //create the shader
  shader = gl.createShader(type);
  
  //apply the source to the new shader
  gl.shaderSource(shader, theSource);
    
  // Compile the shader program
  gl.compileShader(shader);  
    
  // See if it compiled successfully
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {  
  	  alert("Shader compile error. See console.");
      console.log("An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader));  
      gl.deleteShader(shader);
      return null;  
  }
    
  return shader;
}

function initShaders(gl, fragmentName, vertexName) {
  var fragmentShader = getShader(gl, fragmentName);
  var vertexShader = getShader(gl, vertexName);
  
  // Create the shader program
  
  var shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);
  
  // If creating the shader program failed, alert
  
  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert("Shader link error. See console.");
    console.log("Unable to initialize the shader program: " + gl.getProgramInfoLog(shader));
    return null;
  }
  
  gl.useProgram(shaderProgram);
  
  return shaderProgram;

}

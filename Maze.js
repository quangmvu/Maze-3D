//WebGL
var DEBUG = false;

//a global object to hold data from WebGL and HTML
var glApp = {
    //CONSTANTS
    MAX_VERTS: 100,
    ERROR: 0,
    SUCCESS: 1,
    WALL_TEXTURE_NAME: "wall.jpg",
    FLOOR_TEXTURE_NAME: "floor.jpg",

    //Application properties
    canvas: null,        //The document's canvas object
    gl: null,            //gl context
    shaderProg: null,    //The shader program

    //Transforms matrices
    modelMatrix: null,
    viewMatrix: null,
    projMatrix: null,
    mvpMatrix: null,
    mvMatrix: null,

    //Shader variable locations
    a_position: null,    //storage location for the a_position attribute
    a_color: null,       //storage location for the a_color attribute
    a_texCoord: null,    //storage location for the texture coordinate attribute
    a_normal: null,      //storage location for the normal vectors

    u_flag: null,
    u_mvpMatrix: null,   //storage location for the u_mvpMatrix uniform
    u_texSampler0: null,     //storage location for the sampler uniform
    u_texSampler1: null,     //storage location for the sampler uniform
    u_lightPosition1: null,
    u_lightPosition2: null,
    u_lightColor: null,
    u_ambColor: null,
    u_specPower: null,
    u_mvMatrix: null,
    u_normMatrix: null,
    u_viewerPosition: null,

    //Buffers
    vertexBuffer: null,
    colorBuffer: null,
    colorBuffer2: null,
    indexBuffer: null,
    textureBuffer: null,
    normalBuffer: null,

    //Texture variables
    wallImage: null,
    floorImage:null,
    wallTexture: null,
    floorTexture:null,

    //Point and color data
    numPoints: 24,

    //Geometry from:
    // https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial/Creating_3D_objects_using_WebGL

    points: new Float32Array([
        // Front face
        -1.0, -1.0, 1.0,
        1.0, -1.0, 1.0,
        1.0, 1.0, 1.0,
        -1.0, 1.0, 1.0,
        // Back face
        -1.0, -1.0, -1.0,
        1.0, -1.0, -1.0,
        1.0, 1.0, -1.0,
        -1.0, 1.0, -1.0,
        // Top face
        -1.0, 1.0, -1.0,
        -1.0, 1.0, 1.0,
        1.0, 1.0, 1.0,
        1.0, 1.0, -1.0,
        // Bottom face
        -1.0, -1.0, -1.0,
        1.0, -1.0, -1.0,
        1.0, -1.0, 1.0,
        -1.0, -1.0, 1.0,
        // Right face
        1.0, -1.0, -1.0,
        1.0, 1.0, -1.0,
        1.0, 1.0, 1.0,
        1.0, -1.0, 1.0,
        // Left face
        -1.0, -1.0, -1.0,
        -1.0, 1.0, -1.0,
        -1.0, 1.0, 1.0,
        -1.0, -1.0, 1.0
    ]),

    colors: new Float32Array([
        // Front face: white
        0.0,  0.0,  0.0,  0.0,      0.0,  0.0,  0.0,  0.0,
        0.0,  0.0,  0.0,  0.0,      0.0,  0.0,  0.0,  0.0,
        // Back face: red
        0.0,  0.0,  0.0,  0.0,      0.0,  0.0,  0.0,  0.0,
        0.0,  0.0,  0.0,  0.0,      0.0,  0.0,  0.0,  0.0,
        // Top face: green
        0.0,  0.0,  0.0,  0.0,      0.0,  0.0,  0.0,  0.0,
        0.0,  0.0,  0.0,  0.0,      0.0,  0.0,  0.0,  0.0,
        // Bottom face: blue
        0.0,  0.0,  0.0,  0.0,      0.0,  0.0,  0.0,  0.0,
        0.0,  0.0,  0.0,  0.0,      0.0,  0.0,  0.0,  0.0,
        // Right face: yellow
        0.0,  0.0,  0.0,  0.0,      0.0,  0.0,  0.0,  0.0,
        0.0,  0.0,  0.0,  0.0,      0.0,  0.0,  0.0,  0.0,
        // Left face: purple
        0.0,  0.0,  0.0,  0.0,      0.0,  0.0,  0.0,  0.0,
        0.0,  0.0,  0.0,  0.0,      0.0,  0.0,  0.0,  0.0,
    ]),

    colors2: new Float32Array([
        //
        1.0,  1.0,  1.0,  1.0,    // white
        1.0,  0.0,  0.0,  1.0,    // red
        0.0,  1.0,  0.0,  1.0,    // green
        0.0,  0.0,  1.0,  1.0,     // blue
        //
        1.0,  1.0,  1.0,  1.0,    // white
        1.0,  0.0,  0.0,  1.0,    // red
        0.0,  1.0,  0.0,  1.0,    // green
        0.0,  0.0,  1.0,  1.0,     // blue
        //
        1.0,  1.0,  1.0,  1.0,    // white
        1.0,  0.0,  0.0,  1.0,    // red
        0.0,  1.0,  0.0,  1.0,    // green
        0.0,  0.0,  1.0,  1.0,     // blue
        //
        1.0,  1.0,  1.0,  1.0,    // white
        1.0,  0.0,  0.0,  1.0,    // red
        0.0,  1.0,  0.0,  1.0,    // green
        0.0,  0.0,  1.0,  1.0,     // blue
        //
        1.0,  1.0,  1.0,  1.0,    // white
        1.0,  0.0,  0.0,  1.0,    // red
        0.0,  1.0,  0.0,  1.0,    // green
        0.0,  0.0,  1.0,  1.0,     // blue
        //
        1.0,  1.0,  1.0,  1.0,    // white
        1.0,  0.0,  0.0,  1.0,    // red
        0.0,  1.0,  0.0,  1.0,    // green
        0.0,  0.0,  1.0,  1.0,     // blue
    ]),


    numIndices: 36,
    indices: new Uint16Array([
        0,  1,  2,      0,  2,  3, 	//front
        4,  5,  6,      4,  6,  7,    // back
        8,  9,  10,     8,  10, 11,   // top
        12, 13, 14,     12, 14, 15,   // bottom
        16, 17, 18,     16, 18, 19,   // right
        20, 21, 22,     20, 22, 23    // left
    ]),

    texCoords: new Float32Array([
        // Front 1
        0, 0, 1, 0, 1, 1, 0, 1,
        // Back  6
        0, 0, 1, 0, 1, 1, 0, 1,
        // Top   3
        0, 0, 1, 0, 1, 1, 0, 1,
        // Bottom 4
        0, 0, 1, 0, 1, 1, 0, 1,
        // Right 2
        0, 0, 1, 0, 1, 1, 0, 1,
        // Left  5
        0, 0, 1, 0, 1, 1, 0, 1,
    ]),

    normals: new Float32Array([
        //Front
        0, 0, 1,  0, 0, 1,  0, 0, 1,  0, 0, 1,
        //Back
        0, 0, -1,  0, 0, -1,  0, 0, -1,  0, 0, -1,
        //Top
        0, 1, 0,  0, 1, 0,  0, 1, 0,  0, 1, 0,
        //Bottom
        0, -1, 0,  0, -1, 0,  0, -1, 0,  0, -1, 0,
        //Right
        1, 0, 0,  1, 0, 0,  1, 0, 0,  1, 0, 0,
        //Left
        -1, 0, 0,  -1, 0, 0,  -1, 0, 0,  -1, 0, 0
    ]),

    lightPosition1: new Float32Array([100, 100, 100]),
    lightPosition2: new Float32Array([-100, 100, -100]),
    lightColor: new Float32Array([0.75, 0.75, 0.75]) ,
    ambColor: new Float32Array([0.0, 0.0, 0.1]) ,
    specPower:  100,

    //navigation stuff
    pos: null,
    dir: null,
    lookAt: null,

    //playing music
    music: null
}; //end glApp  object definition


glApp.init = function() {
    console.log("init called.");

    if(!this.setupCanvas()){
        return;
    }

    this.setupTextures();

    if(!this.setupShaderVariables()){
        return;
    }

    this.setupMatrices();


    if(!this.setupBuffers()){
        return;
    }

    this.setupUniformValues();

    this.setupGLProps();


    document.onkeydown = function(evt){glApp.onKeyDown(evt)};

    this.music = new Audio("music.mp3");
    this.music.play();

    //this.draw();
    console.log("init complete.");
}

glApp.setupCanvas = function(){
    this.canvas = document.getElementById("glCanvas");

    if(!this.canvas){
        console.log("Cannot load canvas by id.");
        return this.ERROR;
    }

    // Initialize the GL context
    this.gl = initWebGL(this.canvas);

    // Only continue if WebGL is available and working
    if (!this.gl) {
        console.log("Cannot load gl context from canvas.");
        return this.ERROR;
    }

    //initialize the shaders into a program
    this.shaderProg = initShaders(this.gl, "shader-fs", "shader-vs");

    if(!this.shaderProg){
        console.log("Can't initialize shaders.");
        return this.ERROR;
    }

    return this.SUCCESS;
}


glApp.setupGLProps = function(){
    // Set clear color to black, fully opaque
    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
    // Enable depth testing
    this.gl.enable(this.gl.DEPTH_TEST);

}

glApp.getShaderAttrib = function(name){

    var attr = this.gl.getAttribLocation(this.shaderProg, name);

    if(this.a_position < 0){
        console.log("Failed to get storage location of " + name);
        this.checkError(name + " Attribute");
        return -1;
    }
    return attr;
}

glApp.getShaderUniform = function(name){

    var attr = this.gl.getUniformLocation(this.shaderProg, name);

    if(this.a_position < 0){
        console.log("Failed to get storage location of " + name);
        this.checkError(name + " Attribute");
        return -1;
    }
    return attr;
}

glApp.setupShaderVariables = function (){
    //set up the vertex shaders attribute
    this.a_position = this.getShaderAttrib("a_position");
    this.a_color = this.getShaderAttrib("a_color");
    this.a_texCoord = this.getShaderAttrib("a_texCoord");
    this.a_normal = this.getShaderAttrib("a_normal");

    this.u_flag = this.getShaderUniform("u_flag");

    this.u_mvpMatrix = this.getShaderUniform("u_mvpMatrix");
    this.u_mvMatrix = this.getShaderUniform("u_mvMatrix");
    this.u_texSampler0 = this.getShaderUniform("u_texSampler0");
    this.u_texSampler1 = this.getShaderUniform("u_texSampler1");
    this.u_lightPosition1 = this.getShaderUniform("u_lightPosition[0]");
    this.u_lightPosition2 = this.getShaderUniform("u_lightPosition[1]");
    this.u_lightColor = this.getShaderUniform("u_lightColor");
    this.u_ambColor = this.getShaderUniform("u_ambColor");
    this.u_specPower = this.getShaderUniform("u_specPower");
    this.u_mvMatrix = this.getShaderUniform("u_mvMatrix");
    this.u_normMatrix = this.getShaderUniform("u_normMatrix");
    this.u_viewerPosition = this.getShaderUniform("u_viewerPosition");
    this.u_debug = this.getShaderUniform("u_debug");

    return this.SUCCESS;
}

glApp.setupMatrices = function() {

    this.modelMatrix = mat4.create();
    this.viewMatrix = mat4.create();
    this.projMatrix = mat4.create();
    this.mvpMatrix = mat4.create();
    this.mvMatrix = mat4.create();

    this.pos = vec3.create();
    this.dir = vec3.create();
    this.lookAt = vec3.create();

    vec3.set(this.pos, 4, 0, -4);
    vec3.set(this.dir, 0, 0, -1);
    vec3.add(this.lookAt, this.pos, this.dir);

    mat4.identity(this.modelMatrix);

    mat4.lookAt(this.viewMatrix,
        this.pos,    //location
        //[0, 0, 10],
        this.lookAt,
        //[0, 0, 0],    //looking
        [0, 1, 0]);   //up

    mat4.perspective(this.projMatrix,
        Math.PI/8, //vertical field of view
        this.canvas.width/this.canvas.height,      //aspect ratio width/height
        2,      //near distance
        -10);    //far distance


}

glApp.setupBuffers = function () {

    //set up the vertex buffer
    this.vertexBuffer = this.gl.createBuffer();
    if(!this.vertexBuffer){
        console.log("Unable to create vertex buffer.");
        this.checkError("Create vertex buffer");
        return this.ERROR;
    }

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, this.points, this.gl.STATIC_DRAW);
    this.gl.vertexAttribPointer(this.a_position, 3, this.gl.FLOAT, false, 0, 0);
    this.gl.enableVertexAttribArray(this.a_position);


    //set up the color buffer

    this.colorBuffer = this.gl.createBuffer();
    if(!this.colorBuffer){
        console.log("Unable to create color buffer.");
        this.checkError("Create color buffer");
        return this.ERROR;
    }

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, this.colors, this.gl.STATIC_DRAW);
    this.gl.vertexAttribPointer(this.a_color, 4, this.gl.FLOAT, false, 0, 0);
    this.gl.enableVertexAttribArray(this.a_color);

    //set up the color buffer 2

    this.colorBuffer2 = this.gl.createBuffer();
    if(!this.colorBuffer2){
        console.log("Unable to create color buffer.");
        this.checkError("Create color buffer");
        return this.ERROR;
    }

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer2);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, this.colors2, this.gl.STATIC_DRAW);
    this.gl.vertexAttribPointer(this.a_color, 4, this.gl.FLOAT, false, 0, 0);
    this.gl.enableVertexAttribArray(this.a_color);

    //set up index buffer
    this.indexBuffer = this.gl.createBuffer();
    if(!this.indexBuffer){
        console.log("Unable to create index buffer.");
        this.checkError("Create index buffer");
        return this.ERROR;
    }
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, this.indices, this.gl.STATIC_DRAW);

    //set up texture buffer
    this.textureBuffer = this.gl.createBuffer();
    if(!this.textureBuffer){
        console.log("Unable to create texture buffer.");
        this.checkError("Create texture buffer");
        return this.ERROR;
    }
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.textureBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, this.texCoords, this.gl.STATIC_DRAW);
    this.gl.vertexAttribPointer(this.a_texCoord, 2, this.gl.FLOAT, false, 0, 0);
    this.gl.enableVertexAttribArray(this.a_texCoord);

    //set up normal buffer
    this.normalBuffer = this.gl.createBuffer();
    if(!this.normalBuffer){
        console.log("Unable to create normal buffer.");
        this.checkError("Create normal buffer");
        return this.ERROR;
    }
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.normalBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, this.normals, this.gl.STATIC_DRAW);
    this.gl.vertexAttribPointer(this.a_normal, 3, this.gl.FLOAT, false, 0, 0);
    this.gl.enableVertexAttribArray(this.a_normal);


    return this.SUCCESS;
}

glApp.setupUniformValues = function(){
    this.gl.uniform3fv(this.u_lightPosition1, this.lightPosition1);
    this.checkError("Set light position 1");
    this.gl.uniform3fv(this.u_lightPosition2, this.lightPosition2);
    this.checkError("Set light position 2");
    this.gl.uniform3fv(this.u_lightColor, this.lightColor);
    this.checkError("Set light colors");
    this.gl.uniform3fv(this.u_ambColor, this.ambColor);
    this.checkError("Set ambient color");
    this.gl.uniform1f(this.u_specPower, this.specPower);
    this.checkError("Set specular power");
    this.gl.uniform1i(this.u_debug, DEBUG);
    this.checkError("Set debug");

}

glApp.setupTextures = function() {
    this.floorTexture = this.gl.createTexture();
    this.floorImage = new Image();
    this.floorImage.onload = function() { glApp.handleFloorTextureLoaded(); }
//begin loading the image
    this.floorImage.src = this.FLOOR_TEXTURE_NAME;

    this.wallTexture = this.gl.createTexture();
    this.wallImage = new Image();
    this.wallImage.onload = function() { glApp.handleWallTextureLoaded(); }
//begin loading the image
    this.wallImage.src = this.WALL_TEXTURE_NAME;
}

//called when the image loads
glApp.handleWallTextureLoaded = function() {
    //console.log("handleTextureLoaded, image = " + this.image);
    //console.log("handleTextureLoaded, texture = " + this.texture);


    this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis

    //bind a wall texture to a target type
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.wallTexture);
    this.checkError("Bind Wall Texture");

    //specify a wall 2D texture image
    this.gl.texImage2D(this.gl.TEXTURE_2D, 0,          //level of detail
        this.gl.RGBA, this.gl.RGBA,     //internal and data format
        this.gl.UNSIGNED_BYTE,          //8 bits per component
        this.wallImage);                   //image data

    this.checkError("texImage2D");

    //set how the image is scaled
    //set the magnification filter
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
    //set the minification filter
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR_MIPMAP_NEAREST);

    //set up texture scaling (lower resolution for further away)
    this.gl.generateMipmap(this.gl.TEXTURE_2D);


    this.checkError("gen Mipmap");

    //unbind texture?
    this.gl.bindTexture(this.gl.TEXTURE_2D, null);

    //wait until we get the image to draw
    this.draw();
}

glApp.handleFloorTextureLoaded = function() {
    //console.log("handleTextureLoaded, image = " + this.image);
    //console.log("handleTextureLoaded, texture = " + this.texture);


    this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis

    //bind a wall texture to a target type
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.floorTexture);
    this.checkError("Bind Floor Texture");

    //specify a wall 2D texture image
    this.gl.texImage2D(this.gl.TEXTURE_2D, 0,          //level of detail
        this.gl.RGBA, this.gl.RGBA,     //internal and data format
        this.gl.UNSIGNED_BYTE,          //8 bits per component
        this.floorImage);                   //image data

    this.checkError("texImage2D");

    //set how the image is scaled
    //set the magnification filter
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
    //set the minification filter
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR_MIPMAP_NEAREST);

    //set up texture scaling (lower resolution for further away)
    this.gl.generateMipmap(this.gl.TEXTURE_2D);

    this.checkError("gen Mipmap");

    //unbind texture?
    this.gl.bindTexture(this.gl.TEXTURE_2D, null);

    //wait until we get the image to draw
    this.draw();
}

glApp.getGLCanvasPoint = function (event){
    var x = event.clientX;
    var y = event.clientY;

    //console.log("Click: " + x + ", " + y);

    var rect = this.canvas.getBoundingClientRect();

    x = ((x - rect.left) - this.canvas.width/2) / (this.canvas.width/2);
    y = (this.canvas.height/2 - (y - rect.top)) / (this.canvas.height/2);

    //console.log(" to: " + x + ", " + y);

    return [x, y];
}

glApp.draw = function(){
    //inner maze walls
    var walls = [
        [8, 6], [8, 8], [8, 10], [8, 12], [8, 14], [8,16], [8,18], [8,20], [8,22], [8, 24], [8, 30], [8, 32], [8,34],
        [10, 6], [10, 12], [10, 34],
        [12, 6], [12, 12], [12, 34],
        [14, 6], [14, 12], [14, 14], [14, 16], [14, 18], [14, 20], [14,22], [14, 24], [14, 26], [14, 28], [14,34],
        [16, 12], [16, 34],
        [18, 12], [18, 34],
        [20, 2], [20, 4], [20, 6], [20, 8], [20, 10],[20, 12], [20, 18], [20, 20], [20, 22], [20, 24], [20, 26],
        [20, 28], [20, 30], [20, 32], [20, 34], [20, 36], [20, 38],
        [22, 12], [22, 34],
        [24, 12], [24, 34],
        [26, 6], [26, 12], [26, 14], [26, 16], [26, 18], [26, 20], [26,22], [26, 24], [26, 26], [26, 28], [26,34],
        [28, 6], [28, 12], [28, 34],
        [30, 6], [30, 12], [30, 34],
        [32, 6], [32, 8], [32, 10], [32, 12], [32, 14], [32,16], [32,18], [32,20], [32,22], [32, 24], [32, 30], [32, 32], [32,34]
    ];
    var xPos = 0.0;
    var yPos = 0.0;
    var zPos = 0.0;
    var originalModelMatrix = mat4.create();

    //clear color and depth buffer
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    //setup view position
    var viewPos = vec3.create();
    mat4.getTranslation(viewPos, this.viewMatrix); //this.viewMatrix);
    this.gl.uniform3fv(this.viewerPosition, viewPos);

    //set up the texture
    this.gl.uniform1i(this.u_flag, 0);
    this.gl.uniform1i(this.u_texSampler0, 0);
    this.gl.activeTexture(this.gl.TEXTURE0);
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.wallTexture);

    //outer walls
    for(var i = 0; i < 80; i++) {
        //set up color
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer);
        this.gl.vertexAttribPointer(this.a_color, 4, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(this.a_color);

        mat4.translate(this.modelMatrix, this.modelMatrix, [xPos, yPos, zPos]);

        if(i < 20) {
            //starting point color
            if(i == 1 || i == 2){
                this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer2);
                this.gl.vertexAttribPointer(this.a_color, 4, this.gl.FLOAT, false, 0, 0);
                this.gl.enableVertexAttribArray(this.a_color);
            }
            xPos = 2.0;
        }

        else if(i >= 20 && i < 40){
            xPos = 0;
            zPos = -2.0;
        }
        else if(i >= 40 && i < 60){
            //finishing point color
            if(i == 41 || i == 42){
                this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer2);
                this.gl.vertexAttribPointer(this.a_color, 4, this.gl.FLOAT, false, 0, 0);
                this.gl.enableVertexAttribArray(this.a_color);
            }
            xPos = -2;
            zPos = 0;
        }
        else{
            xPos = 0;
            zPos = 2;
        }

        //setup normal matrix
        var ivMat = mat3.create();
        mat3.fromMat4(ivMat, this.modelMatrix);
        mat3.invert(ivMat, ivMat);
        mat3.transpose(ivMat, ivMat);
        this.gl.uniformMatrix3fv(this.u_normMatrix, false, ivMat);

        //set up the Model-View-Projection matrix (mvp)
        mat4.mul(this.mvMatrix, this.viewMatrix, this.modelMatrix);
        mat4.mul(this.mvpMatrix, this.projMatrix, this.mvMatrix);

        //send the mvp
        this.gl.uniformMatrix4fv(this.u_mvpMatrix, false, this.mvpMatrix);
        this.checkError("Set mvp");
        this.gl.uniformMatrix4fv(this.u_mvMatrix, false, this.mvMatrix);
        this.checkError("Set mv");

        //draw it all
        //this.gl.drawArrays(this.gl.POINTS, 0, this.numPoints);
        this.gl.drawElements(this.gl.TRIANGLES, this.numIndices, this.gl.UNSIGNED_SHORT, 0);
        this.checkError("draw Arrays");
    }

    //inner walls
    mat4.translate(originalModelMatrix, this.modelMatrix, [xPos, yPos, 2]);
    mat4.translate(this.modelMatrix, this.modelMatrix, [xPos, yPos, 2]);

    for(var row = 0; row < walls.length; row++) {
        walls[row][0] = -walls[row][0];
        mat4.translate(this.modelMatrix, this.modelMatrix, [ walls[row][1], yPos, walls[row][0] ]);

        //setup normal matrix
        var ivMat = mat3.create();
        mat3.fromMat4(ivMat, this.modelMatrix);
        mat3.invert(ivMat, ivMat);
        mat3.transpose(ivMat, ivMat);
        this.gl.uniformMatrix3fv(this.u_normMatrix, false, ivMat);
        //set up the Model-View-Projection matrix (mvp)
        mat4.mul(this.mvMatrix, this.viewMatrix, this.modelMatrix);
        mat4.mul(this.mvpMatrix, this.projMatrix, this.mvMatrix);
        //send the mvp
        this.gl.uniformMatrix4fv(this.u_mvpMatrix, false, this.mvpMatrix);
        this.checkError("Set mvp");
        this.gl.uniformMatrix4fv(this.u_mvMatrix, false, this.mvMatrix);
        this.checkError("Set mv");
        //draw it all
        this.gl.drawElements(this.gl.TRIANGLES, this.numIndices, this.gl.UNSIGNED_SHORT, 0);
        this.checkError("draw Arrays");

        mat4.translate(this.modelMatrix, this.modelMatrix, [ -walls[row][1], yPos, -walls[row][0] ]);
    }
    mat4.translate(this.modelMatrix, this.modelMatrix, [xPos, yPos, -2]);

    //floor
    //set up the texture
    this.gl.uniform1i(this.u_flag, 1);
    this.gl.uniform1i(this.u_texSampler1, 1);
    this.gl.activeTexture(this.gl.TEXTURE1);
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.floorTexture);

    var tempX = 0;
    //floor
    for(var j = 0; j < 19*19; j++){

        if(j == 0) {
            xPos = 2;
            yPos -= 2;
            zPos -= 2;
            tempX = xPos;
        }
        else if((j%19) == 0){
            xPos = 0;
            zPos -= 2;
        }
        else if(j != 1 && ((j-1)%19) == 0){
            xPos = -tempX;
            tempX = xPos;
            zPos = 0;
        }
        else{
             yPos = 0;
             zPos = 0;
        }

        mat4.translate(this.modelMatrix, this.modelMatrix, [xPos, yPos, zPos]);

        //setup normal matrix
        var ivMat = mat3.create();
        mat3.fromMat4(ivMat, this.modelMatrix);
        mat3.invert(ivMat, ivMat);
        mat3.transpose(ivMat, ivMat);
        this.gl.uniformMatrix3fv(this.u_normMatrix, false, ivMat);

        //set up the Model-View-Projection matrix (mvp)
        mat4.mul(this.mvMatrix, this.viewMatrix, this.modelMatrix);
        mat4.mul(this.mvpMatrix, this.projMatrix, this.mvMatrix);

        //send the mvp
        this.gl.uniformMatrix4fv(this.u_mvpMatrix, false, this.mvpMatrix);
        this.checkError("Set mvp");
        this.gl.uniformMatrix4fv(this.u_mvMatrix, false, this.mvMatrix);
        this.checkError("Set mv");

        //draw it all
        //this.gl.drawArrays(this.gl.POINTS, 0, this.numPoints);
        this.gl.drawElements(this.gl.TRIANGLES, this.numIndices, this.gl.UNSIGNED_SHORT, 0);
        this.checkError("draw Arrays");
    }

    this.modelMatrix = originalModelMatrix;

}

glApp.checkError = function(context) {
    var err = this.gl.getError();
    var msg = "";
    switch(err){
        case this.gl.OUT_OF_MEMORY:
            msg = "ERROR: Out of Memory";
            break;
        case this.gl.INVALID_ENUM:
            msg = "ERROR: Invalid value for enumerated argument";
            break;
        case this.gl.INVALID_OPERATION:
            msg = "ERROR: Invalid operation in current state.";
            break;
        case this.gl.INVALID_FRAMEBUFFER_OPERATION:
            msg = "ERROR: Framebuffer is not complete.";
            break;
        case this.gl.INVALID_VALUE:
            msg = "ERROR: Value out of range.";
            break;
        case this.gl.CONTEXT_LOST_WEBGL:
            msg = "ERROR: Context lost.";
            break;
        case this.gl.NO_ERROR:
            msg = "NO ERROR";
            return true;
            break;
    }
    console.log(context + " " + msg);
    return false;
}

glApp.onKeyDown = function(evt){
    //console.log(evt);
    switch(evt.code){
        case "KeyW":
            //mat4.translate(this.viewMatrix, this.viewMatrix, [0, 0, 1]);
            //translate it by the angle
            //this.z += Math.cos(this.angle) - Math.sin(this.angle);
            //this.x += Math.sin(this.angle) + Math.cos(this.angle);
            vec3.add(this.pos, this.pos, this.dir);
            this.isWin();
            if(!this.checkValidMove()){
                vec3.sub(this.pos, this.pos, this.dir);
                break;
            }
            vec3.add(this.lookAt, this.lookAt, this.dir);

            console.log(this.pos + " " + this.dir);
            mat4.lookAt(this.viewMatrix,
                this.pos,    //location
                this.lookAt,    //looking
                [0, 1, 0]);   //up
            break;
        case "KeyS":
            //mat4.translate(this.viewMatrix, this.viewMatrix, [0, 0, -1]);
            //this.z -= 1;
            vec3.sub(this.pos, this.pos, this.dir);
            this.isWin();
            if(!this.checkValidMove()){
                vec3.add(this.pos, this.pos, this.dir);
                break;
            }
            vec3.add(this.lookAt, this.lookAt, this.dir);


            console.log(this.pos + " " + this.dir);
            mat4.lookAt(this.viewMatrix,
                this.pos,    //location
                this.lookAt,    //looking
                [0, 1, 0]);   //up
            break;
        case "KeyA":
            //mat4.translate(this.viewMatrix, this.viewMatrix, [1, 0, 0]);
            //mat4.rotate(this.viewMatrix, this.viewMatrix, -Math.PI/32, [0, 1, 0]);
            //this.angle -= Math.PI/32;
            vec3.rotateY(this.dir, this.dir, [0,0,0], Math.PI/32);

            //rotate around the position
            vec3.rotateY(this.lookAt, this.lookAt, this.pos, Math.PI/32);
            //vec3.add(this.lookAt, this.pos, this.dir);

            console.log(this.pos + " " + this.dir);
            mat4.lookAt(this.viewMatrix,
                this.pos,    //location
                this.lookAt,    //looking
                [0, 1, 0]);   //up
            break;
        case "KeyD":
            //mat4.translate(this.viewMatrix, this.viewMatrix, [-1, 0, 0]);
            //mat4.rotate(this.viewMatrix, this.viewMatrix, Math.PI/32, [0, 1, 0]);
            //this.angle += Math.PI/32;
            vec3.rotateY(this.dir, this.dir, [0,0,0], -Math.PI/32);
            vec3.rotateY(this.lookAt, this.lookAt, this.pos, -Math.PI/32);
            //vec3.add(this.lookAt, this.pos, this.dir);

            console.log(this.pos + " " + this.dir);
            mat4.lookAt(this.viewMatrix,
                this.pos,    //location
                this.lookAt,    //looking
                [0, 1, 0]);   //up
            break;
        case "KeyQ":
            vec3.set(this.pos, 20, 55, 40);
            vec3.set(this.dir, 0, -1, -1);
            vec3.add(this.lookAt, this.pos, this.dir);

            mat4.lookAt(this.viewMatrix,
                this.pos,    //location
                this.lookAt,    //looking
                [0, 1, 0]);   //up
            break;
        case "KeyE":
            vec3.set(this.pos, 4, 0, -4);
            vec3.set(this.dir, 0, 0, -1);
            vec3.add(this.lookAt, this.pos, this.dir);

            mat4.lookAt(this.viewMatrix,
                this.pos,    //location
                this.lookAt,    //looking
                [0, 1, 0]);   //up
            break;
        /*
        case "ArrowUp":
            mat4.rotate(this.modelMatrix, this.modelMatrix, -Math.PI/32, [1, 0, 0]);
            break;
        case "ArrowDown":
            mat4.rotate(this.modelMatrix, this.modelMatrix, Math.PI/32, [1, 0, 0]);
            break;
        case "ArrowLeft":
            mat4.rotate(this.modelMatrix, this.modelMatrix, -Math.PI/32, [0, 1, 0]);
            break;
        case "ArrowRight":
            mat4.rotate(this.modelMatrix, this.modelMatrix, Math.PI/32, [0, 1, 0]);
            break;
        */
        default:
            return;
    }

    this.draw();

}

glApp.checkValidMove = function(){
    if(this.pos[0] < 4 || this.pos[0] > 36 || this.pos[2] > -4 || this.pos[2] < -35.5){
        return false;
    }
    return true;
}

glApp.isWin = function(){
    if(this.pos[0] > 32 && this.pos[2] < -32){
        window.alert("You Win!");
    }
}
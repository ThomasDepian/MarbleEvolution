<!-- cSpell:ignore startup webpage setup minified typedoc Bulma -->
# Marble Evolution
![GitHub](https://img.shields.io/github/license/ThomasDepian/MarbleEvolution)
![GitHub package.json version](https://img.shields.io/github/package-json/v/ThomasDepian/MarbleEvolution)

A small project showing how marbles find their way to a goal using a genetic algorithm.

## Demo
To checkout the demo version see [this link](https://thomasdepian.github.io/MarbleEvolution/).

## How to play
### Human mode
Once the game has launched left-click somewhere in the game-frame to adjust the direction and the power with which the marble should launch.  
The coloured line shows you the approximate direction and the text in the lower right corner tells you with which power the marble launches.
The higher the power, the faster the marble moves. By releasing the mouse, the marble launches.  
The text below or next to the game-frame shows you some basic information about the distance to the goal and the best distance reached so far.
### AI mode
Once the game has launched a left-click inside the game-frame starts the simulation.

## Configuration
Various settings can be configured without touching the code. There exists a folder `config` with two `.yaml` files: `config.yaml` and `default.yaml`, both containing some configuration values for the game. At startup, the `config.yaml` will be loaded and serves as the initial configuration, whereas `default.yaml` is just a backup copy in case you mess up the configuration.  
The game contains also several ways of changing some values (as for example the mutation rate) 'on the fly'. Just change the values on the webpage. The changes take affect once you press `Reload to apply configuration`. Please note that the configuration **will not be saved**, unless you manually copy the configuration values into the file `config.yaml`.

**The possibility to change other settings and save the current configuration will be added in future versions.**

## Project setup
### Prerequisites
If you want to run the code in your own environment you need a web server running on your machine.
If you already have one installed just set the root folder to this folder and you can enjoy the game. If you haven't any installed, I can recommend you [http-server](https://www.npmjs.com/package/http-server). Just follow the documentation on the provided link.   
Alternatively you can set up the developing environment which has a built in web server.
### Running the project
To start the game just launch the server, visit the url your webserver is telling you and have fun.
### Developing 
#### Prerequisites
If you want to develop you need Node.js installed in your developing environment.
#### Installing the dependencies
The project per se does not have any dependencies. Yet there are some development dependencies which needs to be installed. They can be installed with the command
```
npm i -D
```

#### Provided development commands
To speed things up there are several commands which can be launched:

**Rebuild on change and reloading**  
Run
```
npm run start
```
to start the live rebuild and live reloading. The game launches automatically in the browser.

**Generate the documentation**  
Run
```
npm run document
```
to generate the documentation. It will be generated in the folder _docs_.  
To view the documentation move to the _docs_ folder and open the `index.html` file.  

**Build the JavaScript**  
Run
```
npm run build
```
to build the project and generate the minified javascript file `app.js` in the _dist_ folder.

## Documentation
Don't want to dig through the lines of code to understand how everything is connected? I can feel you. The latest documentation can be found in the _docs_ folder. The documentation of the latest release can also be found [online](https://thomasdepian.github.io/MarbleEvolution/docs/).


## Contributing
### Want to add levels? Or have another idea?
First of all thanks for showing the interest to participate. Please feel free to fork the repository and change whatever you want. Once you are ready create a pull request and I will review your work as soon as possible.
### Found a bug?
Your eyes spotted something you think is wrong?   
Chances are high that I am aware of the bug, as the current versions are still under heavy development. But if the bug persists over several versions feel free to open an issue. 

## Other Resources
Build with [**Phaser3**](https://phaser.io/phaser3).  
Documentation generated with [**typedoc**](https://typedoc.org/).  
Styled using [**Bulma**](https://bulma.io/).  
**Assets used:**
- Marble and goal image: https://www.iconfinder.com/icons/2203520/circle_dot_record_round_icon  

**Development dependencies:**  
See `package.json`


## Licence
> For the detailed license see the Licence.

MIT &copy; Thomas Depian



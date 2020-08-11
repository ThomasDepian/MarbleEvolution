# MarbleEvolution
![GitHub](https://img.shields.io/github/license/ThomasDepian/MarbleEvolution)
![GitHub package.json version](https://img.shields.io/github/package-json/v/ThomasDepian/MarbleEvolution)

A small project showing how marbles find their way to a goal using a genetic algorithm.

## Demo
Coming soon.

## How to play
### Human mode
Once the game has launched left-click somewhere in the game-frame to adjust the direction and the power with which the marble should launch. The colored line shows you the approximate direction and the text in the lower left corner tells you with which power the marble launches. The higher the power, the faster the marble moves.
The text below the game-frame shows you some basic information about the current state of the marble. Once launched, the marble can be resetted at any time by left-clicking again inside the game-frame.
### AI mode
Coming soon.

## Configuration
Currently the only way to change the layout of the game, the behaviour of the marbles or anything else is by setting up the project locally and changing some hard coded values. A good starting point is the _Configuration.ts_ file or the _Main.ts_ as almost any values are set here.

**The possibility to change some basic settings on the fly will be added in future versions.**

## Project setup
### Prerequisites
If you want to run the code in your own environment you need a web server running on your machine.
If you already have one installed just set the root folder to this folder and you can enjoy the game. If you haven't any installed, I can recommend you [http-server](https://www.npmjs.com/package/http-server). Just follow the documentation on the provided link.   
Alternatively you can set up a developing environment which has a built in web server.
### Running the project
To start the game just launch the http server, open the webbrowser, visit the url your webserver is telling you and have fun.
### Developing 
#### Prerequisites
If you want to develop you need Node.js installed in your developing environment
#### Installing the dependencies
The project per se does not have any dependecies. Yet there are some development dependencies which needs to be installed. They can be installed with the command
```
npm i -D
```
#### Provided development commands
To speed up things there are several commands which can be launched:

**Rebuild on change and reloading**
Run
```
npm run start
```
to start the live rebuild and live reloading. The game launches automatically in the default browser.

**Generate the documentation**  
Run
```
npm run document
```
to generate the documentation. It will be generated in the folder _docs_.  
To view the documentation move to the _docs_ folder and launch the `index.html`.  

**Build the JavaScript**  
Run
```
npm run build
```
to build the project and generate the minified javascript file `app.js` in the _dist_ folder.

## Documentation
Don't want to dig through the lines of code to understand how everything is connected? I can feel you. The latest documentation can be found in the _docs_ folder.


## Contributing
### Want to add levels? Or have another idea?
First of all thanks for showing the interest to participate. Please feel free to fork the repository and change whatever you want. Once you are ready create a pull request and I will look to your work as soon as possible.
### Found a bug?
Your eyes spotted something you think is wrong?   
Chances are high that I am aware of the bug, ss the current versions are still under heavy development. But if the bug persists over several versions feel free to open an issue. 

## Frameworks & Assets used
Build with [**Phaser3**](https://phaser.io/phaser3).  
Documentation generated with [**typedoc**](https://typedoc.org/).  
**Assets used:**
- Marble and goal image: https://www.iconfinder.com/icons/2203520/circle_dot_record_round_icon


## Licence
> For the detailed license see the Licence.

MIT &copy; Thomas Depian



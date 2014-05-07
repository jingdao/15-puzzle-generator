15 Puzzle Generator
===================

Web interface for a 15 puzzle generator. Supports uploading an arbitrary image
and choosing a variable puzzle size (2-10).

Required packages
-----------------

- NodeJS
- npm
- ImageMagick

Usage
-----

Download the source code package and run the `setup.sh` script.
Run the following command to start the server:

	node main.js

Navigate to the webpage http://localhost:12345/ to try the puzzle.

Concept
-------

The project uses a NodeJS backend to host the puzzle generator. 
The user uploads a chosen image and selects a puzzle size. 
On the server end, the `convert -crop` command by ImageMagick 
is used to split the image into smaller square tiles. 
These tiles are sent back to the client and randomly shuffled 
using a Fisher-Yates shuffle. When the puzzle size is an odd number,
an extra swap is performed to ensure that the resulting puzzle
is solvable. (preserves parity)

Screenshot
----------

![Screenshot](screenshot.png?raw=true)

Acknowledgements
---------------- 

- http://www.subtlepatterns.com/ for the background used in the screenshot
- requestAnimationFrame polyfill by Erik Möller

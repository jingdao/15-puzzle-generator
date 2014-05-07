#!/bin/sh

echo "Setting up 15 puzzle server ..."
if [ -z "$(node --version)" ]
then
	echo "Error: required program 'node' not found."
	exit 1
fi
if [ -z "$(npm --version)" ]
then
        echo "Error: required program 'npm' not found."
	exit 1
fi
if [ -z "$(convert -version)" ]
then
        echo "Error: required program 'convert'(ImageMagick) not found."
	exit 1
fi
npm install mime
npm install formidable
mkdir tmp
mkdir static
cp index.html static/
cp *.png static/

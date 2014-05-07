var http = require('http');
var path = require('path');
var fs = require('fs');
var cp = require('child_process');
var mime = require('mime');
var url = require('url');
var formidable = require('formidable');
var portNumber = 12345;

function getRandom() {
	return Math.floor(Math.random()*100000000);
}

function splitImage(dir,file,size,callback) {
	identifyProcess = cp.spawn('identify',['-format','%w %h',dir+file])
	identifyProcess.stdout.on('data',function(data) {
		dimensions = data.toString().split(' ');
		imageWidth=parseInt(dimensions[0]);
		imageHeight=parseInt(dimensions[1]);
		cellWidth=imageWidth/size;
		cellHeight=imageHeight/size;
		countImages = 0;
		for (i=0;i<size;i++) {
			for (j=0;j<size;j++) {
				k=i*size+j+1;
				cropProcess = cp.spawn('convert',['-crop',
					cellWidth+'x'+cellHeight+'+'+(j*cellWidth)+'+'+(i*cellHeight),
					,dir+file,dir+k])
				cropProcess.on('close',function(code,signal){
					countImages++;
					if (countImages==size*size) callback();
				});
			}
		}
	});
	identifyProcess.stderr.on('data',function(data) {
		console.log(data.toString());
	});
}

server = http.createServer(function(req,res) {
	var p = url.parse(req.url).pathname;
	if (p.substring(p.length-11,p.length)=='uploadphoto'&&req.method.toLowerCase()=='post') {
		form = new formidable.IncomingForm();
		form.uploadDir = 'tmp';
		form.parse(req,function(err,fields,files) {
			if (!err&&files.file.size>0&&fields.size>=2&&fields.size<=10) {
				folderNumber = getRandom();
				fs.mkdir('static/'+folderNumber,function(err) {
					if (err) console.log(err);
					fs.rename(files.file.path,'static/'+folderNumber+'/template',function(err) {
						if (err) console.log(err);
						splitImage('static/'+folderNumber+'/','template',fields.size,function() {
							res.writeHead(302,{
							'Location': '/'+folderNumber+'/index.html?'+fields.size
							});
							res.end();
						});	
					});
				});
			} else {
				res.writeHead(404, {
					"Content-Type": "text/plain"
				});
				res.write("Invalid upload.");
				res.end();
			}
		});
	} else {
		if (p=='/'||p.substring(p.length-10,p.length)=='index.html') p='/index.html';
		else if (p.substring(p.length-14,p.length)=='background.png') p='/background.png';
		var filename = path.join(__dirname, "static",p);
		(fs.exists || path.exists)(filename, function(exists){
			if (exists) {
				fs.readFile(filename, function(err, data){
					if (err) {
						// File exists but is not readable (permissions issue?)
						res.writeHead(500, {
							"Content-Type": "text/plain"
						});
						res.write("Internal server error: could not read file");
						res.end();
						return;
					}
	 
					// File exists and is readable
					var mimetype = mime.lookup(filename);
					res.writeHead(200, {
						"Content-Type": mimetype
					});
					res.write(data);
					res.end();
					return;
				});
			} else {
					// File does not exist
					res.writeHead(404, {
						"Content-Type": "text/plain"
					});
					res.write("Requested file not found.");
					res.end();
					return;
			}
		});
	}
}).listen(portNumber);

process.on('SIGINT',function() {
	console.log('\nServer interrupted');	
	process.exit();
});

console.log('Listening on port '+portNumber+': ......');

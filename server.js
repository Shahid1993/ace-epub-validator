express = require('express');
bodyParser = require('body-parser');
session = require('express-session');
urlencode = require('urlencode');
http = require('http');
https = require('https');
winston = require('winston');
path = require('path');
methodOverride = require('method-override');
PassThrough = require('stream').PassThrough;
Stream = require('stream');

cookieParser = require('cookie-parser');

cmd=require('node-cmd');
const fs = require('fs');

ace_checker_path="/ace/";

node_server_port = '9092';
app = express();

app.use(express.static(__dirname));
app.use(express.static(__dirname + '/ace'));
app.engine('html', require('ejs').renderFile);
app.use(express.static('/'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

node_server = http.createServer(app).listen(node_server_port);


app.get('/',function (httpReq, httpRes) {
    httpRes.status(200);
    httpRes.json({ 'status': 200, error_description: 'Testing' });
});


/* Added by Shahid for Daisy/Ace Epub Checker */
app.get('/ace/:taskId/:file', function(httpReq, httpRes) {

    try {
        //var outDir = __dirname+ace_checker_path + httpReq.param("taskId") + "/" + httpReq.param("file");
        var outDir = ace_checker_path + httpReq.param("taskId") + "/" + httpReq.param("file");
        var filePath = outDir + "/" + httpReq.param("file")+".epub";
        /*cmd.get(
              'pwd',
              function(err, data, stderr){
                  console.log('the current working dir is : ',data)
              }
          ); */

        cmd.get(
            'ace -v',
            function(err, data, stderr) {
                console.log('Ace Version is : ', data)
            }
        );

        //var ace_cmd = 'ace --outdir ' + outDir + ' ' + filePath + '';
        var ace_cmd = 'ace -f -o ' + outDir + ' ' + filePath + '';
        console.log(ace_cmd);
        cmd.get(
            ace_cmd,
            function(err, data, stderr) {
                //console.log('Ace : ', data);
                console.log('Error : ', err);
                console.log('Stderr : ', stderr);
                if (err) {
                    httpRes.status(422);
                    httpRes.json({ 'status': 422, error_description: stderr });
                    return;
                } else {
                    httpRes.status(200);
                    httpRes.json({ 'status': 200, error_description: data });
                    return;
                }
            }
        );
    } catch (e) {
        httpRes.status(500);
        httpRes.json({ 'status': 500, error_description: 'Internal Server Error' });
        return;
    }
});
app.use(function (req, res, next) {
    res.redirect('/#/error')
});
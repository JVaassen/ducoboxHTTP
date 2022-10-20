module.exports = function(RED) {
    'use strict';
    const request = require('request');
    const fs = require('fs');
	
    function DucoboxSettings(n) {
        RED.nodes.createNode(this,n);
        this.ip_adrs = n.ip_adrs;
    }

    RED.nodes.registerType('ducoboxSettings',DucoboxSettings,{
        credentials: {
            ip_adrs: {type:'text'},
        }
    });	
	
	function getValues(node, URL, callback){
		
	console.log(URL);
	console.log(node);
	
	request(URL, function (error, response, body) {
				
			if (error) {
                console.error(error);
		    }
			else if (body)
			{ 
			console.log('body:', body); // Print in console de body
            var result = JSON.parse(body);
			callback(result);
	}});
	

	}
	
    function DucoBoxHTTPNode(n) {
        RED.nodes.createNode(this,n);
		this.IP = RED.nodes.getCredentials(n.server);
		this.deviceID = n.deviceID;
		var node = this;
		var URL = node.IP.ip_adrs + 'nodeinfoget?node=' + node.deviceID;
        node.on('input', function(msg, send, done) {
            
			
			getValues(node, URL, (result) => {
				msg.payload = result;
				node.send(msg);
				node.status({fill:"green",shape:"ring",text:"Fetched"});
			});
			
			done();
        });
    }
    RED.nodes.registerType("ducoboxHTTP",DucoBoxHTTPNode);
};


// http://192.168.1.13/nodeinfoget?node=2&t=1666290873828
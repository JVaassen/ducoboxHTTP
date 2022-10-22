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
				node.status({fill:"red",shape:"ring",text:"Error"});
				node.error('Error fetching.');
				
		    }
			else if (body)
			{ 
			console.log('body:', body); // Print in console de body
            var result = JSON.parse(body);
			callback(result);
	}});
	

	}
	
	function setState(node, command, value, callback){
		if (command === 'Operation_State'){
			var URL = 'http://'+ node.IP.ip_adrs + '/nodesetoperstate?node='+ node.deviceID + '&value=' + value;
			console.log(URL);
		} 
		if (command === 'CO2Setpoint'){
			
			var URL = 'http://'+ node.IP.ip_adrs + '/nodeconfigset?node='+ node.deviceID + '&para=' + command +'&value=' + value;
			console.log(URL);	
		}
		
		request(URL, function (error, response, body) {
				
			if (error) {
				node.status({fill:"red",shape:"ring",text:"Error"});
				node.error('Error fetching.');
				
		    }
			else if (body)
			{ 
				node.status({fill:"green",shape:"ring",text:"Send"});	
				console.log('body:', body); // Print in console de body
		}});

	}
	
    function DucoBoxHTTPNodeSend(n) {
        RED.nodes.createNode(this,n);
		this.IP = RED.nodes.getCredentials(n.server);
		this.deviceID = n.deviceID;
		var node = this;
		

        node.on('input', function(msg, send, done) {
            
			let configvalue = {
				'Operation_State'   : msg.Operation_State,
				'CO2Setpoint'   	: msg.CO2Setpoint
            };
			
			for (let r of ['Operation_State']) {
                if (configvalue[r]) {
                        console.log(`Send operation state: `+ configvalue[r]);
						setState(node, "Operation_State", configvalue[r], (result) => {
							console.log(`Send!`);	
							
                    	});
                }
            }
			
			for (let d of ['CO2Setpoint']) {
                if (configvalue[d]) {
                        console.log(`Send CO2 setpoint: `+ configvalue[d]);
							setState(node, "CO2Setpoint", configvalue[d], (result) => {
							console.log(`Send!`);	

							node.status({fill:"green",shape:"ring",text:"Send"});	
                    	});
                    
                }
            }
			
			console.log('SEND');
			done();
        });
    }
    RED.nodes.registerType("ducoboxSend",DucoBoxHTTPNodeSend);
	
    function DucoBoxHTTPNode(n) {
        RED.nodes.createNode(this,n);
		this.IP = RED.nodes.getCredentials(n.server);
		this.deviceID = n.deviceID;
		var node = this;
		var URL = 'http://'+ node.IP.ip_adrs + '/nodeinfoget?node=' + node.deviceID;
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






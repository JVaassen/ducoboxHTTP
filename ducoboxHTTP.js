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
	
	function getDevicetype(node, callback) {
		
		var URL = 'http://'+ node.IP.ip_adrs + '/nodeinfoget?node=' + node.deviceID;	
		request(URL, function (error, response, body) {
			if (error) {
				node.status({fill:"red",shape:"ring",text:"Error"});
				node.error('Error fetching.');
				
		    }
			else if (body)
			{ 
//			console.log('body:', body); // Print body in console
			
            var result = JSON.parse(body);
			for (const key in result) {  
			  if (key === "devtype"){
					var devID = result[key];
					node.status({fill:"green",shape:"ring",text:"Node type resolved"});


			  }
				
			}
			callback(devID);
	}});
	}
		
	
	function setState(node, command, value, callback){
		if (command === 'Operation_State'){
			var URL = 'http://'+ node.IP.ip_adrs + '/nodesetoperstate?node='+ node.deviceID + '&value=' + value;
			console.log(URL);
		} 
		if (command === 'CO2Setpoint' || command === 'RHSetpoint'){
			
			var URL = 'http://'+ node.IP.ip_adrs + '/nodeconfigset?node='+ node.deviceID + '&para=' + command +'&value=' + value;
			console.log(URL);	
		}
		
		request(URL, function (error, response, body) {
//			console.log("Writing value:" + command);	
			if (error) {
				node.status({fill:"red",shape:"ring",text:"Error"});
				node.error('Error fetching.');
				
		    }
			else if (body)
			{ 
				node.status({fill:"green",shape:"ring",text:"Send"});	
				// console.log('body:', body); 
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
				'CO2Setpoint'   	: msg.CO2Setpoint,
				'RHSetpoint'		: msg.RHSetpoint
            };
			
			getDevicetype(node, (devID) => {
			console.log("Nodetype fetched: " +devID); 
			
			for (let r of ['Operation_State']) {
                if (configvalue[r]) {
                        console.log(`Operation state found in msg. Trying to send `+ r + `: `+ configvalue[r]);
 						setState(node, r, configvalue[r], (result) => {
 							console.log("Send: "+ r);	
                    	});

                }
            }
			
			for (let d of ['CO2Setpoint', 'RHSetpoint']) {
				
				switch (d) {
                case 'CO2Setpoint': 
					var devicetype = "VLVCO2";
					break;
                case 'RHSetpoint': 
					var devicetype = "VLVRH";
					break;
				default:
					var devicetype = "ERROR";
				}

				
                if (configvalue[d]) {
                        console.log(d + ` found in msg. Trying to send `+ d + `: `+ configvalue[d]);

				if (devicetype === devID){
					setState(node, d, configvalue[d], (result) => {
						console.log(`Send: `+ d);	
						node.status({fill:"green",shape:"ring",text:"Send"});	
                   });
					console.log("Value send: " + d);
				}
				else{
							node.warn("Node doesn't have support for "+ d +". Value will be skipped for device ID: "+ node.deviceID);
				}
                    
               }
            }
			
			});  
			
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






module.exports = function(RED) {
    function DucoBoxHTTPNode(config) {
        RED.nodes.createNode(this,config);
	this.ip_address = config.ip_address;
        var node = this;
        node.on('input', function(msg) {
            msg.payload = node.ip_adrs;
            node.send(msg);
        });
    }
    RED.nodes.registerType("ducoboxHTTP",DucoBoxHTTPNode);
}

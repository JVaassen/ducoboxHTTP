# DucoboxHTTP

[![platform](https://img.shields.io/badge/platform-Node--RED-red)](https://nodered.org)
[![Downloads](https://img.shields.io/npm/dt/ducoboxhttp.svg)](https://www.npmjs.com/package/ducoboxhttp)
[![NPM](https://img.shields.io/npm/v/ducoboxhttp?logo=npm)](https://www.npmjs.com/package/ducoboxhttp)

## Description

This package contains the Node-Red flow to grab information of your DucoBox. It will only work if you have the communication print installed. 

## Install

To install the stable version use the `Menu - Manage palette` option and search for `ducoboxhttp`, or run the following command in your Node-RED user directory - typically `~/.node-red`:

    npm install ducoboxhttp

Add your IP-adres in de node and the node-ID you want to read. You can look up the node-ID by accessing your ducobox on http://IPADRESDUCOBOX

Pre-requisite is the nodejs module "request". That can be installed by

    npm install request
    
## Roadmap

What is still on the roadmap?
- Writing values to ducobox, including setting speed manual. (Top priority and part of this is in the current release)
- A timer so values are automaticly get fetched. Instead of using a injection. 
- Other way of exporting data, instead of JSON output. 
- Bugfixes

On the long term:
- More flexibility in node, like auto fetching all nodeID's.  

## Changelog

Full changelog can be found [here](/CHANGELOG.md) 

## Sidenode

This is my first Node-red contribution. Please let me know in the discussion if you having troubles, missing features or beeing happy with the node. 


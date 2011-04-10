P.config = {};


// production environment
//P.config.hostname = "http://popravi.mk";
//P.config.virtualDevice = false


// development environment
P.config.hostname = "http://192.168.1.100:3000";
//P.config.virtualDevice = false
P.config.virtualDevice = true


// set appropriate api endpoint here
P.config.apiEndpoint = P.config.hostname + "/api/v1";

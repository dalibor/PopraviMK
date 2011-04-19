P.config = {};


// production environment
//P.config.hostname = "http://popravi.mk";
//P.config.virtualDevice = false


// development environment
P.config.hostname = "http://192.168.1.101:3000";
//P.config.virtualDevice = false
P.config.virtualDevice = true


// set appropriate api endpoint here
P.config.apiEndpoint = P.config.hostname + "/api/v2";

// API::V2 key for PopraviMK
P.config.api_key = '7a52ae6e21f8fda72e466dbf4e10';

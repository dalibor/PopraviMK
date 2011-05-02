P.config = {};

// production environment
//P.config.hostname = 'http://popravi.mk';
//P.config.virtualDevice = false
//P.config.api_key = ''; // API::V2 key for PopraviMK

// staging environment
P.config.hostname = 'http://staging.popravi.mk';
P.config.virtualDevice = false
P.config.api_key = 'staging'; // API::V2 key for PopraviMK

// development environment
//P.config.hostname = 'http://192.168.1.101:3000';
//P.config.virtualDevice = true
//P.config.api_key = 'development'; // API::V2 key for PopraviMK


// set appropriate api endpoint here
P.config.apiEndpoint = P.config.hostname + '/api/v2';

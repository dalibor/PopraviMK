// For production use: environment = production, device = physical;

//environment = "production";
environment = "development";
//device = "physical"
device = "virtual"

var production_url = "http://popravi.mk";
var development_url = "http://192.168.1.100:3000";

var hostname = (environment === "production") ? production_url : development_url;
var virtualDevice = (device === "virtual") ? true : false;
var apiEndpoint = hostname + "/api/v1"

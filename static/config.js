System.config({
  baseURL: "/static/",
  defaultJSExtensions: true,
  transpiler: false,
  paths: {
    "github:*": "src/libs/github/*",
    "npm:*": "src/libs/npm/*"
  },

  map: {
    "angular": "github:angular/bower-angular@1.6.4",
    "angular-moment": "npm:angular-moment@1.0.1",
    "angular-sanitize": "github:angular/bower-angular-sanitize@1.6.4",
    "components": "src/components",
    "lodash": "npm:lodash@4.17.4",
    "moment": "npm:moment@2.18.1",
    "siddii/angular-timer": "github:siddii/angular-timer@1.3.5",
    "videogular/bower-videogular": "github:videogular/bower-videogular@1.4.4",
    "github:angular/bower-angular-sanitize@1.6.4": {
      "angular": "github:angular/bower-angular@1.6.4"
    },
    "github:siddii/angular-timer@1.3.5": {
      "angular": "github:angular/bower-angular@1.6.4",
      "humanize-duration": "github:EvanHahn/HumanizeDuration.js@3.10.0",
      "moment": "npm:moment@2.18.1"
    },
    "npm:angular-moment@1.0.1": {
      "moment": "npm:moment@2.18.1"
    }
  }
});

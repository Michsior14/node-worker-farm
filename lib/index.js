"use strict";

const Farm = require("./farm");

let farms = []; // keep record of farms so we can end() them if required

function farm(options, path, methods) {
  if (typeof options == "string") {
    methods = path;
    path = options;
    options = {};
  }

  let f = new Farm(options, path),
    api = f.setup(methods);

  farms.push({ farm: f, api: api });

  // return the public API
  return api;
}

function end(api, force, callback) {
  for (let i = 0; i < farms.length; i++)
    if (farms[i] && farms[i].api === api) {
      const { farm } = farms[i];
      farms.splice(i, 1);
      return farm.end(force, callback);
    }
  if (callback) {
    process.nextTick(callback.bind(null, new Error("Worker farm not found!")));
  }
}

module.exports = farm;
module.exports.end = end;

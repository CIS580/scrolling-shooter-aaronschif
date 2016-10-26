"use strict";

module.exports = exports = {
  add: add,
  subtract: subtract,
  scale: scale,
  rotate: rotate,
  dotProduct: dotProduct,
  magnitude: magnitude,
  normalize: normalize
}


function scale(a, scale) {
 return {x: a.x * scale, y: a.y * scale};
}

function add(a, b) {
 return {x: a.x + b.x, y: a.y + b.y};
}

function subtract(a, b) {
  return {x: a.x - b.x, y: a.y - b.y};
}

function rotate(a, angle) {
  return {
    x: a.x * Math.cos(angle) - a.y * Math.sin(angle),
    y: a.x * Math.sin(angle) + a.y * Math.cos(angle)
  }
}

function dotProduct(a, b) {
  return a.x * b.x + a.y * b.y
}

function magnitude(a) {
  return Math.sqrt(a.x * a.x + a.y * a.y);
}

function normalize(a) {
  var mag = magnitude(a);
  return {x: a.x / mag, y: a.y / mag};
}

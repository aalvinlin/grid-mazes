const puzzleData = {
    "rows": null,
    "cols": null,

    "start": null,
    "finish": null,

    "graph": null,
    "cells": null,
}

const createFullGraph = (rows, cols) => {

    // 2D array to hold cell contents
    let cells = Array(rows).fill(null);
    cells = cells.map(row => Array(cols).fill(null)); // make sure each row has a unique array

    // 2D array to hold vertex and edge data
    // the vertex at each coordinate contains info about itself and the four possible surrounding edges
    let graph = Array(rows).fill(null);
    graph = graph.map(row => Array(cols).fill(null)); // make sure each row has a unique array

    // 2D array to hold visited vertex and edge data
    // the vertex at each coordinate contains info about itself and the four possible surrounding edges
    let visited = Array(rows).fill(null);
    visited = visited.map(row => Array(cols).fill(null)); // make sure each row has a unique array
}

createFullGraph(3, 5);

console.log(puzzleData);
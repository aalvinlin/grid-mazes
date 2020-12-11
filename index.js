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
    puzzleData["cells"] = Array(rows).fill(Array(cols).fill(null));

    // 2D array to hold vertex and edge data
    // the vertex at each coordinate contains info about itself and the four possible surrounding edges
    puzzleData["graph"] = Array(rows).fill(Array(cols).fill({
        "self": null,
        "n": null,
        "s": null,
        "e": null,
        "w": null,
    }));

}

createFullGraph(3, 5);

console.log(puzzleData);
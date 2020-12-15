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

    for (let row = 0; row < rows; row += 1)
        {
            for (let col = 0; col < cols; col += 1)
                {
                    let currentLocationData = {};

                    // add link to vertex below
                    if (row > 0)
                        { currentLocationData["s"] = 1; }

                    // add link to vertex above
                    if (row < rows - 1)
                        { currentLocationData["n"] = 1; }

                    // add link to vertex to the left
                    if (col > 0)
                        { currentLocationData["w"] = 1; }

                    // add link to vertex to the right
                    if (col < cols - 1)
                        { currentLocationData["e"] = 1; }

                   graph[row][col] = currentLocationData;
                }
        }

    puzzleData["cells"] = cells;
    puzzleData["graph"] = graph;
    puzzleData["visited"] = visited;
}

const setStartAndEnd = (startX, startY, endX, endY) => {

    puzzleData["start"] = [startX, startY];
    puzzleData["end"] = [endX, endY];
}


createFullGraph(3, 5);

console.log(puzzleData);
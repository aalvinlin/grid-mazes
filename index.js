const puzzleData = {
    "rows": null,
    "cols": null,

    "start": null,
    "end": null,

    "graph": null,
    "cells": null,
}

const createFullGraph = (rows, cols) => {

    // 2D array to hold cell contents
    let cells = Array(rows).fill(null);
    cells = cells.map(row => Array(cols).fill(null)); // make sure each row has a unique array

    // 2D array to hold vertex and edge data
    // the vertex at each coordinate contains info about itself and the four possible surrounding edges
    // there are (rows + 1) * (cols + 1) vertices
    let graph = Array(rows + 1).fill(null);
    graph = graph.map(row => Array(cols + 1).fill(null)); // make sure each row has a unique array

    // 2D array to hold visited vertex and edge data
    // the vertex at each coordinate contains info about itself and the four possible surrounding edges
    let visited = Array(rows).fill(null);
    visited = visited.map(row => Array(cols).fill(null)); // make sure each row has a unique array

    for (let row = 0; row <= rows; row += 1)
        {
            for (let col = 0; col <= cols; col += 1)
                {
                    let currentLocationData = {};

                    // add link to vertex below
                    if (row > 0)
                        { currentLocationData["s"] = 1; }

                    // add link to vertex above
                    if (row < rows)
                        { currentLocationData["n"] = 1; }

                    // add link to vertex to the left
                    if (col > 0)
                        { currentLocationData["w"] = 1; }

                    // add link to vertex to the right
                    if (col < cols)
                        { currentLocationData["e"] = 1; }

                   graph[row][col] = currentLocationData;
                }
        }

    puzzleData["rows"] = rows;
    puzzleData["cols"] = cols;
    
    puzzleData["cells"] = cells;
    puzzleData["graph"] = graph;
    puzzleData["visited"] = visited;
}

const setStartAndEnd = (startX, startY, endX, endY) => {

    puzzleData["start"] = [startX, startY];
    puzzleData["end"] = [endX, endY];
}

const findAllSolutions = () => {

    let [startX, startY] = puzzleData["start"];
    let [endX, endY] = puzzleData["end"];

    let verticesPerRow = puzzleData["rows"] + 1;
    let verticesPerCol = puzzleData["cols"] + 1;

    // use a 1D array of length (verticesPerRow * verticesPerCol) to keep track of whether vertices are available to use
    let availableVertices = Array((verticesPerRow * verticesPerCol)).fill(true);

    // mark the starting point, as unavailable
    availableVertices[startY * verticesPerRow + startX] = false;

    // store solutions in a set
    allSolutions = new Set();

    const findAllSolutionsHelper = (currentX, currentY, pathSoFar, remainingVertices) => {
        
        // make a copy of remaining vertices to update for the next round
        remainingVertices = [...remainingVertices];

        // mark the current vertex as visited
        remainingVertices[currentY * verticesPerRow + currentX] = false;

        for (let direction in puzzleData["graph"][currentY][currentX]) // row first, then column
            {
                // if the vertex to the north is available...
                if (direction === "n" && remainingVertices[(currentY + 1) * verticesPerRow + currentX])
                    {
                        // if target reached, add solution to set of known solutions
                        if (currentX === endX && currentY + 1 === endY)
                            { allSolutions.add(pathSoFar + "n"); }

                        // continue finding any (longer) solutions from this coordinate
                        findAllSolutionsHelper(currentX, currentY + 1, pathSoFar + "n", remainingVertices);
                    }

                // if the vertex to the south is available...
                else if (direction === "s" && remainingVertices[(currentY - 1) * verticesPerRow + currentX])
                    {
                        // if target reached, add solution to set of known solutions
                        if (currentX === endX && currentY - 1 === endY)
                            { allSolutions.add(pathSoFar + "s"); }

                        // continue finding any (longer) solutions from this coordinate
                        findAllSolutionsHelper(currentX, currentY - 1, pathSoFar + "s", remainingVertices);
                    }

                // if the vertex to the east is available...
                else if (direction === "e" && remainingVertices[currentY * verticesPerRow + (currentX + 1)])
                    {
                        // if target reached, add solution to set of known solutions
                        if (currentX + 1 === endX && currentY === endY)
                            { allSolutions.add(pathSoFar + "e"); }

                        // continue finding any (longer) solutions from this coordinate
                        findAllSolutionsHelper(currentX + 1, currentY, pathSoFar + "e", remainingVertices);
                    }

                // if the vertex to the west is available...
                else if (direction === "w" && remainingVertices[currentY * verticesPerRow + (currentX - 1)])
                    {
                        // if target reached, add solution to set of known solutions
                        if (currentX - 1 === endX && currentY === endY)
                            { allSolutions.add(pathSoFar + "w"); }

                        // continue finding any (longer) solutions from this coordinate
                        findAllSolutionsHelper(currentX - 1, currentY, pathSoFar + "w", remainingVertices);
                    }

            }

    }

    findAllSolutionsHelper(0, 0, "", [...availableVertices]);

    return allSolutions;

}

createFullGraph(4, 4);
setStartAndEnd(0, 0, 4, 4);

// console.log(puzzleData["graph"])

let allPaths = findAllSolutions();

console.log(allPaths);
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

let graphSize = 4;

createFullGraph(graphSize, graphSize);
setStartAndEnd(0, 0, graphSize, graphSize);

// console.log(puzzleData["graph"])

let allPaths = findAllSolutions();

// console.log(allPaths);

const countPathLengths = () => {

    let pathLengthCounts = {};

    for (let path of Array.from(allPaths))
        {
            if (pathLengthCounts[path.length])
                { pathLengthCounts[path.length] += 1; }
            else
                { pathLengthCounts[path.length] = 1; }
        }
    
    return pathLengthCounts;
}

const createDecisionTree = () => {

    let decisionTree = {}

    for (let path of Array.from(allPaths))
        {
            let currentNode = decisionTree;

            for (let direction of path.split(""))
                {
                    // create a new node for the specified direction
                    if (!currentNode[direction])
                        { currentNode[direction] = {}; }

                    // move to new node
                    currentNode = currentNode[direction];
                }
        }
    
    return decisionTree;
}

const createHTMLGrid = () => {

    let grid = document.createElement("div");
    grid.id = "maze-grid";

    let verticesPerRow = puzzleData["rows"] + 1;
    let verticesPerCol = puzzleData["cols"] + 1;

    let intersection = document.createElement("div");
    intersection.classList.add("intersection");

    let segmentHorizontal = document.createElement("div");
    segmentHorizontal.classList.add("segment");
    segmentHorizontal.classList.add("segmentHorizontal");

    let segmentVertical = document.createElement("div");
    segmentVertical.classList.add("segmentVertical");

    let cell = document.createElement("div");
    cell.classList.add("cell");

    let intersectionRow = document.createElement("div");
    intersectionRow.classList.add("intersectionRow");
    intersectionRow.appendChild(intersection.cloneNode(true));

    // make a row of divs with just horizontal segments and intersections
    for (let i = 0; i < verticesPerRow; i += 1)
        {
            intersectionRow.appendChild(segmentHorizontal.cloneNode(true));
            intersectionRow.appendChild(intersection.cloneNode(true));
        }
    
    grid.appendChild(intersectionRow.cloneNode(true));

    // make a row of cells and vertical segments
    let cellRow = document.createElement("div");
    cellRow.classList.add("cellRow");
    cellRow.appendChild(segmentVertical.cloneNode(true));

    for (let i = 0; i < verticesPerRow; i += 1)
        {
            cellRow.appendChild(cell.cloneNode(true));
            cellRow.appendChild(segmentVertical.cloneNode(true));
        }

    // add pairs of intersectionRow and cellRow to grid 
    for (let i = 0; i < verticesPerCol; i += 1)
        {
            grid.appendChild(cellRow.cloneNode(true));
            grid.appendChild(intersectionRow.cloneNode(true));
        }
    
    return grid;
}

document.getElementById("content").appendChild(createHTMLGrid());

let test = document.createElement("p");
test.textContent = "this is a test";

document.getElementById("content").appendChild(test);
document.getElementById("content").appendChild(test);

// console.log(JSON.stringify(decisionTree));

// let paragraph = document.createElement("p");
// document.getElementById("content").appendChild(paragraph);

// paragraph.textContent = JSON.stringify(decisionTree);

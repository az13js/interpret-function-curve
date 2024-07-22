/**
 * Use L-U solve.
 * see https://mathjs.org/docs/reference/functions/lusolve.html
 */
function cubicSplineInterpolation(x0, points) {
    if (4 != points.length) {
        return NaN;
    }
    for (let p of points) {
        if (x0 == p.x) {
            return p.y;
        }
    }
    let A = [];
    let b = [];
    for (let i = 0; i < 4; i++) {
        A.push([points[i].x * points[i].x * points[i].x, points[i].x * points[i].x, points[i].x, 1.0]);
        b.push(points[i].y);
    }
    // solve A*x=b
    const x = math.lusolve(A, b);
    return x[0] * x0 * x0 * x0 + x[1] * x0 * x0 + x[2] * x0 + parseFloat(x[3]);
}

function createTable(points) {
    let table = `<table border="1">
                    <thead>
                        <tr>
                        <th>X coordinate</th>
                        <th>Y coordinate</th>
                        </tr>
                    </thead>
                    <tbody>`;

    for (let i = 0; i < points.length; i++) {
        let row = `<tr><td>${points[i].x}</td><td>${points[i].y}</td></tr>`;
        table += row;
    }

    table += `</tbody></table>`;

    return table;
}

var imageInput = document.getElementById('imageInput');
var imageContainer = document.getElementById('imageContainer');
var points = [];

imageInput.addEventListener('change', function(e) {
    var file = e.target.files[0];
    if (file) {
        let reader = new FileReader();

        reader.onload = function(e) {
            let img = document.createElement('img');
            img.setAttribute('id', 'functionCurveImage');
            img.src = e.target.result;
            img.onload = function() {
                console.log(`#1 Image size: ${img.width}px x ${img.height}px`);
                imageContainer.innerHTML = '';
                imageContainer.appendChild(img);
            };
        };
        reader.readAsDataURL(file);
    }
});

/**
 * Using it to apply Canny edge detection to an image on the first canvas.
 * The processed edges are then drawn on the second canvas.
 *
 * @param {HTMLCanvasElement} canvas1 The first canvas
 * @param {HTMLCanvasElement} canvas2 The second canvas
 * @param {number} ht Threshold high (default: 100).
 * @param {number} lt Threshold low (default: 50).
 * @param {number} sigmma Sigma value for edge detection (default: 1.4).
 * @param {number} kernelSize Kernel size for edge detection (default: 3).
 */
function cannyEdgeDetection(canvas1, canvas2, ht = 100, lt = 50, sigmma = 1.4, kernelSize = 3) {
    // Create a new instance of CannyEdgeDetection
    let CannyJS = new CannyEdgeDetection();

    // Apply Canny edge detection on the first canvas
    let image = CannyJS.canny(canvas1, ht, lt, sigmma, kernelSize);

    // Draw the detected edges on the second canvas
    canvas2.width = canvas1.width;
    canvas2.height = canvas1.height;
    image.drawOn(canvas2);
}

function extractWhitePixelLocations(canvasElement) {
    const canvas = canvasElement.getContext('2d');
    const imageData = canvas.getImageData(0, 0, canvasElement.width, canvasElement.height);
    const pixels = imageData.data;

    const whitePixels = [];

    for (let i = 0; i < pixels.length; i += 4) {
        // Access the pixel's RGBA values
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];

        // Check if the pixel is white (R, G, B: 255)
        if (r === 255 && g === 255 && b === 255) {
            let p = {
                x: (i / 4) % canvasElement.width,
                y: Math.floor(canvasElement.height - i / (4 * canvasElement.width))
            };
            if (p.x * p.y == 0 || p.x == canvasElement.width - 1 || p.y == canvasElement.height - 1) {
                continue;
            }
            // Store the location of the white pixel
            whitePixels.push(p);
        }
    }

    return whitePixels;
}

function deWeightAndAveragePoints(points) {
    // Create an object to store the grouped points
    var groupedPoints = {};

    points.forEach(point => {
      if (groupedPoints[point.x]) {
        // Update the group if the point already exists
        groupedPoints[point.x].y += point.y;
        groupedPoints[point.x].count++;
      } else {
        // Create a new group
        groupedPoints[point.x] = {
          x: point.x,
          y: point.y,
          count: 1
        };
      }
    });

    // Averaging the Y coordinates
    Object.keys(groupedPoints).forEach(key => {
      if (groupedPoints[key].count > 1) {
        groupedPoints[key].y /= groupedPoints[key].count;
      }
    });

    // Create a new array with the averaged points
    var result = Object.values(groupedPoints).map(point => ({
      x: point.x,
      y: point.y
    }));

    return result;
}

function extractedCoordinates(canvas) {
    // Get references to input elements
    const htInput = document.getElementById('htInput');
    const ltInput = document.getElementById('ltInput');
    const sigmmaInput = document.getElementById('sigmmaInput');
    const kernelSizeInput = document.getElementById('kernelSizeInput');

    // Retrieve the values from the input fields
    const heightThreshold = parseInt(htInput.value, 10);
    const lowThreshold = parseInt(ltInput.value, 10);
    const sigma = parseFloat(sigmmaInput.value);
    const kernelSize = parseInt(kernelSizeInput.value, 10);

    // Console log the retrieved values
    console.log(`Height Threshold: ${heightThreshold}`);
    console.log(`Low Threshold: ${lowThreshold}`);
    console.log(`Sigma: ${sigma}`);
    console.log(`Kernel Size: ${kernelSize}`);

    // Pass the retrieved values to the cannyEdgeDetection function
    let canvasCannyEdgeDetection = document.getElementById("cannyEdgeDetection");
    cannyEdgeDetection(canvas, canvasCannyEdgeDetection, heightThreshold, lowThreshold, sigma, kernelSize);

    // Now you can use the extracted white pixel locations as needed
    return extractWhitePixelLocations(canvasCannyEdgeDetection);
}

document.getElementById('submitButton').addEventListener('click', function() {
    let img = document.getElementById('functionCurveImage');
    if (!img) {
        return;
    }
    console.log(`#2 Image size: ${img.width}px x ${img.height}px`);

    let canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    let ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, img.width, img.height);
    points = extractedCoordinates(canvas);
    points = deWeightAndAveragePoints(points);
    // Sort the points based on their x-coordinates in ascending order
    points.sort((a, b) => a.x - b.x);

    let resultDiv = document.getElementById('result');
    resultDiv.innerHTML = createTable(points);

    drawPointsOnCanvas(points, img.width, img.height, document.getElementById('drawCanvas'));
});

document.getElementById('downloadUniformData').addEventListener('click', () => {
    // Using Spline Interpolation to Obtain Uniform Data Points

    const numPoints = parseInt(prompt('Number of points', 10), 10);
    if (numPoints < 2) {
        return;
    }

    // Generate uniform data points using cubic spline interpolation
    const uniformPoints = generateUniformPoints(points, numPoints);

    // Download the CSV file
    downloadCSV(uniformPoints);
});

function findPointsNear(x, points) {
    let near = 0;
    let len = points[points.length-1].x - points[0].x;
    for (let i = 0; i < points.length; i++) {
        let p = points[i];
        if (Math.abs(x - p.x) < len) {
            len = Math.abs(x - p.x);
            near = i;
        }
    }
    let result = [null, null, null, null];
    if (x - points[near].x >= 0) {
        result[0] = near - 1 < 0 ? points[near] : points[near - 1];
        result[1] = points[near];
        result[2] = near + 1 >= points.length ? result[1] : points[near + 1];
        result[3] = near + 1 >= points.length ? result[2] : points[near + 2];
    } else {

        result[0] = near - 2 < 0 ? points[near] : points[near - 2];
        result[1] = near - 1 < 0 ? points[near] : points[near - 1];
        result[2] = points[near];
        result[3] = near + 1 >= points.length ? result[2] : points[near + 1];
    }
    return result;
}

function generateUniformPoints(points, numPoints) {
    const firstPoint = points[0];
    const lastPoint = points[points.length - 1];
    const xStep = (lastPoint.x - firstPoint.x) / (numPoints - 1);
    let result = [];
    for (let i = 0; i < numPoints; i++) {
        let x = firstPoint.x + i * xStep;
        let y = cubicSplineInterpolation(x, findPointsNear(x, points));
        result.push({ x: x, y: y });
    }
    return result;
}

document.getElementById('downloadBtn').addEventListener('click', () => {
    downloadCSV(points);
});

function downloadCSV(points) {
    let csvContent = 'data:text/csv;charset=utf-8,' + convertPointsToCSV(points);

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'tableData.csv');
    document.body.appendChild(link); // Required for Firefox

    link.click();
    link.remove(); // Remove the link from the document
}

function convertPointsToCSV(points) {
    let csv = '';

    // Add header
    csv += 'X coordinate,Y coordinate\n';

    points.forEach(row => {
        csv += row.x + ',' + row.y;
        csv += '\n';
    });

    return csv;
}

function drawPointsOnCanvas(points, width, height, canvas) {
    const ctx = canvas.getContext('2d');

    if (!ctx) {
        console.error('Failed to select the canvas element or get its context.');
        return;
    }
    canvas.width = width;
    canvas.height = height;

    // Step 2: Clear the canvas
    ctx.clearRect(0, 0, width, height); // Clears the canvas area

    // Set the background color to black
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, width, height);

    // Step 3: Draw points
    drawPoints(points, width, height, ctx);
}

function drawPoints(points, width, height, ctx) {
    points.forEach(point => {
        // Adjust the x and y coordinates based on the canvas's size
        const adjustedX = point.x;
        const adjustedY = height - point.y;

        // Draw each point as a white dot at the adjusted coordinates
        ctx.fillStyle = 'white'; // Set the color to white
        ctx.beginPath();
        ctx.arc(adjustedX, adjustedY, 2, 0, Math.PI * 2, true); // Draw a circle (approximating a point)
        ctx.fill();
        ctx.closePath();
        console.log(`adjusted point: (${adjustedX}, ${adjustedY})`);
    });
}

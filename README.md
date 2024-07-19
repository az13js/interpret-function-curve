# Interpret the function curve within the image using the Canny Edge Detection algorithm

## Overview

This application allows users to upload local images, interpret the function curve within the image using the Canny Edge Detection algorithm, and download the results as a CSV file. The application utilizes a third-party library, [CannyJS.min.js](https://github.com/hamada147/CannyJS), for edge detection.

## Setup

To set up this project, you need to have the following files and dependencies:

1. The git repository containing the following files:
    - `index.html` (HTML file)
    - `script.js` (JavaScript file)
    - `CannyJS.min.js` (JavaScript library for Canny Edge Detection)

2. A local image file that you wish to upload and process.

## Features

This web page has the following features:

1. **Image Upload**: A file input field allows the user to upload a local image.

2. **Canny Edge Detection**: The JavaScript library `CannyJS.min.js` is used for implementing the Canny Edge Detection algorithm.

3. **Display Output**: The results of the Canny Edge Detection are displayed on the web page.

4. **Parameter Adjustment**: Users can adjust the algorithm parameters using four input fields:
    - `htInput`: Height Threshold
    - `ltInput`: Low Threshold
    - `sigmmaInput`: Sigma
    - `kernelSizeInput`: Kernel Size

5. **Download CSV**: A button allows users to download the edge detection results as a CSV file.

## Usage

To use the web application and get the coordinates from the function curve in an image file:

1. **Open the Application**:
   Access the web application through the browser by visiting the URL `/index.html`.

2. **Select an Image File**:
   Click the file input element and select an image file containing a function curve.

3. **Adjust Algorithm Parameters**:
   Use the input fields to adjust the Canny Edge Detection parameters (Height Threshold, Low Threshold, Sigma, Kernel Size). These parameters can be tweaked to improve the edge detection results.

4. **Process the Image**:
   Click the "Get Coordinates" to trigger the edge detection. The function will process the uploaded image and display the result on the canvas.

5. **Download the Results**:
   Click the "Download CSV" to trigger the download function, which saves the output as a CSV file containing the coordinates of the function curve's points.

## Contributions and Issues

If you encounter any issues or would like to contribute to this project, please open an issue on Gitee with a detailed description and relevant code snippets.

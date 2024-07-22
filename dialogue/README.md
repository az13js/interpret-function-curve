# Interpret the function curve within the image using the Canny Edge Detection algorithm

The application was created as a collaboration between the user and AI, with the help of PHP scripts.

## Overview

The purpose of this project is to create a web application that can interpret function curves within an image using the Canny Edge Detection algorithm. This application allows developers and users to analyze images containing function curves and extract valuable information from them.

## Requirements

- **Canny Edge Detection Algorithm**: The application uses the Canny Edge Detection algorithm to identify edges in an image. This algorithm is a popular edge detection method used in computer vision.
- **PHP Scripts**: This project utilizes two PHP scripts - `main.php` and `function.php` - which handle user input and execute the model accordingly.
  - `main.php`: This script is responsible for reading user input from an input file named `input.md` and executing the model provided by the `function.php` script.
  - `function.php`: This script defines a function `runModel()` that takes in `userPrompt` and `systemPrompt` as parameters and returns the result of the model execution.

## Usage

1. **Save Conversation**: Save your conversation with AI in the `input.md` file. The conversation details the requirements for the web application, including analyzing every aspect of the problem and raising questions to clarify any doubt points.

2. **Run the Application**: Use the `main.php` script to run the model by executing the following command in the terminal:

    ```
    php main.php
    ```

3. **Output**: The script will save the output of the model execution to an `output.md` file.

## Contributions

As an open-source project, we encourage contributions from developers and users. Contributions can range from bug fixes, improvements to the application, or even adding new features. Please ensure your contributions are properly tested before submitting them for review.

## Acknowledgments

The development of this project was a collaborative effort between the user and AI, with the help of PHP scripts and the Canny Edge Detection algorithm. We appreciate all contributors and users who have helped shape this project.

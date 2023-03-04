# Image Processing API

This API generates thumbnails for images stored in `assets/full` using the [Sharp](https://github.com/lovell/sharp) library. Users can request a thumbnail by specifying the filename, width, and height in the query parameters of a GET request. If a thumbnail with the specified dimensions already exists, it will be returned from the cache. Otherwise, a new thumbnail will be generated and stored in a cache directory for future requests.

## Getting Started

To run the Image Processing API, first clone the repository from GitHub:

```
git clone https://github.com/legalaspro/image_processing_api.git
```

Then install the dependencies using npm:

```
cd image_processing_api
npm install
```

To start the server, run the following command:

```
npm start
```

This will start the server on port 3000.

## API Endpoint

The API endpoint for generating thumbnails is `/api/images`. To generate a thumbnail, make a GET request to this endpoint with the following query parameters:

- `filename`: The name of the image file to generate a thumbnail for
- `width`: The width of the thumbnail in pixels
- `height`: The height of the thumbnail in pixels


For example, to generate a 200x200 pixel thumbnail for an image named "fjord.jpg", make a GET request to the following URL:

```
GET /api/images?filename=fjord.jpg&width=200&height=200
```

The API will generate a thumbnail with the specified dimensions and return in same format as JPEG image.

## Scripts

- `start`: Runs the server using `nodemon` and restarts the server automatically when changes are made to the code.
- `copy-assets`: Copies the `assets` directory from the `src` directory to the `dist` directory.
- `build`: Builds the TypeScript code using `tsc` and copies the `assets` directory to the `dist` directory.
- `jasmine`: Runs the Jasmine test suite.
- `lint`: Runs ESLint to check for linting errors in the code.
- `lint:fix`: Runs ESLint and automatically fixes any fixable linting errors.
- `prettier`: Runs Prettier to format the code.
- `test`: Builds the TypeScript code and runs the Jasmine test suite in a test environment.
- `test:watch`: Runs the `build` and `jasmine` scripts whenever changes are made to the code in the `src` directory.


## Error Handling

If any of the required query parameters (filename, width, and height) are missing, the API will return a 400 Bad Request response with the following error message:

```json
{
  "message": "Missing query parameters: filename, width and height required!"
}
```

If the width or height query parameter is not a number, the API will return a 400 Bad Request response with the following error message:

```json
{
  "message": "Invalid query parameters: width and height must be numbers"
}
```

If the requested image file does not exist, the API will return a 404 Not Found response with the following error message:

```json
{
  "message": "Image not found"
}
```


## Cache Directory

The API uses a cache directory to store generated thumbnails for future requests. The cache directory is located in the `assets/thumb` subdirectory of the project directory.

## Licensing
This project is licensed under the ISC License.

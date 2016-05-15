# instagram-collection

## Installation

Make sure to have the latest versions of Node and NPM installed. Run `npm install` in the command line at the root of the project to install all dependencies.

## Configuration

Make sure to provide an Instagram API key (http://instagram.pixelunion.net/) and a MongoDB URI in the config.json file for the app to function properly.

## Running the app

Run `npm start` in the command line at the root of the project to start a local server. This server will provide an API and a single page app at the [localhost](localhost:5000).

## API

### POST - /api/create

The `/api/create` endpoint will create a collection and return its database Id.

Its parameters are:
* `tag` : a valid hashtag in the form of a string, without the # prefix.
* `time_start` : a timestamp in the form of a javascript date.
* `time_end` : a timestamp in the form of a javascript date.

It will look for content tagged with the supplied tag between the supplied start and end dates.

### GET - /api/collections

The `/api/collections` endpoint retrieves collections.

Its parameters are:
* `collection` : a database Id for a collection.
* `limit` : the amount of content to return (default is 50).
* `offset` : the amount of content to skip.

If supplied a collection Id, this endpoint will retrieve: a collection, some content (based on the limit and offset params), and some pagination information.

If not supplied with a collection Id, this endpoint will return an array of collections without their content.

## Demo

Check out a live demo of the app at http://instagram-collection.herokuapp.com/

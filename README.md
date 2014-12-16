# recipe.place-api

Create and manage recipes.

## Description

This service manages recipes. They are stored in a bucket in S3, although the backend uses [Resourceful](https://www.npmjs.com/package/resourceful) which means it is easily switched to use a different storage solution.

## Configuration

The service will need some AWS keys and a bucket location in order to be able to use S3. These can be set either with an appropriate config file (e.g., `config/test.yaml`, `config/production.yaml`, etc.) or by using environment variables.

To create a config file, just copy `custom-environment-variables.yml` in the `config` directory. Alternatively, use the names of the environment variables from that file to work out what can be set:

```yaml
aws:
  accessKeyId: AWS_ACCESS_KEY_ID
  secretAccessKey: AWS_SECRET_ACCESS_KEY

  region: AWS_DEFAULT_REGION

  bucket: AWS_BUCKET
```

Note that the environment variables were purposefully chosen to match the names used by the AWS command-line tools, so if you have those installed you should already have the first three variables set.

## Deployment

To configure an Heroku instance to run the recipe API, do something like this:

```shell
heroku create my-recipe-place-api
heroku addons:add papertrail # or your favourite logger
heroku config:set AWS_ACCESS_KEY_ID=mykey
heroku config:set AWS_SECRET_ACCESS_KEY=mysecret
heroku config:set AWS_DEFAULT_REGION=eu-west-1
heroku config:set AWS_BUCKET=mybucket
```

The result is that a request to this API for the resource:

```
https://recipe-place-api.herokuapp.com/recipe/roast-chicken
```

will return the JSON document with the key `recipe/roast-chicken` that is stored in the bucket `mybucket`.

If using Wercker, then the environment variables should also be set in `Settings > Pipeline`.

## Testing

Tests are run with:

    npm test

## Development

To run a local server for development use:

    npm start

This will spin up a local server on port 5000, and watch for changes to the source files.

If you don't want to clutter your environment with the variable for the bucket name, or you want to use a different bucket whilst testing, then just do this:

```
AWS_BUCKET=mybucket npm start
```

'use strict';

var should = require('should');

/**
 * Create a Broadway app to house our plugin:
 */

var resourceful = require('resourceful');
var app = new (require('broadway')).App();

/**
 * Add S3 support to resourceful:
 */

app.use(require('resourceful-s3'), resourceful);
app.init();

var AWS_CONFIG = require('config').aws;

/**
 * Create a model for recipes:
 */

var Recipe = require('resourceful-model-recipe/lib/recipes/resources')(resourceful);
var fixture = require('resourceful-model-recipe/test/fixtures/recipes');

/**
 * Now tell our model to use S3 storage:
 */

Recipe.use('S3', {
  uri: 'resourceful-s3.test'
, opts: {
    keyid: AWS_CONFIG.accessKeyId
  , secret: AWS_CONFIG.secretAccessKey
  , region: AWS_CONFIG.region
  }
});

describe('Recipes DB:', function(){
  var id = 'recipe';

  it.only('should create and delete a recipe with a generated id', function(done){
    var recipe = new Recipe(fixture);

    recipe.save(function(err, r){
      should.not.exist(err);
      should.exist(r);
      r.should.have.property('resource', 'Recipe');
      r.should.have.property('status', 201);
      r.should.containEql(fixture);

      r.destroy(function(err, res){
        should.not.exist(err);
        should.exist(res);
        res.should.have.property('status', 204);
        res.should.have.property('id');

        Recipe.get(r.id, function(err, recipe){
          should.not.exist(recipe);
          err.should.equal('Document not found');
          done();
        });
      });
    });
  });

  it('should create a Recipe with id field', function(done){
    var recipe = new Recipe(fixture);

    recipe.id = id;

    recipe.save(function(err, r){
      should.not.exist(err);
      should.exist(recipe);
      r.should.have.property('resource', 'Recipe');
      r.should.have.property('status', 201);
      r.should.containEql(fixture);

      done();
    });
  });

  it('should get Recipe', function(done){
    Recipe.get(id, function(err, recipe){
      should.not.exist(err);
      should.exist(recipe);
      recipe.should.have.property('resource', 'Recipe');
      recipe.should.have.property('id', id);
      recipe.should.containEql(fixture);

      done();
    });
  });

  it('should delete Recipe by id', function(done){
    Recipe.destroy(id, function(err, res){
      should.not.exist(err);
      should.exist(res);
      res.should.have.property('id', 'recipe/' + id);
      res.should.have.property('status', 204);
      done();
    });
  });
});

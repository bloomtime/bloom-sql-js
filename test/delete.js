/*jshint node:true globalstrict:true */
/*global describe:true it:true*/
"use strict";

var assert = require("assert"),
    should = require("should"),
    DELETE = require('../').DELETE;

describe('DELETE', function(){
  describe('#(foo)', function(){
    it('should return an object with text and values', function(){
      var sql = DELETE('foo');
      sql.should.have.text;
      sql.should.have.values;
      sql.text.should.equal('DELETE FROM foo');
      sql.values.should.be.an.instanceOf(Array)
      sql.values.should.have.length(0);
    });
  });
  describe('#()', function(){
    it('should throw if no table is provided', function(){
      var thrown = false;
      try {
        var sql = DELETE();
      } catch(e) {
        thrown = true;
      }
      assert(thrown);
    });
  });
  describe('#(table).WHERE(where)', function(){
    it('should return an object with placeholders and populate values', function(){
      var sql = DELETE('foo').WHERE({ a: 1, b: 2 });
      sql.should.have.text;
      sql.should.have.values;
      sql.text.should.equal('DELETE FROM foo WHERE a = $1 AND b = $2');
      sql.values.should.be.an.instanceOf(Array)
      sql.values.should.eql([1,2]);
    });
  });
});

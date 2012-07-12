/*jshint node:true globalstrict:true */
/*global describe:true it:true*/
"use strict";

var assert = require("assert"),
    should = require("should"),
    UPDATE = require('../').UPDATE;

describe('UPDATE', function(){
  describe('#(table)', function(){
    it('should return an object with text and values', function(){
      var sql = UPDATE('foo');
      sql.should.have.text;
      sql.should.have.values;
      sql.text.should.equal('UPDATE foo');
      sql.values.should.be.an.instanceOf(Array)
      sql.values.should.have.length(0);
    });
  });
  describe('#()', function(){
    it('should throw if no table is provided', function(){
      var thrown = false;
      try {
        var sql = UPDATE();
      } catch(e) {
        thrown = true;
      }
      assert(thrown);
    });
  });
  describe('#(table).SET(set)', function(){
    it('should return an object with placeholders and populate values', function(){
      var sql = UPDATE('foo').SET({ a: 1, b: 2, c: 3 });
      sql.should.have.text;
      sql.should.have.values;
      sql.text.should.equal('UPDATE foo SET a = $1, b = $2, c = $3');
      sql.values.should.be.an.instanceOf(Array)
      sql.values.should.eql([1,2,3]);
    });
  });
  describe('#(table).SET(set).WHERE(where).RETURING(\'*\')', function(){
    it('should return an object with placeholders and populate values', function(){
      var sql = UPDATE('foo').SET({ a: 1, b: 2, c: 3 }).WHERE({ d: 4, e: 5 }).RETURNING('*');
      sql.should.have.text;
      sql.should.have.values;
      sql.text.should.equal('UPDATE foo SET a = $1, b = $2, c = $3 WHERE d = $4 AND e = $5 RETURNING *');
      sql.values.should.be.an.instanceOf(Array)
      sql.values.should.eql([1,2,3,4,5]);
    });
  });
  describe('#(table).SET(set).WHERE(where).RETURING([\'a\',\'b\'])', function(){
    it('should return an object with placeholders and populate values', function(){
      var sql = UPDATE('foo').SET({ a: 1, b: 2, c: 3 }).WHERE({ d: 4, e: 5 }).RETURNING(['a','b']);
      sql.should.have.text;
      sql.should.have.values;
      sql.text.should.equal('UPDATE foo SET a = $1, b = $2, c = $3 WHERE d = $4 AND e = $5 RETURNING a, b');
      sql.values.should.be.an.instanceOf(Array)
      sql.values.should.eql([1,2,3,4,5]);
    });
  });
  describe('#(table).SET(set).WHERE(where_array).RETURING([\'a\',\'b\'])', function(){
    it('should return an object with placeholders and populate values', function(){
      var sql = UPDATE('foo').SET({ a: 1, b: 2, c: 3 }).WHERE({ d: 4, e: [ 5, 6 ] }).RETURNING(['a','b']);
      sql.should.have.text;
      sql.should.have.values;
      sql.text.should.equal('UPDATE foo SET a = $1, b = $2, c = $3 WHERE d = $4 AND e IN ($5, $6) RETURNING a, b');
      sql.values.should.be.an.instanceOf(Array)
      sql.values.should.eql([1,2,3,4,5,6]);
    });
  });
});

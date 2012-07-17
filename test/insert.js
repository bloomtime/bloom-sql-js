/*jshint node:true globalstrict:true */
/*global describe:true it:true*/
"use strict";

var assert = require("assert"),
    should = require("should"),
    INSERT = require('../').INSERT;

describe('INSERT', function(){
  describe('#(table)', function(){
    it('should return an object with text and values', function(){
      var sql = INSERT('foo');
      sql.should.have.text;
      sql.should.have.values;
      sql.text.should.equal('INSERT INTO foo');
      sql.values.should.be.an.instanceOf(Array)
      sql.values.should.have.length(0);
    });
  });
  describe('#()', function(){
    it('should throw if no table is provided', function(){
      var thrown = false;
      try {
        var sql = INSERT();
      } catch(e) {
        thrown = true;
      }
      assert(thrown);
    });
  });
  describe('#(table).VALUES(set)', function(){
    it('should return an object with placeholders and populate values', function(){
      var sql = INSERT('foo').VALUES({ a: 1, b: 2, c: 3 });
      sql.should.have.text;
      sql.should.have.values;
      sql.text.should.equal('INSERT INTO foo(a, b, c) VALUES($1, $2, $3)');
      sql.values.should.be.an.instanceOf(Array)
      sql.values.should.eql([1,2,3]);
    });
  });
  describe('#(table).VALUES(set)', function(){
    it('should return an object with placeholders and populate values', function(){
      var sql = INSERT('foo').VALUES({ a: 1, b: 2, c: 3 });
      sql.should.have.text;
      sql.should.have.values;
      sql.text.should.equal('INSERT INTO foo(a, b, c) VALUES($1, $2, $3)');
      sql.values.should.be.an.instanceOf(Array)
      sql.values.should.eql([1,2,3]);
    });
  });
  describe('#(table).VALUES(set_with_nulls)', function(){
    it('should return an object with placeholders and populate values', function(){
      var sql = INSERT('foo').VALUES({ a: null, b: null, c: null });
      sql.should.have.text;
      sql.should.have.values;
      sql.text.should.equal('INSERT INTO foo(a, b, c) VALUES($1, $2, $3)');
      sql.values.should.be.an.instanceOf(Array)
      sql.values.should.eql([null,null,null]);
    });
  });
  describe('#(table).VALUES(set_with_arrays)', function(){
    it('should return an object with array placeholders and flattened values', function(){
      var sql = INSERT('foo').VALUES({ a: [ 1, 2 ], b: [ [ 3, 4 ], [ 5, 6 ] ], c: [ 7, 8 ] });
      sql.should.have.text;
      sql.should.have.values;
      sql.text.should.equal('INSERT INTO foo(a, b, c) VALUES(ARRAY[$1, $2], ARRAY[ARRAY[$3, $4], ARRAY[$5, $6]], ARRAY[$7, $8])');
      sql.values.should.be.an.instanceOf(Array)
      sql.values.should.eql([1,2,3,4,5,6,7,8]);
    });
  });
});

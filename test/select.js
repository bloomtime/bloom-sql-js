/*jshint node:true globalstrict:true */
/*global describe:true it:true*/
"use strict";

var assert = require("assert"),
    should = require("should"),
    SQL = require('../'),
    SELECT = SQL.SELECT,
    ASC = SQL.ASC,
    DESC = SQL.DESC,
    AND = SQL.AND,
    OR = SQL.OR,
    NOT_NULL = SQL.NOT_NULL,
    NULL = SQL.NULL;

describe('SELECT', function(){
  describe('#()', function(){
    it('should return an object with text and values', function(){
      var sql = SELECT('foo');
      sql.should.have.text;
      sql.should.have.values;
      sql.text.should.equal('SELECT foo');
      sql.values.should.be.an.instanceOf(Array)
      sql.values.should.have.length(0);
    });
  });
  describe('#()', function(){
    it('should default to * if no columns are provided', function(){
      var sql = SELECT();
      sql.should.have.text;
      sql.should.have.values;
      sql.text.should.equal('SELECT *');
      sql.values.should.be.an.instanceOf(Array)
      sql.values.should.have.length(0);
    });
  });
  describe('#().FROM(table)', function(){
    it('should return a SELECT FROM statment with no values', function(){
      var sql = SELECT().FROM('foo');
      sql.should.have.text;
      sql.should.have.values;
      sql.text.should.equal('SELECT * FROM foo');
      sql.values.should.be.an.instanceOf(Array)
      sql.values.should.have.length(0);
    });
  });
  describe('#().FROM(table).WHERE(where)', function(){
    it('should return an object with placeholders and populate values', function(){
      var sql = SELECT().FROM('foo').WHERE({ a: 1, b: 2 });
      sql.should.have.text;
      sql.should.have.values;
      sql.text.should.equal('SELECT * FROM foo WHERE a = $1 AND b = $2');
      sql.values.should.be.an.instanceOf(Array)
      sql.values.should.eql([1,2]);
    });
  });
  describe('#().FROM(table).WHERE(where_array)', function(){
    it('should return an object with placeholders and populate flattened values', function(){
      var sql = SELECT().FROM('foo').WHERE({ a: [1,2,3], b: 4 });
      sql.should.have.text;
      sql.should.have.values;
      sql.text.should.equal('SELECT * FROM foo WHERE a IN ($1, $2, $3) AND b = $4');
      sql.values.should.be.an.instanceOf(Array)
      sql.values.should.eql([1,2,3,4]);
    });
  });
  describe('#().FROM(table).WHERE(where_null)', function(){
    it('should return an object with placeholders and populate null/not-null values correctly', function(){
      var sql = SELECT().FROM('foo').WHERE({ a: NULL, b: NOT_NULL });
      sql.should.have.text;
      sql.should.have.values;
      sql.text.should.equal('SELECT * FROM foo WHERE a IS NULL AND b IS NOT NULL');
      sql.values.should.be.an.instanceOf(Array)
      sql.values.should.have.length(0);
    });
  });
  describe('#().FROM(table).WHERE(where_null,OR)', function(){
    it('should return an object with placeholders and populate null/not-null values correctly', function(){
      var sql = SELECT().FROM('foo').WHERE({ a: NULL, b: NOT_NULL },OR);
      sql.should.have.text;
      sql.should.have.values;
      sql.text.should.equal('SELECT * FROM foo WHERE a IS NULL OR b IS NOT NULL');
      sql.values.should.be.an.instanceOf(Array)
      sql.values.should.have.length(0);
    });
  });
  describe('#().FROM(table).WHERE(where_null,OR)', function(){
    it('should return an object with placeholders and populate null/not-null values correctly', function(){
      var sql = SELECT().FROM('foo').WHERE({ a: NULL, b: NOT_NULL },'OR');
      sql.should.have.text;
      sql.should.have.values;
      sql.text.should.equal('SELECT * FROM foo WHERE a IS NULL OR b IS NOT NULL');
      sql.values.should.be.an.instanceOf(Array)
      sql.values.should.have.length(0);
    });
  });
  describe('#().FROM(table).WHERE(where_null,OR).ORDER_BY(col,DESC)', function(){
    it('should return an object with placeholders and populated values', function(){
      var sql = SELECT().FROM('foo').WHERE({ a: NULL, b: NOT_NULL },OR).ORDER_BY('bar',DESC);
      sql.should.have.text;
      sql.should.have.values;
      sql.text.should.equal('SELECT * FROM foo WHERE a IS NULL OR b IS NOT NULL ORDER BY bar DESC');
      sql.values.should.be.an.instanceOf(Array)
      sql.values.should.have.length(0);
    });
  });
  describe('#().FROM(table).WHERE(where_null,OR).ORDER_BY(col,ASC)', function(){
    it('should return an object with placeholders and populated values', function(){
      var sql = SELECT().FROM('foo').WHERE({ a: NULL, b: NOT_NULL },OR).ORDER_BY('bar',ASC);
      sql.should.have.text;
      sql.should.have.values;
      sql.text.should.equal('SELECT * FROM foo WHERE a IS NULL OR b IS NOT NULL ORDER BY bar ASC');
      sql.values.should.be.an.instanceOf(Array)
      sql.values.should.have.length(0);
    });
  });
  describe('#().FROM(table).WHERE(where_null,OR).ORDER_BY(col,DESC)', function(){
    it('should return an object with placeholders and populated values', function(){
      var sql = SELECT().FROM('foo').WHERE({ a: NULL, b: NOT_NULL },OR).ORDER_BY('bar','DESC');
      sql.should.have.text;
      sql.should.have.values;
      sql.text.should.equal('SELECT * FROM foo WHERE a IS NULL OR b IS NOT NULL ORDER BY bar DESC');
      sql.values.should.be.an.instanceOf(Array)
      sql.values.should.have.length(0);
    });
  });
  describe('#().FROM(table).WHERE(where_null,OR).ORDER_BY(col,ASC)', function(){
    it('should return an object with placeholders and populated values', function(){
      var sql = SELECT().FROM('foo').WHERE({ a: NULL, b: NOT_NULL },OR).ORDER_BY('bar','ASC');
      sql.should.have.text;
      sql.should.have.values;
      sql.text.should.equal('SELECT * FROM foo WHERE a IS NULL OR b IS NOT NULL ORDER BY bar ASC');
      sql.values.should.be.an.instanceOf(Array)
      sql.values.should.have.length(0);
    });
  });
  describe('#().FROM(table).WHERE("(id < ?) AND (bar = ?)", [3, 5]).ORDER_BY(col,ASC)', function(){
    it('should return an object with placeholders and populated values', function(){
      var sql = SELECT().FROM('foo').WHERE("(id < ?) AND (bar = ?)", [3, 5])
      sql.should.have.text;
      sql.should.have.values;
      sql.text.should.equal('SELECT * FROM foo WHERE (id < $1) AND (bar = $2)')
      sql.values.should.be.an.instanceOf(Array)
      sql.values.should.eql([3, 5]);
    });
  });
  describe('#().FROM(table).WHERE("id IN ?", [[3, 5, 6]]).ORDER_BY(col,ASC)', function(){
    it('should return an object with placeholders and populated values', function(){
      var sql = SELECT().FROM('foo').WHERE("id IN ?", [[3, 5]])
      sql.should.have.text;
      sql.should.have.values;
      sql.text.should.equal('SELECT * FROM foo WHERE id IN ($1, $2)')
      sql.values.should.be.an.instanceOf(Array)
      sql.values.should.eql([3, 5]);
    });
  });
  describe('#().FROM(table).WHERE(where_null,OR).ORDER_BY(col,ASC).LIMIT(10).OFFSET(10)', function(){
    it('should return an object with placeholders and populated values', function(){
      var sql = SELECT().FROM('foo').WHERE({ a: NULL, b: NOT_NULL },OR).ORDER_BY('bar','ASC').LIMIT(10).OFFSET(10);
      sql.should.have.text;
      sql.should.have.values;
      sql.text.should.equal('SELECT * FROM foo WHERE a IS NULL OR b IS NOT NULL ORDER BY bar ASC LIMIT 10 OFFSET 10');
      sql.values.should.be.an.instanceOf(Array)
      sql.values.should.have.length(0);
    });
  });
});

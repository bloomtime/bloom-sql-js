/*jshint node:true globalstrict:true*/
"use strict";

var assert = require('assert');

var NULL = null,
    NOT_NULL = { toString: function() { return 'NOT NULL'; } },
    AND =      { toString: function() { return 'AND'; } },
    OR =       { toString: function() { return 'OR'; } },
    ASC =      { toString: function() { return 'ASC'; } },
    DESC =     { toString: function() { return 'DESC'; } };

//
// Convenience function for building a simple UPDATE/SET/WHERE/RETURNING statement.
//
// e.g.
//
//   var sql = UPDATE('users').SET({ email: 'foo@example.com' }).WHERE({ id: 1 }).RETURNING('*');
//   db.query(sql, ...);
//
function UPDATE(table) {
    if (!(this instanceof UPDATE)) {
        return new UPDATE(table);
    }
    assert(table);
    this.text = 'UPDATE ' + table;
    this.values = [];
}

UPDATE.prototype = {
    SET: function(set) {
        // build set clause:
        var set_columns = Object.keys(set),
            set_clause = set_columns.map(function(c,i) {
                return c + ' = $' + (i+1);
            }),
            set_values = set_columns.map(function(c){ return set[c]; });
        this.text += ' SET ' + set_clause.join(', ');
        this.values.push.apply(this.values, set_values);
        return this;
    },
    WHERE: function(where,conjunction) {
        assert(this.text.indexOf('SET') >= 0);
        if (conjunction === undefined) {
            conjunction = 'AND';
        }
        assert(conjunction == 'AND' || conjunction == 'OR');
        this.text += ' WHERE ' + get_where_clause(where, this.values, conjunction);
        return this;
    },
    RETURNING: function(returning) {
        assert(this.text.indexOf('SET') >= 0);
        // returning can be an array of columns or '*'
        if (Array.isArray(returning)) {
            returning = returning.join(', ');
        }
        this.text += ' RETURNING ' + returning;
        return this;
    }
};


//
// Convenience function for building a simple SELECT/FROM/WHERE/ORDER BY/LIMIT/OFFSET statement.
//
// e.g.
//
//   var sql = SELECT('*').FROM('users').WHERE({ email: 'foo@example.com' }).ORDER_BY('created_at','DESC').LIMIT(10).OFFSET(10);
//   db.query(sql, ...);
//
function SELECT(columns) {
    if (!(this instanceof SELECT)) {
        return new SELECT(columns);
    }
    if (!columns) {
        columns = '*';
    } else if (Array.isArray(columns)) {
        columns = columns.join(', ');
    }
    this.text = 'SELECT ' + columns;
    this.values = [];
}

SELECT.prototype = {
    FROM: function(table) {
        this.text += ' FROM ' + table;
        return this;
    },
    WHERE: function(where,conjunction) {
        assert(this.text.indexOf('FROM') >= 0);
        if (conjunction === undefined) {
            conjunction = 'AND';
        }
        assert(conjunction == AND || conjunction == OR);
        this.text += ' WHERE ' + get_where_clause(where, this.values, conjunction);
        return this;
    },
    ORDER_BY: function(what,direction) {
        assert(this.text.indexOf('FROM') >= 0);
        // what can be an array of columns or a single string
        if (Array.isArray(what)) {
            what = what.join(', ');
        }
        this.text += ' ORDER BY ' + what;
        if (direction) {
            assert(direction == ASC || direction == DESC);
            this.text += ' ' + direction;
        }
        return this;
    },
    LIMIT: function(count) {
        assert(this.text.indexOf('FROM') >= 0);
        this.text += ' LIMIT ' + count;
        return this;
    },
    OFFSET: function(by) {
        assert(this.text.indexOf('FROM') >= 0);
        this.text += ' OFFSET ' + by;
        return this;
    }
};

function INSERT(table) {
    if (!(this instanceof INSERT)) {
        return new INSERT(table);
    }
    assert(table);
    this.text = 'INSERT INTO ' + table;
    this.values = [];
}

INSERT.prototype = {
    VALUES: function(object) {
        var values = this.values,
            columns = Object.keys(object),
            placeholders = columns.map(function(c,i) {
                values.push(object[c]);
                return '$' + values.length;
            });
        this.text += '('+columns.join(', ')+') VALUES(' + placeholders.join(', ') + ')';
        return this;
    },
    RETURNING: function(returning) {
        assert(this.text.indexOf('VALUES') >= 0);
        // returning can be an array of columns or '*'
        if (Array.isArray(returning)) {
            returning = returning.join(', ');
        }
        this.text += ' RETURNING ' + returning;
        return this;
    }
};

function DELETE(table) {
    if (!(this instanceof DELETE)) {
        return new DELETE(table);
    }
    assert(table);
    this.text = 'DELETE FROM ' + table;
    this.values = [];
}

DELETE.prototype = {
    WHERE: function(where,conjunction) {
        if (conjunction === undefined) {
            conjunction = 'AND';
        }
        assert(conjunction == AND || conjunction == OR);
        this.text += ' WHERE ' + get_where_clause(where, this.values, conjunction);
        return this;
    },
    LIMIT: function(count) {
        assert(this.text.indexOf('WHERE') >= 0);
        this.text += ' LIMIT ' + count;
        return this;
    }
};

// used in UPDATE, SELECT and DELETE
// can handle where objects like so:
// { foo: [1,2,3,4], bar: NOT_NULL, baz: null }
function get_where_clause(where, values, conjunction){
    return Object.keys(where).map(function(c,i) {
        var value = where[c];
        if (Array.isArray(value)) {
            return c + ' IN (' + value.map(function(v,i) {
                values.push(v);
                return '$'+values.length;
            }).join(', ') + ')';
        } else if (value === null) {
            return c + ' IS NULL';
        } else if (value === NOT_NULL) {
            return c + ' IS NOT NULL';
        } else {
            values.push(value);
            return c + ' = $' + values.length;
        }
    }).join(' ' + conjunction + ' ');
}

module.exports = {
    UPDATE: UPDATE,
    SELECT: SELECT,
    INSERT: INSERT,
    DELETE: DELETE,
    // key worms:
    NOT_NULL: NOT_NULL,
    NULL: NULL,
    ASC: ASC,
    DESC: DESC,
    AND: AND,
    OR: OR
};


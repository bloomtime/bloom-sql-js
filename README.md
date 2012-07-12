# What are you?

I am an __overly simple__ library to make it a bit easier to build simple SQL statements for [node-postgres](https://github.com/brianc/node-postgres/) (affectionaly known as `pg`). I generate the `{ text: '...', values: [] }` objects that you typically pass to `client.query(...)`.

It gets tedious matching up `$1, $2` etc. and building the right kind of values array. My functions help you do this and get the place-holder numbers right, even for `UPDATE/SET/WHERE` and for `WHERE IN` clauses which require a flattened array of arguments.

I have some tests written in Mocha. Of course I could use more!

_No really_. __Overly simple__. 

# Like what?

Connect to `pg` as normal:

```
var pg = require('pg');

var db = new pg.Client('YOUR_DB_URL');
db.connect();
```

Selecting stuff:

```
> SELECT().FROM('foo').WHERE({ a: [1,2,3], b: 4 });
{
  text: 'SELECT * FROM foo WHERE a IN ($1, $2, $3) AND b = $4',
  values: [1,2,3,4]
}
```

Delete stuff:

```
var query = DELETE('foo').WHERE({ a: 1, b: 2 });
```

Delete stuff:

```
var query = DELETE('foo').WHERE({ a: 1, b: 2 });
```

Delete stuff:

```
var query = DELETE('foo').WHERE({ a: 1, b: 2 });
```

Pass the resulting query object to the db:

```
db.query(query, function(err,results){
  // check err and do stuff with results.rows
});
```

# TODO

 * complex conjunctions `(a = 1 AND b = 2) OR (c = 3 AND d = 4)`
 * comparisons in where clauses `(a > 1 AND b < 2)`
 * any hint of `JOIN`, sub-select, etc.
 * the other 90% of SQL?

# Installation

`npm install bloom-sql --save`

(`--save` automatically updates your `package.json` file, tell your friends)


# License

(The MIT License)

Copyright (c) 2011-2012 Bloom Studio, Inc.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

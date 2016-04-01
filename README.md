# iron-tree
[![travis build](https://travis-ci.org/ferrous-frameworks/iron-tree.svg?branch=master)](https://travis-ci.org/ferrous-frameworks/iron-tree)

iron-tree is a object tree designed to allow modifying objects based on keys containing one or multiple wildcard delimiters.

[Documentation](http://)*COMING SOON*

## Installation

`npm install iron-tree`

## Usage

```js
var IronTree = require('iron-tree')
var t = new IronTree.Tree<any>({
    wildcard: '*'
});
var data = 'data1';
t.add('test.test.test.test.test', {
    some: data
});
t.add('test.test.test', {
    some: "data2"
});
t.add('test.not.test.not', {
    some: "data3"
});
t.add('test.test.test.test.not', {
    some: "data4"
});

var someWild = t.get('test.*.test.*.test');
expect(_.isArray(someWild)).to.be.true;
expect(someWild.length).to.be.equal(1);
expect(someWild[0]).to.not.be.an('undefined');
expect(someWild[0].some).to.be.equal(data);

var someWild = t.get('test.*.test');
expect(_.isArray(someWild)).to.be.true;
expect(someWild.length).to.be.equal(1);
expect(someWild[0]).to.not.be.an('undefined');
expect(someWild[0].some).to.be.equal("data2");

var some = t.get('test.test.test.test.test');
expect(_.isArray(some)).to.be.true;
expect(some.length).to.be.equal(1);
expect(some[0]).to.not.be.an('undefined');
expect(some[0].some).to.be.equal(data);
done();
```

## Features

- Multiple Wildcards
- Add Children
- Remove Children
- Array of objects with matching pattern

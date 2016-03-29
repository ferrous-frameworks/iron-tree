///<reference path='../typings/master.d.ts' />
var chai = require('chai');
var expect = chai.expect;
var _ = require('lodash');
var IronTree = require('./iron-tree');
describe('iron-tree', function () {
    it("should add elements", function (done) {
        var t = new IronTree.Tree();
        var data = 'data';
        var key = 'test';
        t.add(key, {
            some: data
        });
        var some = t.get(key);
        expect(_.isArray(some)).to.be.true;
        expect(some.length).to.be.equal(1);
        expect(some[0]).to.not.be.an('undefined');
        expect(some[0].some).to.be.equal(data);
        done();
    });
    it("should add child elements", function (done) {
        var t = new IronTree.Tree();
        var data = 'data';
        var key = 'test.test';
        t.add(key, {
            some: data
        });
        var some = t.get(key);
        expect(_.isArray(some)).to.be.true;
        expect(some.length).to.be.equal(1);
        expect(some[0]).to.not.be.an('undefined');
        expect(some[0].some).to.be.equal(data);
        done();
    });
    it("should add multiple elements", function (done) {
        var t = new IronTree.Tree();
        var key = 'test';
        t.add(key, {
            some: "data1"
        });
        t.add(key, {
            some: "data2"
        });
        var some = t.get(key);
        expect(_.isArray(some)).to.be.true;
        expect(some.length).to.be.equal(2);
        expect(some[0]).to.not.be.an('undefined');
        expect(some[0].some).to.be.equal("data1");
        expect(some[1]).to.not.be.an('undefined');
        expect(some[1].some).to.be.equal("data2");
        done();
    });
    it("should add multiple child elements", function (done) {
        var t = new IronTree.Tree();
        var key = 'test.test';
        t.add(key, {
            some: "data1"
        });
        t.add(key, {
            some: "data2"
        });
        var some = t.get(key);
        expect(_.isArray(some)).to.be.true;
        expect(some.length).to.be.equal(2);
        expect(some[0]).to.not.be.an('undefined');
        expect(some[0].some).to.be.equal("data1");
        expect(some[1]).to.not.be.an('undefined');
        expect(some[1].some).to.be.equal("data2");
        done();
    });
    it("should add 3+ child elements", function (done) {
        var t = new IronTree.Tree();
        var key = 'test.test.test';
        t.add(key, {
            some: "data1"
        });
        t.add(key, {
            some: "data2"
        });
        var some = t.get(key);
        expect(_.isArray(some)).to.be.true;
        expect(some.length).to.be.equal(2);
        expect(some[0]).to.not.be.an('undefined');
        expect(some[0].some).to.be.equal("data1");
        expect(some[1]).to.not.be.an('undefined');
        expect(some[1].some).to.be.equal("data2");
        done();
    });
    it("should add 3+ child elements with data on each", function (done) {
        var t = new IronTree.Tree();
        t.add('test', {
            some: "data1"
        });
        t.add('test', {
            some: "data2"
        });
        t.add('test.test', {
            some: "data3"
        });
        t.add('test.test', {
            some: "data4"
        });
        t.add('test.test.test', {
            some: "data5"
        });
        t.add('test.test.test', {
            some: "data6"
        });
        var testtesttest = t.get('test.test.test');
        expect(_.isArray(testtesttest)).to.be.true;
        expect(testtesttest.length).to.be.equal(2);
        expect(testtesttest[0]).to.not.be.an('undefined');
        expect(testtesttest[0].some).to.be.equal("data5");
        expect(testtesttest[1]).to.not.be.an('undefined');
        expect(testtesttest[1].some).to.be.equal("data6");
        var testtest = t.get('test.test');
        expect(_.isArray(testtest)).to.be.true;
        expect(testtest.length).to.be.equal(2);
        expect(testtest[0]).to.not.be.an('undefined');
        expect(testtest[0].some).to.be.equal("data3");
        expect(testtest[1]).to.not.be.an('undefined');
        expect(testtest[1].some).to.be.equal("data4");
        var test = t.get('test');
        expect(_.isArray(test)).to.be.true;
        expect(test.length).to.be.equal(2);
        expect(test[0]).to.not.be.an('undefined');
        expect(test[0].some).to.be.equal("data1");
        expect(test[1]).to.not.be.an('undefined');
        expect(test[1].some).to.be.equal("data2");
        done();
    });
    it("should remove all elements if no element is passed", function (done) {
        var t = new IronTree.Tree();
        var key = 'test.test.test';
        t.add(key, {
            some: "data1"
        });
        t.add(key, {
            some: "data2"
        });
        t.remove(key);
        var some = t.get(key);
        expect(_.isArray(some)).to.be.true;
        expect(some.length).to.be.equal(0);
        done();
    });
    it("should remove the element that is passed in", function (done) {
        var t = new IronTree.Tree();
        var key = 'test.test.test';
        var test = {
            some: "data1"
        };
        t.add(key, test);
        t.add(key, {
            some: "data2"
        });
        t.remove(key, test);
        var some = t.get(key);
        expect(_.isArray(some)).to.be.true;
        expect(some.length).to.be.equal(1);
        expect(some[0]).to.not.be.an('undefined');
        expect(some[0].some).to.be.equal("data2");
        done();
    });
    it("should remove the element that is passed in event if it is the last root element", function (done) {
        var t = new IronTree.Tree();
        var key = 'test';
        var test = {
            some: "data1"
        };
        t.add(key, test);
        t.remove(key, test);
        var some = t.get(key);
        expect(_.isArray(some)).to.be.true;
        expect(some.length).to.be.equal(0);
        done();
    });
    it("should remove all elements from the tree is no key is passed", function (done) {
        var t = new IronTree.Tree();
        t.add('test', {
            some: "data1"
        });
        t.add('test', {
            some: "data2"
        });
        t.add('test.test', {
            some: "data3"
        });
        t.add('test.test', {
            some: "data4"
        });
        t.add('test.test.test', {
            some: "data5"
        });
        t.add('test.test.test', {
            some: "data6"
        });
        t.remove();
        var testtesttest = t.get('test.test.test');
        expect(_.isArray(testtesttest)).to.be.true;
        expect(testtesttest.length).to.be.equal(0);
        var testtest = t.get('test.test');
        expect(_.isArray(testtest)).to.be.true;
        expect(testtest.length).to.be.equal(0);
        var test = t.get('test');
        expect(_.isArray(test)).to.be.true;
        expect(test.length).to.be.equal(0);
        done();
    });
    it("should handle wildcards at the end of the key sections", function (done) {
        var t = new IronTree.Tree({
            wildcard: '*'
        });
        var data = 'data';
        t.add('test.test', {
            some: data
        });
        var someWild = t.get('test.*');
        var some = t.get('test.test');
        expect(_.isArray(someWild)).to.be.true;
        expect(someWild.length).to.be.equal(1);
        expect(someWild[0]).to.not.be.an('undefined');
        expect(someWild[0].some).to.be.equal(data);
        expect(_.isArray(some)).to.be.true;
        expect(some.length).to.be.equal(1);
        expect(some[0]).to.not.be.an('undefined');
        expect(some[0].some).to.be.equal(data);
        done();
    });
    it("should handle wildcards at the end of the key sections with multiple elements", function (done) {
        var t = new IronTree.Tree({
            wildcard: '*'
        });
        t.add('test.1', {
            some: "data1"
        });
        t.add('test.2', {
            some: "data2"
        });
        var someWild = t.get('test.*');
        expect(_.isArray(someWild)).to.be.true;
        expect(someWild.length).to.be.equal(2);
        expect(someWild[0]).to.not.be.an('undefined');
        expect(someWild[0].some).to.be.equal("data1");
        expect(someWild[1]).to.not.be.an('undefined');
        expect(someWild[1].some).to.be.equal("data2");
        var some = t.get('test.1');
        expect(_.isArray(some)).to.be.true;
        expect(some.length).to.be.equal(1);
        expect(some[0]).to.not.be.an('undefined');
        expect(some[0].some).to.be.equal("data1");
        done();
    });
    it("should handle wildcards at the beginning of the key sections with multiple elements", function (done) {
        var t = new IronTree.Tree({
            wildcard: '*'
        });
        t.add('test.1', {
            some: "data1"
        });
        t.add('test.2', {
            some: "data2"
        });
        var some = t.get('*.1');
        expect(_.isArray(some)).to.be.true;
        expect(some.length).to.be.equal(1);
        expect(some[0]).to.not.be.an('undefined');
        expect(some[0].some).to.be.equal("data1");
        var some = t.get('*.2');
        expect(_.isArray(some)).to.be.true;
        expect(some.length).to.be.equal(1);
        expect(some[0]).to.not.be.an('undefined');
        expect(some[0].some).to.be.equal("data2");
        done();
    });
    it("should handle wildcards in the middle of the key sections", function (done) {
        var t = new IronTree.Tree({
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
    });
    it("should provide a branch's trunk elements", function (done) {
        var t = new IronTree.Tree();
        var trunk = 'I am the trunk';
        var branch = 'I am a branch off the trunk';
        var leaf = 'I am a leaf of the branch';
        t.add('trunk', trunk);
        t.add('trunk.branch', branch);
        t.add('trunk.branch.leaf', leaf);
        var trunkElements = t.getTrunk('leaf');
        expect(_.isArray(trunkElements)).to.be.true;
        expect(trunkElements.length).to.be.equal(3);
        expect(trunkElements[0]).to.be.equal(trunk);
        expect(trunkElements[1]).to.be.equal(branch);
        expect(trunkElements[2]).to.be.equal(leaf);
        done();
    });
    it("should provide a branch's child elements", function (done) {
        var t = new IronTree.Tree();
        var trunk = 'I am the trunk';
        var branch = 'I am a branch off the trunk';
        var leaf = 'I am a leaf of the branch';
        t.add('trunk', trunk);
        t.add('trunk.branch', branch);
        t.add('trunk.branch.leaf', leaf);
        var branchElements = t.getBranches('trunk');
        expect(_.isArray(branchElements)).to.be.true;
        expect(branchElements.length).to.be.equal(3);
        expect(branchElements[0]).to.be.equal(trunk);
        expect(branchElements[1]).to.be.equal(branch);
        expect(branchElements[2]).to.be.equal(leaf);
        done();
    });
    it("should provide an 'isEmpty' function that returns true if the tree has no elements", function (done) {
        var t = new IronTree.Tree();
        var isEmpty = t.isEmpty();
        expect(isEmpty).to.be.true;
        done();
    });
    it("should provide an 'isEmpty' function that returns false if the tree has elements", function (done) {
        var t = new IronTree.Tree();
        t.add('test', 'test');
        var isEmpty = t.isEmpty();
        expect(isEmpty).to.be.false;
        done();
    });
});
//# sourceMappingURL=iron-tree.test.js.map
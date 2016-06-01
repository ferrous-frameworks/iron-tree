"use strict";
var _ = require('lodash');
var Tree = (function () {
    function Tree(opts) {
        opts = _.isUndefined(opts) ? {} : opts;
        opts = _.extend({
            delimiter: '.',
            wildcard: '*'
        }, opts);
        this.wildcard = opts.wildcard;
        this.delimiter = opts.delimiter;
        this.tree = [];
    }
    Tree.prototype.isEmpty = function () {
        return this.tree.length === 0;
    };
    Tree.prototype.add = function (key, element) {
        var keyArr = this.getKeyArray(key);
        var branch = this.getBranch(keyArr);
        branch.elements.push(element);
        return this;
    };
    Tree.prototype.remove = function (key, element, removeChildKey) {
        if (_.isUndefined(key)) {
            this.tree = [];
        }
        else {
            var keyArr = this.getKeyArray(key);
            var branch = this.getBranch(keyArr);
            if (!_.isUndefined(branch)) {
                if (_.isUndefined(removeChildKey)) {
                    branch.elements = _.filter(branch.elements, function (el) {
                        return !_.isUndefined(element) && element !== el;
                    });
                }
                else {
                    branch.children = _.filter(branch.children, function (child) {
                        return child.key !== removeChildKey;
                    });
                }
                if (branch.elements.length === 0 && branch.children.length === 0) {
                    if (keyArr.length === 1) {
                        this.tree = _.filter(this.tree, function (el) {
                            return el.key !== keyArr[0];
                        });
                    }
                    else {
                        this.remove(_.initial(keyArr), void 0, keyArr[keyArr.length - 1]);
                    }
                }
            }
        }
        return this;
    };
    Tree.prototype.getBranch = function (key, level) {
        if (_.isUndefined(level)) {
            level = this.tree;
        }
        var branch = _.find(level, function (el) {
            return el.key === key[0];
        });
        if (key.length > 0) {
            if (_.isUndefined(branch)) {
                branch = {
                    key: key[0],
                    elements: [],
                    children: []
                };
                level.push(branch);
            }
            key = _.rest(key);
            if (key.length === 0) {
                return branch;
            }
            return this.getBranch(key, branch.children);
        }
    };
    Tree.prototype.get = function (key, level, levels) {
        var _this = this;
        var matches = [];
        if (_.isUndefined(level)) {
            level = this.tree;
        }
        var keyArr = this.getKeyArray(key);
        if (keyArr.length > 0) {
            if (_.isUndefined(levels)) {
                levels = keyArr.length;
            }
            var instance = this;
            var branches = _.filter(level, function (el) {
                return el.key === keyArr[0] || instance.matchWildcard(keyArr[0]) || instance.matchWildcard(el.key);
            });
            _.each(branches, function (branch) {
                if (keyArr.length > 1) {
                    var childMatches = _this.get(_.rest(keyArr), branch.children, levels);
                    matches = matches.concat(childMatches);
                }
                else if ((levels - (levels - keyArr.length)) === 1) {
                    matches = matches.concat(branch.elements);
                }
            });
        }
        return matches;
    };
    Tree.prototype.getAll = function (level) {
        var _this = this;
        var matches = [];
        if (_.isUndefined(level)) {
            level = this.tree;
        }
        _.each(level, function (branch) {
            var childMatches = _this.getAll(branch.children);
            matches = matches.concat(childMatches);
            matches = matches.concat(branch.elements);
        });
        return matches;
    };
    Tree.prototype.getTrunk = function (branchKey) {
        var fullBranchKey = this.getFullKey(branchKey);
        return _.isUndefined(fullBranchKey) ? [] : this.getTrunkForBranch(fullBranchKey);
    };
    Tree.prototype.getBranches = function (branchKey) {
        var fullBranchKey = this.getFullKey(branchKey);
        if (!_.isUndefined(fullBranchKey)) {
            var branch = this.getBranch(fullBranchKey);
            return this.getAll([branch]).reverse();
        }
        else {
            return [];
        }
    };
    Tree.prototype.getFullKey = function (branchKey, level, builtKey) {
        var _this = this;
        if (_.isUndefined(level)) {
            level = this.tree;
        }
        if (!_.isArray(builtKey)) {
            builtKey = [];
        }
        var branch = _.find(level, function (el) {
            return el.key === branchKey;
        });
        if (!_.isUndefined(branch)) {
            builtKey.push(branch.key);
            return builtKey;
        }
        else {
            var fullKey = void 0;
            _.each(level, function (branch) {
                var branchBuiltKey = _.clone(builtKey);
                branchBuiltKey.push(branch.key);
                var fullBranchKey = _this.getFullKey(branchKey, branch.children, branchBuiltKey);
                if (!_.isUndefined(fullBranchKey)) {
                    fullKey = fullBranchKey;
                    return;
                }
            });
            return fullKey;
        }
    };
    Tree.prototype.getTrunkForBranch = function (key, matches) {
        if (!_.isArray(matches)) {
            matches = [];
        }
        var elements = this.get(key);
        matches = matches.concat(elements);
        key = _.initial(key);
        if (key.length > 0) {
            matches = this.getTrunkForBranch(key, matches);
        }
        return matches.reverse();
    };
    Tree.prototype.getKeyArray = function (key) {
        return _.isArray(key)
            ? key
            : key.split(this.delimiter);
    };
    Tree.prototype.matchWildcard = function (key) {
        return !_.isUndefined(this.wildcard) && this.wildcard === key;
    };
    return Tree;
}());
exports.Tree = Tree;
//# sourceMappingURL=iron-tree.js.map
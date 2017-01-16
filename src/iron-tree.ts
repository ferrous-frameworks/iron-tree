
import _ = require('lodash');

interface IElement<T> {
    key: string;
    elements: T[];
    children: IElement<T>[];
}

export class Tree<T> {
    private wildcard: string;
    private delimiter: string;
    private tree: IElement<T>[];
    private globalWildcardMatch: boolean;
    private cascadingWildcardMatch: boolean;

    constructor(opts?) {
        opts = _.isUndefined(opts) ? {} : opts;
        opts = _.extend({
            delimiter: '.',
            wildcard: '*',
            globalWildcardMatch: false,
            cascadingWildcardMatch: false
        }, opts);
        this.wildcard = opts.wildcard;
        this.delimiter = opts.delimiter;
        this.cascadingWildcardMatch = opts.cascadingWildcardMatch;
        this.globalWildcardMatch = opts.cascadingWildcardMatch || opts.globalWildcardMatch;
        this.tree = [];
    }

    public isEmpty(): boolean {
        return this.tree.length === 0;
    }

    public add(key: string|string[], element: T): Tree<T> {
        var keyArr: string[] = this.getKeyArray(key);
        var branch = this.getBranch(keyArr);
        branch.elements.push(element);
        return this;
    }

    public remove(key?: string|string[], element?: T, removeChildKey?: string): Tree<T> {
        if (_.isUndefined(key)) {
            this.tree = [];
        }
        else {
            var keyArr: string[] = this.getKeyArray(key);
            var branch = this.getBranch(keyArr);
            if (!_.isUndefined(branch)) {
                if (_.isUndefined(removeChildKey)) {
                    branch.elements = _.filter(branch.elements, (el) => {
                        return !_.isUndefined(element) && element !== el;
                    });
                }
                else {
                    branch.children = _.filter(branch.children, (child) => {
                        return child.key !== removeChildKey;
                    });
                }
                if (branch.elements.length === 0 && branch.children.length === 0) {
                    if (keyArr.length === 1) {
                        this.tree = _.filter(this.tree, (el) => {
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
    }

    private getBranch(key: string[], level?: IElement<T>[]): IElement<T> {
        if (_.isUndefined(level)) {
            level = this.tree;
        }
        var branch = _.find<IElement<T>>(level, (el) => {
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
            key = <any>_.rest(<any>key);
            if (key.length === 0) {
                return branch;
            }
            return this.getBranch(key, branch.children);
        }
    }

    public get(key: string|string[], level?: IElement<T>[], levels?: number): T[] {
        var matches = [];
        if (_.isUndefined(level)) {
            level = this.tree;
        }
        var keyArr: string[] = this.getKeyArray(key);
        if (this.globalWildcardMatch && _.isUndefined(levels) && keyArr.length == 1 && keyArr[0] == this.wildcard) {
            _.each(level, (el) => {
                matches = matches.concat(el.elements);
                var childMatches = <any>this.get([ this.wildcard ], el.children);
                matches = matches.concat(childMatches);
            });
        }
        else if (keyArr.length > 0) {
            if (_.isUndefined(levels)) {
                levels = keyArr.length;
            }
            var instance = this;
            var branches = _.filter(level, (el) => {
                return el.key === keyArr[0] || instance.matchWildcard(keyArr[0]) || instance.matchWildcard(el.key);
            });
            _.each(branches, (branch) => {
                if (this.cascadingWildcardMatch && keyArr[0] == this.wildcard) {
                    matches = matches.concat(branch.elements);
                    var next = keyArr.length == 1 ? [ this.wildcard ] : <any>_.rest(<any>keyArr);
                    var childMatches = <any>this.get(next, branch.children, levels);
                    matches = matches.concat(childMatches);
                }
                else if (keyArr.length > 1) {
                    var childMatches = <any>this.get(<any>_.rest(<any>keyArr), branch.children, levels);
                    matches = matches.concat(childMatches);
                }
                else if ((levels - (levels - keyArr.length)) === 1) {
                    matches = matches.concat(branch.elements);
                }
            });
        }
        return matches;
    }

    public getAll(level?: IElement<T>[]): T[] {
        var matches = [];
        if (_.isUndefined(level)) {
            level = this.tree;
        }
        _.each(level, (branch) => {
            var childMatches = this.getAll(branch.children);
            matches = matches.concat(childMatches);
            matches = matches.concat(branch.elements);
        });
        return matches;
    }

    public getTrunk(branchKey: string): T[] {
        var fullBranchKey = this.getFullKey(branchKey);
        return _.isUndefined(fullBranchKey) ? [] : this.getTrunkForBranch(fullBranchKey);
    }

    public getBranches(branchKey: string): T[] {
        var fullBranchKey = this.getFullKey(branchKey);
        if (!_.isUndefined(fullBranchKey)) {
            var branch = this.getBranch(fullBranchKey);
            return this.getAll([ branch ]).reverse();
        }
        else {
            return [];
        }
    }

    private getFullKey(branchKey: string, level?: IElement<T>[], builtKey?: string[]): string[] {
        if (_.isUndefined(level)) {
            level = this.tree;
        }
        if (!_.isArray(builtKey)) {
            builtKey = [];
        }
        var branch = _.find<IElement<T>>(level, (el) => {
            return el.key === branchKey;
        });
        if (!_.isUndefined(branch)) {
            builtKey.push(branch.key);
            return builtKey;
        }
        else {
            var fullKey = void 0;
            _.each(level, (branch) => {
                var branchBuiltKey = _.clone(builtKey);
                branchBuiltKey.push(branch.key);
                var fullBranchKey = this.getFullKey(branchKey, branch.children, branchBuiltKey);
                if (!_.isUndefined(fullBranchKey)) {
                    fullKey = fullBranchKey;
                    return;
                }
            });
            return fullKey;
        }
    }

    private getTrunkForBranch(key: string[], matches?: T[]): T[] {
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
    }

    private getKeyArray(key: string|string[]): string[] {
        return _.isArray(key)
            ? <string[]>key
            : (<string>key).split(this.delimiter);
    }

    private matchWildcard(key: string) {
        return !_.isUndefined(this.wildcard) && this.wildcard === key;
    }
}


///<reference path='../typings/main.d.ts' />

declare module "iron-tree" {
    export class Tree<T> {
        constructor(opts?);
        public isEmpty(): boolean;
        public add(key: string|string[], element: T): Tree<T>;
        public remove(key?: string|string[], element?: T): Tree<T>;
        public get(key: string|string[]): T[];
        public getAll(): T[];
        public getTrunk(branchKey: string): T[];
        public getBranches(branchKey: string): T[];
    }
}

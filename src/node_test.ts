import {expect} from "chai";
import {depTypeDefault, FileType, INode, IParsed} from "./common";
import {arrParsedToNodes, Nodes} from "./node";
import {zParseErrorType, zParseLine} from "./parse";

describe("node.ts class Nodes", () => {
    const nodes = new Nodes();
    const node = (nodes as any).addGetNode("path1");

    nodes.addParsed({from: "f1", to: null} as IParsed);
    nodes.addParsed({from: "f1", to: null} as IParsed);
    nodes.addParsed({from: "dir1/", to: null} as IParsed);
    nodes.addParsed({from: "dir1/", to: null} as IParsed);
    nodes.addParsed({from: "dir/f1", to: null} as IParsed);
    nodes.addParsed({from: "/dir/f1", to: null} as IParsed);
    nodes.addParsed({from: "f1", to: {path: "2", depType: depTypeDefault}} as IParsed);
    nodes.addParsed({from: "f1", to: {path: "2", depType: "x"}} as IParsed);

    it("should foo", () => {
        const exp = ["2", "path1", "f1", "dir1/", "dir/", "dir/f1", "/dir/", "/dir/f1"];
        expect(Object.keys((nodes as any).nodes)).to.deep.equal(exp);
    });
});

describe("node.ts arrParsedToNodes()", () => {
    // /path/to/file1
    it("should process a single file", () => {
        const arrParsed: IParsed[] =
            [{from: "/path/to/file1", to: null, annot: null}];

        // TODO
        // expect(arrParsedToNodes(arrParsed)).to.deep.equal(
        //     [{path: "f1", type: FileType.File, dir: null, annot: null, deps: []} as INode]);
    });

    // f1 ; annot1
    it("should process a single file with annotation", () => {
        const arrParsed: IParsed[] = [{from: "f1", to: null, annot: null}];
        expect(arrParsedToNodes(arrParsed)).to.deep.equal(
            [{path: "f1", type: FileType.File, dir: null, annot: null, deps: []} as INode]);
    });

    it("should process a single directory", () => {
        // f1 ; annot1
        const arrParsed: IParsed[] = [{from: "f1", to: null, annot: null}];
        expect(arrParsedToNodes(arrParsed)).to.deep.equal(
            [{path: "f1", type: FileType.File, dir: null, annot: null, deps: []} as INode]);
    });

    it("node.ts arrParsedToNodes() 2", () => {
        // src/d1/f1 ; annot1
        // src/d1/f2 ./f3 x
        // src/d1/f2 ../f4 ; annot4
        const arrParsed = [
            {from: "src/d1/f1", to: null, annot: "annot1"},
            {from: "src/d1/f2", to: {path: "src/d1/f3", depType: "x"}, annot: null},
            {from: "src/d1/f2", to: {path: "src/d1/f4", depType: depTypeDefault}, annot: "annot4"},
        ] as IParsed[];

        // TODO: stop INode.deps, introduce IEdge

        // tslint:disable:one-line
        const src: INode =
            {path: "src/", type: FileType.Directory, dir: null, annot: null, deps: []};
        const srcD1: INode =
            {path: "src/d1/", type: FileType.Directory, dir: src, annot: null, deps: []};
        const srcD1F1: INode =
            {path: "src/d1/f1", type: FileType.File, dir: srcD1, annot: "annot1", deps: []};
        const srcD1F2: INode =
            {path: "src/d1/f2", type: FileType.File, dir: srcD1, annot: null, deps: []};
        const srcD1F3: INode =
            {path: "src/d1/f3", type: FileType.File, dir: srcD1, annot: null, deps: []};
        const srcF4: INode =
            {path: "src/f4", type: FileType.File, dir: src, annot: null, deps: []};
        // tslint:enable

        srcD1F2.deps.push({to: srcD1F3, type: "x", annot: null});
        srcD1F2.deps.push({to: srcF4, type: depTypeDefault, annot: "annot4"});

        // TODO here
        // expect(arrParsedToNodes(arrParsed)).to.deep.equal([src, srcD1, srcD1F2, srcD1F3, srcF4]);
    });

    // TODO
    // /dir1/f1 ; annot1
    // /dir1/f2 ./f3 x
    // /dir1/f2 ../file4 ; annot4
});

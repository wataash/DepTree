import {expect} from "chai";
import {DepTreeError, DepType, FileType, IDefinition, IDep, INode, IParsed} from "./common";
import {nodesToDots, zNodesToDotsDep, zNodesToDotsNode} from "./dot";

// src/build.sh src/Makefile x ; make distribution
const src = {path: "src/", type: FileType.Directory, dir: null, annot: null, deps: []} as INode;
const buildsh = {path: "src/build.sh", type: FileType.File, dir: src, annot: null, deps: []} as INode;
const makefile = {path: "src/Makefile", type: FileType.File, dir: src, annot: null, deps: []} as INode;
buildsh.deps.push({to: makefile, type: "x", annot: "make distribution"} as IDep);

const defs = [
    {depType: "x", label: "make distribution", color: "#999999"},
    {depType: "d", label: "dummy", color: "#dddddd"},
]  as IDefinition[];

describe("dot.ts zNodesToDotsNode()", () => {
    it("should process directories correctly", () => {
        expect(zNodesToDotsNode(src)).to.equal('"src/" [label="src/", shape=folder]');
    });

    it("should process files correctly", () => {
        expect(zNodesToDotsNode(buildsh)).to.equal('"src/build.sh" [label="build.sh"]');
        expect(zNodesToDotsNode(makefile)).to.equal('"src/Makefile" [label="Makefile"]');
    });

    it("should throw an error", () => {
        const file = {path: "file", type: 99, dir: null, annot: null, deps: []} as INode;
        expect(() => nodesToDots([file], defs)).to.throw(
            DepTreeError, '{"path":"file","type":99,"dir":null,"annot":null,"deps":[]}: unknown type.');
    });
});

describe("dot.ts zNodesToDotsDep()", () => {
    it("should process dependencies", () => {
        // TODO annotation
        expect(zNodesToDotsDep(buildsh, defs)).to.deep.equal(
            ['"src/build.sh" -> "src/Makefile" [constraint=false, color="#999999"];']);
    });

    it("should return [] if node.dep === []", () => {
        expect(zNodesToDotsDep(src, defs)).to.deep.equal([]);
        expect(zNodesToDotsDep(makefile, defs)).to.deep.equal([]);
    });
});

describe("dot.ts nodesToDots()", () => {
    const exp = `digraph {
rankdir=LR;

"src/" [label="src/", shape=folder]
"src/build.sh" [label="build.sh"]
"src/Makefile" [label="Makefile"]

"src/" -> "src/build.sh" [arrowhead=none];
"src/" -> "src/Makefile" [arrowhead=none];

"src/build.sh" -> "src/Makefile" [constraint=false, color="#999999"];
}
`;

    it("should foo", () => {
        expect(nodesToDots([src, buildsh, makefile], defs)).to.deep.equal(exp);
    });
});

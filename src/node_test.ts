import {expect} from "chai";
import {IParsed} from "./common";
import {arrParsedToNodes, Nodes} from "./node";

describe("node.ts class Nodes", () => {
    const nodes = new Nodes();
    const node = (nodes as any).addGetNode("path1");

    nodes.addParsed({from: "f1", to: null} as IParsed);
    nodes.addParsed({from: "f1", to: null} as IParsed);
    nodes.addParsed({from: "dir1/", to: null} as IParsed);
    nodes.addParsed({from: "dir1/", to: null} as IParsed);
    nodes.addParsed({from: "dir/f1", to: null} as IParsed);
    nodes.addParsed({from: "/dir/f1", to: null} as IParsed);
    nodes.addParsed({from: "f1", to: {path: "2", depType: null}} as IParsed);
    nodes.addParsed({from: "f1", to: {path: "2", depType: "x"}} as IParsed);

    it("should foo", () => {
        const exp = ["2", "path1", "f1", "dir1/", "dir/", "dir/f1", "/dir/", "/dir/f1"];
        expect(Object.keys((nodes as any).nodes)).to.deep.equal(exp);
    });
});

describe("node.ts arrParsedToNodes()", () => {
    const arrParsed = [
        {
            annot: null,
            from: "${TOOLDIR}/bin/nbconfig",
            to: null,
        },
        {
            annot: null,
            from: "${TOOLDIR}/bin/nbmake-amd64",
            to: {path: "${TOOLDIR}/bin/nbmake", depType: "x"},
        },
        {
            annot: "wrapper for nbmake",
            from: "${TOOLDIR}/bin/nbmake-amd64",
            to: null,
        },
        {
            annot: "MAKEFLAGS",
            from: "${TOOLDIR}/bin/nbmake-amd64",
            to: {path: "src/share/mk", depType: null},
        },
        {
            annot: "nmbake-amd64 depend all",
            from: "src/build.sh",
            to: {path: "${OBJDIR}/sys/arch/amd64/compile/GENERIC/Makefile", depType: null},
        },
        {
            annot: "nbmake -m src/share/mk",
            from: "src/build.sh",
            to: {path: "src/share/mk", depType: null},
        },
        {
            annot: "nbmake-amd64 obj",
            from: "src/build.sh",
            to: {path: "src/sys/arch/amd64/compile/Makefile", depType: null},
        },
        {
            annot: "nbconfig -b ${OBJDIR} -s src/netbsd/src/sys/",
            from: "src/build.sh",
            to: {path: "src/sys/arch/amd64/conf/GENERIC", depType: null},
        },
        {
            annot: "nbmake",
            from: "src/build.sh",
            to: {path: "src/tools/Makefile", depType: "x"},
        },
    ] as IParsed[];

    it("should foo", () => {
        // TODO here, easy test case
        // expect(arrParsedToNodes(arrParsed)).to.deep.equal([]);
    });
});

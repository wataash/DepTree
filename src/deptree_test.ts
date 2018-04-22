import {expect} from "chai";
import {depTypeDefault, IDefinition, INode} from "./common";
import {txtToDot} from "./deptree";
import {nodesToDots, zNodesToDotsNode} from "./dot";

// TODO map
const definitions: IDefinition[] = [
    {depType: depTypeDefault, label: "Read", color: "#999999"},
    {depType: "c", label: "Create", color: "#74b961"},
    {depType: "w", label: "Write", color: "#b14932"},
    {depType: "x", label: "Execute", color: "#365a93"},
];

// TODO test start with /

const txt = `
# ./build.sh -n -m amd64 -T ../tools u -U kernel=GENERIC
\${TOOLDIR}/bin/nbconfig
\${TOOLDIR}/bin/nbmake-amd64 \${TOOLDIR}/bin/nbmake x
\${TOOLDIR}/bin/nbmake-amd64 ; wrapper for nbmake
\${TOOLDIR}/bin/nbmake-amd64 src/share/mk ; MAKEFLAGS
src/build.sh \${OBJDIR}/sys/arch/amd64/compile/GENERIC/Makefile ; nmbake-amd64 depend all
src/build.sh src/share/mk ; nbmake -m src/share/mk
src/build.sh src/sys/arch/amd64/compile/Makefile ; nbmake-amd64 obj
src/build.sh src/sys/arch/amd64/conf/GENERIC ; nbconfig -b \${OBJDIR} -s src/netbsd/src/sys/
src/build.sh src/tools/Makefile x ; nbmake
`;

const dot = `
`;

describe("deptree.ts txtToDot()", () => {
    it("should foo", () => {
        // TODO here, easier test case
        // expect(txtToDot(definitions, txt)).to.equal("dot");
    });
});

import {expect} from "chai";
import {DepTreeError, IParsed} from "./common";
import {IZParseError, parseTxt, zExpandPath, zParseErrorType, zParseLine} from "./parse";

describe("parse.ts expandPath", () => {
    it("should foo", () => {
        expect(zExpandPath("any", "/path/to/file2")).to.equal("/path/to/file2");
    });

    it("should bar", () => {
        expect(zExpandPath("/file1", "./file2")).to.equal("/file2");
        expect(zExpandPath("/path/to/file1", "./file2")).to.equal("/path/to/file2");
        expect(zExpandPath("/path/to/file1", "../../file2")).to.equal("/file2");
        expect(zExpandPath("/file1", "../../../file2")).to.equal("/file2");
    });

    it("should baz", () => {
        expect(zExpandPath("file1", "./file2")).to.equal("file2");
        expect(zExpandPath("path/to/file1", "./file2")).to.equal("path/to/file2");
        expect(zExpandPath("path/to/file1", "../../file2")).to.equal("file2");
        expect(zExpandPath("file1", "../../../file2")).to.equal("../../../file2");
    });
});

describe("parse.ts zParseLine", () => {
    it("should return null", () => {
        expect(zParseLine("")).to.deep.equal([null, zParseErrorType.emptyLine]);
        expect(zParseLine("      ")).to.deep.equal([null, zParseErrorType.emptyLine]);
        expect(zParseLine("# comment; annotation ignored")).to.deep.equal([null, zParseErrorType.comment]);
    });

    it("should be success", () => {
        expect(zParseLine("  /path/to/file1   ")).to.deep.equal(
            [{from: "/path/to/file1", to: null, annot: null}, zParseErrorType.success]);

        expect(zParseLine("file1")).to.deep.equal(
            [{from: "file1", to: null, annot: null}, zParseErrorType.success]);

        expect(zParseLine("file1;;;")).to.deep.equal(
            [{from: "file1", to: null, annot: ";;"}, zParseErrorType.success]);

        expect(zParseLine("file1;  annot ation  ")).to.deep.equal(
            [{from: "file1", to: null, annot: "annot ation"}, zParseErrorType.success]);

        expect(zParseLine("file1    ;  annotation")).to.deep.equal(
            [{from: "file1", to: null, annot: "annotation"}, zParseErrorType.success]);

        expect(zParseLine("file1 file2")).to.deep.equal(
            [{from: "file1", to: {path: "file2", depType: null}, annot: null}, zParseErrorType.success]);

        expect(zParseLine("/path/1 ../2")).to.deep.equal(
            [{from: "/path/1", to: {path: "/2", depType: null}, annot: null}, zParseErrorType.success]);

        expect(zParseLine("file1 file2 c")).to.deep.equal(
            [{from: "file1", to: {path: "file2", depType: "c"}, annot: null}, zParseErrorType.success]);
    });

    it("should return error", () => {
        expect(zParseLine("file1 file2 c x")).to.deep.equal([null, zParseErrorType.tooManyItems]);
        expect(zParseLine("file1 file2 c x; annot")).to.deep.equal([null, zParseErrorType.tooManyItems]);
    });
});

describe("parse.ts parseTxt", () => {
    it("should foo", () => {

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
a b c d e ; annot
`;

        const arrParsedExp = [
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

        const errsExp: IZParseError[] = [{type: zParseErrorType.tooManyItems, numLine: 12}];

        expect(parseTxt(txt)).to.deep.equal([arrParsedExp, errsExp]);
    });
});

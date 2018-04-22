# DepTree

[![Build Status](https://travis-ci.org/wataash/DepTree.svg?branch=master)](https://travis-ci.org/wataash/DepTree) [![codecov](https://codecov.io/gh/wataash/DepTree/branch/master/graph/badge.svg)](https://codecov.io/gh/wataash/DepTree)

WIP

example: netbsd build.sh

in:

```
# ./build.sh -n -m amd64 -T ../tools u -U kernel=GENERIC
${TOOLDIR}/bin/nbconfig
${TOOLDIR}/bin/nbmake-amd64 ${TOOLDIR}/bin/nbmake x
${TOOLDIR}/bin/nbmake-amd64 ; wrapper for nbmake
${TOOLDIR}/bin/nbmake-amd64 src/share/mk ; MAKEFLAGS
src/build.sh ${OBJDIR}/sys/arch/amd64/compile/GENERIC/Makefile ; nmbake-amd64 depend all
src/build.sh src/share/mk ; nbmake -m src/share/mk
src/build.sh src/sys/arch/amd64/compile/Makefile ; nbmake-amd64 obj
src/build.sh src/sys/arch/amd64/conf/GENERIC ; nbconfig -b ${OBJDIR} -s src/netbsd/src/sys/
src/build.sh src/tools/Makefile x ; nbmake
```

out:

```dot
digraph {
rankdir=LR;

"${TOOLDIR}/" [label="${TOOLDIR}/", shape=folder]
"${TOOLDIR}/bin/" [label="bin/", shape=folder]
"${TOOLDIR}/bin/nbconfig" [label="nbconfig"]
"${TOOLDIR}/bin/nbmake-amd64" [label="nbmake-amd64"]
"${TOOLDIR}/bin/nbmake" [label="nbmake"]
"src/" [label="src/", shape=folder]
"src/share/" [label="share/", shape=folder]
"src/share/mk" [label="mk"]
"src/build.sh" [label="build.sh"]
"${OBJDIR}/" [label="${OBJDIR}/", shape=folder]
"${OBJDIR}/sys/" [label="sys/", shape=folder]
"${OBJDIR}/sys/arch/" [label="arch/", shape=folder]
"${OBJDIR}/sys/arch/amd64/" [label="amd64/", shape=folder]
"${OBJDIR}/sys/arch/amd64/compile/" [label="compile/", shape=folder]
"${OBJDIR}/sys/arch/amd64/compile/GENERIC/" [label="GENERIC/", shape=folder]
"${OBJDIR}/sys/arch/amd64/compile/GENERIC/Makefile" [label="Makefile"]
"src/sys/" [label="sys/", shape=folder]
"src/sys/arch/" [label="arch/", shape=folder]
"src/sys/arch/amd64/" [label="amd64/", shape=folder]
"src/sys/arch/amd64/compile/" [label="compile/", shape=folder]
"src/sys/arch/amd64/compile/Makefile" [label="Makefile"]
"src/sys/arch/amd64/conf/" [label="conf/", shape=folder]
"src/sys/arch/amd64/conf/GENERIC" [label="GENERIC"]
"src/tools/" [label="tools/", shape=folder]
"src/tools/Makefile" [label="Makefile"]

"${TOOLDIR}/" -> "${TOOLDIR}/bin/" [arrowhead=none];
"${TOOLDIR}/bin/" -> "${TOOLDIR}/bin/nbconfig" [arrowhead=none];
"${TOOLDIR}/bin/" -> "${TOOLDIR}/bin/nbmake-amd64" [arrowhead=none];
"${TOOLDIR}/bin/" -> "${TOOLDIR}/bin/nbmake" [arrowhead=none];
"src/" -> "src/share/" [arrowhead=none];
"src/share/" -> "src/share/mk" [arrowhead=none];
"src/" -> "src/build.sh" [arrowhead=none];
"${OBJDIR}/" -> "${OBJDIR}/sys/" [arrowhead=none];
"${OBJDIR}/sys/" -> "${OBJDIR}/sys/arch/" [arrowhead=none];
"${OBJDIR}/sys/arch/" -> "${OBJDIR}/sys/arch/amd64/" [arrowhead=none];
"${OBJDIR}/sys/arch/amd64/" -> "${OBJDIR}/sys/arch/amd64/compile/" [arrowhead=none];
"${OBJDIR}/sys/arch/amd64/compile/" -> "${OBJDIR}/sys/arch/amd64/compile/GENERIC/" [arrowhead=none];
"${OBJDIR}/sys/arch/amd64/compile/GENERIC/" -> "${OBJDIR}/sys/arch/amd64/compile/GENERIC/Makefile" [arrowhead=none];
"src/" -> "src/sys/" [arrowhead=none];
"src/sys/" -> "src/sys/arch/" [arrowhead=none];
"src/sys/arch/" -> "src/sys/arch/amd64/" [arrowhead=none];
"src/sys/arch/amd64/" -> "src/sys/arch/amd64/compile/" [arrowhead=none];
"src/sys/arch/amd64/compile/" -> "src/sys/arch/amd64/compile/Makefile" [arrowhead=none];
"src/sys/arch/amd64/" -> "src/sys/arch/amd64/conf/" [arrowhead=none];
"src/sys/arch/amd64/conf/" -> "src/sys/arch/amd64/conf/GENERIC" [arrowhead=none];
"src/" -> "src/tools/" [arrowhead=none];
"src/tools/" -> "src/tools/Makefile" [arrowhead=none];

"${TOOLDIR}/bin/nbmake-amd64" -> "${TOOLDIR}/bin/nbmake" [constraint=false, color="#365a93"];
"${TOOLDIR}/bin/nbmake-amd64" -> "src/share/mk" [constraint=false, color=""];
"src/build.sh" -> "${OBJDIR}/sys/arch/amd64/compile/GENERIC/Makefile" [constraint=false, color=""];
"src/build.sh" -> "src/share/mk" [constraint=false, color=""];
"src/build.sh" -> "src/sys/arch/amd64/compile/Makefile" [constraint=false, color=""];
"src/build.sh" -> "src/sys/arch/amd64/conf/GENERIC" [constraint=false, color=""];
"src/build.sh" -> "src/tools/Makefile" [constraint=false, color="#365a93"];
}
```

![tes dot](https://user-images.githubusercontent.com/4846670/39097633-03209e46-469a-11e8-8785-d37f019b8c82.png)


<!--
- CircleCI

watch on linux:

```fish
while true; clear; clear; npm run coverage; inotifywait -e create -r src/; end
```
-->

import * as libPath from "path";
import {DepTreeError, FileType, IDefinition, INode} from "./common";

/**
 * @example see dot_test.ts
 */
export function zNodesToDotsNode(node: INode): string {
    // TODO: if path contains "

    let label = libPath.basename(node.path);

    if (node.type === FileType.Directory) {
        label += "/";
    }

    // if (node.annot !== null) { // TODO
    if (node.annot === undefined || node.annot === null) { // TODO bug: undefined
        label = `"${label}"`;
    } else {
        // TODO escape < >
        label = `<${label}<BR/><FONT POINT-SIZE="12">${node.annot}</FONT>>`;
    }

    if (node.type === FileType.Directory) {
        return `"${node.path}" [label=${label}, shape=folder]`;
    } else if (node.type === FileType.File) {
        return `"${node.path}" [label=${label}]`;
    }
}

/**
 * @example see dot_test.ts
 */
export function zNodesToDotsDep(node: INode, defs: IDefinition[]): string[] {
    const dotDeps: string[] = [];

    for (const dep of node.deps) {
        let label = '""';
        if (dep.annot !== null) {
            label = `<<FONT POINT-SIZE="12">${dep.annot}</FONT>>`;
        }

        let color = "";
        for (const def of defs) {
            // TODO map; O(n) -> O(1)
            if (def.depType === dep.type) {
                const _ = def.label;
                color = def.color;
            }
        }
        dotDeps.push(`"${node.path}" -> "${dep.to.path}" [constraint=false, color="${color}", label=${label}];`);
    }

    return dotDeps;
}

/**
 * @example see dot_test.ts
 */
export function nodesToDots(nodes: INode[], defs: IDefinition[]): string {
    const dotNodes: string[] = [];
    const dotDirs: string[] = [];
    const dotDeps: string[] = [];

    for (const node of nodes) {
        dotNodes.push(zNodesToDotsNode(node));

        if (node.dir !== null) {
            dotDirs.push(`"${node.dir.path}" -> "${node.path}" [arrowhead=none];`);
        }

        // dotDeps = dotDeps.concat(zNodesToDotsDep(node, defs)); // maybe slow
        Array.prototype.push.apply(dotDeps, zNodesToDotsDep(node, defs));
    }

    let ret = "digraph {\nrankdir=LR;\n\n" + dotNodes.join("\n") + "\n\n";
    ret += dotDirs.join("\n") + "\n\n" + dotDeps.join("\n") + "\n}\n";
    return ret;
}

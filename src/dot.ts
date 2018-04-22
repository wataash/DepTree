import * as libPath from "path";
import {DepTreeError, FileType, IDefinition, INode} from "./common";

/**
 * @example see dot_test.ts
 */
export function zNodesToDotsNode(node: INode): string {
    // TODO: if path contains "
    if (node.type === FileType.Directory) {
        return `"${node.path}" [label="${libPath.basename(node.path)}/", shape=folder]`;
    } else if (node.type === FileType.File) {
        return `"${node.path}" [label="${libPath.basename(node.path)}"]`;
    } else {
        throw new DepTreeError(`${JSON.stringify(node)}: unknown type.`);
    }
}

/**
 * @example see dot_test.ts
 */
export function zNodesToDotsDep(node: INode, defs: IDefinition[]): string[] {
    const dotDeps: string[] = [];

    for (const dep of node.deps) {
        const todo = dep.annot; // TODO
        let color = "";
        for (const def of defs) {
            // TODO map; O(n) -> O(1)
            if (def.depType === dep.type) {
                const _ = def.label;
                color = def.color;
            }
        }
        dotDeps.push(`"${node.path}" -> "${dep.to.path}" [constraint=false, color="${color}"];`);
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

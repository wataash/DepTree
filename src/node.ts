import * as libPath from "path";

import {DepTreeError, DepType, FileType, IDep, INode, IParsed} from "./common";
import {IDefinition} from "./common";

// TODO private
export class Nodes {
    public readonly nodes: { [path: string]: INode; };

    constructor() {
        this.nodes = {};
    }

    public addParsed(parsed: IParsed) {
        const from = this.addGetNode(parsed.from);
        if (parsed.to !== null) {
            const to = this.addGetNode(parsed.to.path);
            from.deps.push({to, type: parsed.to.depType, annot: parsed.annot} as IDep);
        } else {
            from.annot = parsed.annot;
        }
    }

    private addGetNode(path: string): INode {
        if (this.nodes.hasOwnProperty(path)) {
            return this.nodes[path];
        }

        // TODO test /
        const dirPath = libPath.dirname(path);
        let dir: INode;
        if (dirPath === "/" || dirPath === ".") {
            dir = null;
        } else {
            dir = this.addGetNode(dirPath + "/");
        }

        const type = path.endsWith("/") ? FileType.Directory : FileType.File;

        const node = {path, type, dir, deps: [] as IDep[]} as INode;
        this.nodes[path] = node;
        return node;
    }
}

// TODO: ugly
export function arrParsedToNodes(arrParsed: IParsed[]): INode[] {
    const ret: INode[] = [];
    const nodes = new Nodes();

    for (const parsed of arrParsed) {
        nodes.addParsed(parsed);
    }

    for (const key of Object.keys(nodes.nodes)) {
         ret.push(nodes.nodes[key]);
    }

    return ret;
}
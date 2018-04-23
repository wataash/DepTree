/**
 * null if default
 */
export type DepType = string | null;

export const askIssue = "BUG: Internal error. Please report issue to " +
    "https://github.com/wataash/deptree/issues";

// ----------

export interface IParsed {
    from: string;
    to: { path: string, depType: DepType } | null;
    // annotation for
    // - from  if to === null
    // - to    if to !== null
    annot: string | null;
}

// ----------

// TODO
export enum FileType {
    Directory,
    File,
}

export interface IDep {
    to: INode;
    type: DepType;
    annot: string | null;
}

/**
 * @param dir Parent directory. null if root.
 */
export interface INode {
    path: string;
    type: FileType;
    dir: INode | null;
    annot: string | null;
    deps: IDep[];
}

// ----------

// interface IEdge {
//     from: INode;
//     to: INode;
// }

// ----------

// https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-2.html
export class DepTreeError extends Error {
    constructor(message?: string) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

type Color = string;

export const depTypeDefault: DepType = "default";

// TODO map
export interface IDefinition {
    depType: DepType;
    label: string;
    color: Color;
}

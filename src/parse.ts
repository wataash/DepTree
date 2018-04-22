import * as path from "path";

import {askIssue, DepType, IParsed} from "./common";

// TODO
// const msg = `${line} : Too many items. (${s.length} items)`;
export enum zParseErrorType {
    success = 0,
    emptyLine,
    comment,
    tooManyItems,
}

export interface IZParseError {
    type: zParseErrorType;
    numLine: number;
}

export function zExpandPath(ref: string, rel: string): string {
    if (!rel.startsWith(".")) {
        return rel;
    }

    return path.normalize(`${path.dirname(ref)}/${rel}`);
}

export function zParseLine(line: string): [IParsed | null, zParseErrorType] {
    line = line.trim();
    let fromToDep = line.trim();
    let annot: string = null;

    if (line === "") {
        return [null, zParseErrorType.emptyLine];
    }

    if (line.charAt(0) === "#") {
        return [null, zParseErrorType.comment];
    }

    const iSemiColon = line.indexOf(";");
    if (iSemiColon !== -1) {
        fromToDep = line.slice(0, iSemiColon).trim();
        annot = line.slice(iSemiColon + 1).trim();
    }

    const s = fromToDep.split(" ");

    if (s.length > 1) {
        s[1] = zExpandPath(s[0], s[1]);
    }

    let to: { path: string, depType: DepType | null } | null;
    switch (s.length) {
        case 1:
            to = null;
            break;
        case 2:
            to = {path: s[1], depType: null};
            break;
        case 3:
            to = {path: s[1], depType: s[2]};
            break;
        default:
            // TODO: indicate column which causes error
            return [null, zParseErrorType.tooManyItems];
    }

    return [{from: s[0], to, annot} as IParsed, zParseErrorType.success];
}

export function parseTxt(txt: string): [IParsed[], IZParseError[]] {
    const lines = txt.split("\n");
    const arrParsed: IParsed[] = [];
    const errors: IZParseError[] = [];

    lines.forEach((line, numLine) => {
        let parsed: IParsed;
        let err: zParseErrorType;
        numLine += 1; // 1-origin index

        [parsed, err] = zParseLine(line);
        if (![zParseErrorType.success, zParseErrorType.emptyLine, zParseErrorType.comment].includes(err)) {
            errors.push({type: err, numLine});
            return;
        }

        if (parsed === null) {
            return;
        }

        arrParsed.push(parsed);
    });

    return [arrParsed, errors];
}

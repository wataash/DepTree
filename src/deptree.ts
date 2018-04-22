import {IDefinition} from "./common";
import {nodesToDots} from "./dot";
import {arrParsedToNodes} from "./node";
import {parseTxt} from "./parse";

export function txtToDot(definitions: IDefinition[], txt: string) {
    const [arrParsed, errs] = parseTxt(txt); // TODO handle errs
    const nodes = arrParsedToNodes(arrParsed);
    const dots = nodesToDots(nodes, definitions);
    return dots;
}

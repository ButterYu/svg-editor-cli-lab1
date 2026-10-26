export class Tokenizer {
  parse(line: string): string[] {
    if (line.trimStart().startsWith("#")) return [];
    const result: string[] = [];
    let value = "",
      quoted = false,
      active = false;
    for (let i = 0; i < line.length; i++) {
      const c = line[i]!;
      if (c === '"') {
        quoted = !quoted;
        active = true;
      } else if (
        c === "\\" &&
        quoted &&
        ['"', "\\"].includes(line[i + 1] ?? "")
      ) {
        value += line[++i];
        active = true;
      } else if (/\s/.test(c) && !quoted) {
        if (active) {
          result.push(value);
          value = "";
          active = false;
        }
      } else {
        value += c;
        active = true;
      }
    }
    if (quoted) throw new Error("unterminated double quote");
    if (active) result.push(value);
    return result;
  }
}

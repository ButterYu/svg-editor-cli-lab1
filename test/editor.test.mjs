import { test } from "node:test";
import assert from "node:assert/strict";
import { Editor } from "../dist/cli/Editor.js";
import { SvgCodec } from "../dist/infrastructure/SvgCodec.js";
class MemoryFiles {
  files = new Map();
  failWrite = false;
  read(path) {
    if (!this.files.has(path)) throw new Error(`cannot read file: ${path}`);
    return this.files.get(path);
  }
  write(path, content) {
    if (this.failWrite) throw new Error(`cannot write file: ${path}`);
    this.files.set(path, content);
  }
}
const setup = () => {
  const files = new MemoryFiles();
  return { files, e: new Editor(files, new SvgCodec()) };
};
const ok = (e, line) => {
  const result = e.execute(line);
  assert.ok(!result.startsWith("error:"), `${line}: ${result}`);
  return result;
};
test("all six shapes, quote parsing, comments, exact errors and case-sensitive ids", () => {
  const { e } = setup();
  assert.equal(
    e.execute("tree"),
    "error: no document. use 'init' or 'read' first",
  );
  ok(e, "help");
  ok(e, "init");
  assert.equal(e.execute("# comment"), "");
  for (const command of [
    "create rect R 1 2 3 4",
    "create circle r 1 2 3 red",
    "create ellipse e 1 2 3 4",
    "create line l 1 2 3 4 black",
    'create text t 1 2 "你好 world"',
    "create g g",
  ])
    ok(e, command);
  assert.match(ok(e, "tree"), /你好 world/);
  assert.match(ok(e, "show R"), /parent=svg/);
  assert.equal(
    e.execute("create rect R 0 0 1 1"),
    "error: id already exists: R",
  );
  assert.equal(
    e.execute('create box n 0 0 1 1 "x"'),
    "error: unknown shape type: box (is the plugin loaded?)",
  );
  assert.equal(
    e.execute("set R opacity 1"),
    "error: unknown attribute: opacity",
  );
  assert.match(e.execute('set t text "bad'), /^error: unterminated/);
});
test("recursive move and scale, every shape geometry, styles and text whitelist", () => {
  const { e } = setup();
  ok(e, "init");
  ok(e, "create g outer");
  ok(e, "create g inner in outer");
  for (const cmd of [
    "create rect r 1 2 3 4 in inner",
    "create circle c 1 2 3 in inner",
    "create ellipse e 1 2 3 4 in inner",
    "create line l 1 2 3 4 in inner",
    'create text t 1 2 "x" in inner',
  ])
    ok(e, cmd);
  ok(e, "move outer 10 20");
  ok(e, "scale outer 2");
  assert.match(ok(e, "show r"), /x="22"/);
  assert.match(ok(e, "show r"), /width="6"/);
  assert.match(ok(e, "show c"), /r="6"/);
  assert.match(ok(e, "show e"), /ry="8"/);
  assert.match(ok(e, "show l"), /x2="26"/);
  assert.match(ok(e, "show t"), /y="44"/);
  ok(e, "set outer fill blue");
  ok(e, "set r stroke-width 2.5");
  ok(e, 'set t text ""');
  assert.equal(
    e.execute("scale outer 0"),
    "error: scale factor must be positive",
  );
});
test("commands are atomic and failed edit preserves redo", () => {
  const { e } = setup();
  ok(e, "init");
  ok(e, "create rect r 1 2 3 4");
  const initial = ok(e, "tree");
  ok(e, "move r 10 0");
  ok(e, "undo");
  assert.equal(ok(e, "tree"), initial);
  for (const cmd of [
    "scale r -1",
    "move r NaN 0",
    "set r width -1",
    "create circle bad 1 2 -3",
    "create rect a 0 0 1 1 in missing",
    "create rect a 0 0 1 1 in r",
  ])
    assert.match(e.execute(cmd), /^error:/);
  assert.equal(ok(e, "tree"), initial);
  ok(e, "redo");
  assert.match(ok(e, "show r"), /x="11"/);
  ok(e, "undo");
  ok(e, "set r fill red");
  assert.equal(e.execute("redo"), "error: nothing to redo");
});
test("group order, cross-parent collection, cycles, nested ungroup and subtree delete", () => {
  const { e } = setup();
  ok(e, "init");
  ok(e, "create g outer");
  ok(e, "create rect a 0 0 1 1 in outer");
  ok(e, "create circle b 0 0 1");
  ok(e, "group inner b a");
  let tree = ok(e, "tree");
  assert.ok(tree.indexOf("rect#a") < tree.indexOf("circle#b"));
  assert.match(ok(e, "show inner"), /parent=g#outer/);
  const before = tree;
  assert.equal(
    e.execute("group bad a inner"),
    "error: cannot group a container into its own descendant: inner",
  );
  assert.equal(
    e.execute("addto inner outer"),
    "error: cannot group a container into its own descendant: outer",
  );
  assert.equal(ok(e, "tree"), before);
  ok(e, "ungroup inner");
  assert.match(ok(e, "show a"), /parent=g#outer/);
  ok(e, "undo");
  assert.equal(ok(e, "tree"), before);
  ok(e, "delete inner");
  assert.match(e.execute("show a"), /^error:/);
  ok(e, "undo");
  assert.equal(ok(e, "tree"), before);
  assert.equal(
    e.execute("ungroup outer"),
    "error: cannot ungroup top-level container: outer",
  );
  ok(e, "addto outer b");
  assert.match(ok(e, "show b"), /parent=g#outer/);
});
test("front is last SVG sibling, back is first; undo restores order", () => {
  const { e } = setup();
  ok(e, "init");
  ok(e, "create g scene");
  for (const id of ["a", "b", "c"]) ok(e, `create circle ${id} 0 0 1 in scene`);
  const before = ok(e, "tree");
  ok(e, "front a");
  let t = ok(e, "tree");
  assert.ok(t.indexOf("circle#c") < t.indexOf("circle#a"));
  ok(e, "undo");
  assert.equal(ok(e, "tree"), before);
  ok(e, "back c");
  t = ok(e, "tree");
  assert.ok(t.indexOf("circle#c") < t.indexOf("circle#a"));
});
test("IO barriers, display does not enter history, failed IO preserves state/history", () => {
  const { e, files } = setup();
  ok(e, "init");
  ok(e, "create circle c 1 2 3");
  ok(e, "save a.svg");
  assert.equal(e.execute("undo"), "error: undo not allowed after io command");
  ok(e, "move c 1 0");
  for (const cmd of ["tree", "show c", "help", "canvas"]) ok(e, cmd);
  ok(e, "undo");
  ok(e, "redo");
  const before = ok(e, "tree");
  files.failWrite = true;
  assert.equal(e.execute("save bad.svg"), "error: cannot write file: bad.svg");
  assert.equal(
    e.execute("read missing.svg"),
    "error: cannot read file: missing.svg",
  );
  assert.equal(ok(e, "tree"), before);
  ok(e, "undo");
  ok(e, "canvas 400 300");
  assert.equal(e.execute("redo"), "error: undo not allowed after io command");
  ok(e, "read a.svg");
  assert.equal(e.execute("undo"), "error: undo not allowed after io command");
  files.failWrite = false;
  ok(e, "save");
  ok(e, "init");
  assert.match(e.execute("save"), /^error: no file path/);
});
test("SVG round trip escapes text and styles, omissions retain default appearance", () => {
  const { e, files } = setup();
  ok(e, "init 300 200");
  ok(e, "create g scene");
  ok(e, 'create text t 1 2 "A & <B>" in scene');
  ok(e, "create rect r 1 2 3 4 in scene");
  const before = ok(e, "tree");
  ok(e, "save a.svg");
  assert.match(files.files.get("a.svg"), /A &amp; &lt;B&gt;/);
  assert.doesNotMatch(files.files.get("a.svg"), /fill=/);
  ok(e, "read a.svg");
  assert.equal(ok(e, "tree"), before);
});
test("import assigns collision-free ids with warnings, rejects duplicates and malformed SVG atomically", () => {
  const { e, files } = setup();
  ok(e, "init");
  files.files.set(
    "in.svg",
    '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect x="0"/><rect id="rect1"/><g><circle r="2"/></g></svg>',
  );
  const out = ok(e, "read in.svg");
  assert.match(out, /warning: assigned id rect2 to unnamed <rect>/);
  assert.match(out, /warning: assigned id g1/);
  const before = ok(e, "tree");
  for (const xml of [
    '<svg><rect id="x"/><circle id="x"/></svg>',
    "<svg><rect></svg>",
    "<!DOCTYPE svg><svg/>",
    "<html/>",
    "<svg><path/></svg>",
  ]) {
    files.files.set("bad.svg", xml);
    assert.match(e.execute("read bad.svg"), /^error:/);
    assert.equal(ok(e, "tree"), before);
  }
});

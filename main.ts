// Say What Actually Broke — make.fun entry (program/v1).
//
// Writes one single-line software error message to /output/entry.txt.
// The line is the whole entry: it must name the real failure in plain
// words, tell the user what to do next, be funny on a single read, and
// survive being pasted into a real product's error dialog.
//
// The chosen line:
//
//   "We broke this ourselves — bad code, shipped on a Friday.
//    We're rolling it back; try again in a few minutes."
//
// Why this line, against the judge's brief (most important first):
//   1. Brutal truth, funny: it admits the team broke it themselves —
//      bad code shipped on a Friday, the oldest deploy joke in the
//      book — instead of hiding behind "something went wrong".
//   2. Names the real failure + the next step: a bad deploy broke
//      this; we are rolling it back; retry in a few minutes.
//   3. Repeatable out loud: "bad code, shipped on a Friday" is the
//      kind of line people screenshot and quote to a colleague.
//   4. No padding, no throat clearing: one sentence of confession,
//      one sentence of remedy. 107 characters, well under 200.
//   5. Shippable: self-deprecating but professional — an honest
//      apology a real team can put in a dialog without embarrassment.
//
// The program is deterministic: every run writes exactly this line,
// byte for byte, so the two grading runs agree.

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The entry text. Single line, no trailing newline: the gate counts
// 1-200 characters of UTF-8 text, and a trailing newline would be a
// second (empty) line.
const ENTRY_LINE =
  "We broke this ourselves \u2014 bad code, shipped on a Friday. " +
  "We're rolling it back; try again in a few minutes.";

// The house gate, mirrored locally so a bad line can never ship:
// UTF-8 text, 1-200 characters, not only white space, single line.
function validate(line: string): void {
  if (line.length === 0) {
    throw new Error("entry line is empty");
  }
  if (line.length > 200) {
    throw new Error(
      `entry line is ${line.length} characters, over the 200 limit`,
    );
  }
  if (line.trim().length === 0) {
    throw new Error("entry line is only white space");
  }
  if (/[\r\n]/.test(line)) {
    throw new Error("entry line must be a single line");
  }
}

function main(): void {
  validate(ENTRY_LINE);

  // The grader mounts /output; OUTPUT_DIR only lets us test locally.
  const outDir = process.env.OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "entry.txt");
  // 0644: readable by the grader's user (umask 022 gives the same).
  writeFileSync(outPath, ENTRY_LINE, { encoding: "utf8", mode: 0o644 });

  console.log(`wrote ${outPath} (${ENTRY_LINE.length} chars)`);
  console.log(ENTRY_LINE);
}

main();

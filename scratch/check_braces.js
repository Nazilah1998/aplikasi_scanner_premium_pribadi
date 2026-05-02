import fs from "fs";

const content = fs.readFileSync(
  "e:/CODING/doc_scanner_final/app/scan.tsx",
  "utf8",
);

let braceLevel = 0;
let parenLevel = 0;
let bracketLevel = 0;

for (let i = 0; i < content.length; i++) {
  const char = content[i];
  if (char === "{") braceLevel++;
  else if (char === "}") braceLevel--;
  else if (char === "(") parenLevel++;
  else if (char === ")") parenLevel--;
  else if (char === "[") bracketLevel++;
  else if (char === "]") bracketLevel--;

  if (braceLevel < 0 || parenLevel < 0 || bracketLevel < 0) {
    console.log(`Mismatch at index ${i} (char: ${char})`);
    // print snippet
    console.log(
      content.substring(Math.max(0, i - 20), Math.min(content.length, i + 20)),
    );
    process.exit(1);
  }
}

console.log(
  `Final levels: Brace: ${braceLevel}, Paren: ${parenLevel}, Bracket: ${bracketLevel}`,
);

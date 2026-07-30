import assert from 'node:assert/strict';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';
import ts from 'typescript';

const TEMPLATE_ROOT = join(process.cwd(), 'src', 'templates');
const CARD_ROLE_PATTERN = /--token-card-(?:bg|heading|body|muted|border)/;

function templateFiles(directory: string): string[] {
  return readdirSync(directory).flatMap((name) => {
    const path = join(directory, name);
    return statSync(path).isDirectory()
      ? templateFiles(path)
      : path.endsWith('.tsx') ? [path] : [];
  });
}

test('editable visual card surfaces declare the semantic data-card marker', () => {
  const missing: string[] = [];

  for (const file of templateFiles(TEMPLATE_ROOT)) {
    const source = readFileSync(file, 'utf8');
    const sourceFile = ts.createSourceFile(
      file,
      source,
      ts.ScriptTarget.Latest,
      true,
      ts.ScriptKind.TSX,
    );

    function inspect(node: ts.Node) {
      if (ts.isJsxElement(node) || ts.isJsxSelfClosingElement(node)) {
        const opening = ts.isJsxElement(node) ? node.openingElement : node;
        const attributes = new Set(
          opening.attributes.properties
            .filter(ts.isJsxAttribute)
            .map((attribute) => attribute.name.getText(sourceFile)),
        );
        const openingSource = opening.getText(sourceFile);
        const ownsEditableCollection = attributes.has('data-edit-collection');
        const consumesCardRoles = CARD_ROLE_PATTERN.test(openingSource);
        const explicitlyClassified = attributes.has('data-card') || attributes.has('data-card-scope');

        if (ownsEditableCollection && consumesCardRoles && !explicitlyClassified) {
          const position = sourceFile.getLineAndCharacterOfPosition(opening.getStart(sourceFile));
          missing.push(`${file}:${position.line + 1}`);
        }
      }
      ts.forEachChild(node, inspect);
    }

    inspect(sourceFile);
  }

  assert.deepEqual(
    missing,
    [],
    `Editable surfaces consuming card roles must declare data-card or an explicit data-card-scope:\n${missing.join('\n')}`,
  );
});

// Python Code AST Symbol Extractor & Parser

export interface ParsedSymbol {
  name: string;
  type: 'function' | 'class' | 'variable';
  signature?: string;
  docstring?: string;
  line?: number;
}

export function parsePythonSymbols(code: string): ParsedSymbol[] {
  if (!code || code.trim().length === 0) return [];

  const symbols: ParsedSymbol[] = [];
  const lines = code.split('\n');

  // Match function definitions: def func_name(arg1, arg2):
  const funcRegex = /^\s*def\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\((.*?)\)\s*(?:->\s*([^:]+))?:/ ;
  // Match class definitions: class ClassName(Base):
  const classRegex = /^\s*class\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*(?:\((.*?)\))?:/ ;
  // Match top-level variable assignments: VAR_NAME = ...
  const varRegex = /^([a-zA-Z_][a-zA-Z0-9_]*)\s*=(?!=)/ ;

  for (let idx = 0; idx < lines.length; idx++) {
    const line = lines[idx];
    const lineNo = idx + 1;

    // Check function
    const funcMatch = line.match(funcRegex);
    if (funcMatch) {
      const name = funcMatch[1];
      const params = funcMatch[2] || '';
      const returnType = funcMatch[3] ? ` -> ${funcMatch[3].trim()}` : '';
      const signature = `def ${name}(${params})${returnType}`;

      let docstring = '';
      if (idx + 1 < lines.length && lines[idx + 1].trim().startsWith('"""')) {
        docstring = lines[idx + 1].trim().replace(/"""/g, '');
      }

      symbols.push({
        name,
        type: 'function',
        signature,
        docstring,
        line: lineNo,
      });
      continue;
    }

    // Check class
    const classMatch = line.match(classRegex);
    if (classMatch) {
      const name = classMatch[1];
      const inheritance = classMatch[2] ? `(${classMatch[2]})` : '';
      const signature = `class ${name}${inheritance}`;

      let docstring = '';
      if (idx + 1 < lines.length && lines[idx + 1].trim().startsWith('"""')) {
        docstring = lines[idx + 1].trim().replace(/"""/g, '');
      }

      symbols.push({
        name,
        type: 'class',
        signature,
        docstring,
        line: lineNo,
      });
      continue;
    }

    // Check top-level variable
    const varMatch = line.match(varRegex);
    if (varMatch) {
      const name = varMatch[1];
      if (!['if', 'while', 'for', 'with', 'return', 'def', 'class', 'import', 'from', 'raise'].includes(name)) {
        symbols.push({
          name,
          type: 'variable',
          signature: `${name} = ...`,
          line: lineNo,
        });
      }
    }
  }

  return symbols;
}

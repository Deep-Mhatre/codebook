// AST Variable Dependency Analyzer & DAG Construction for CodeBook

export interface BlockCodeNode {
  id: string;
  code: string;
}

export interface BlockDependencyNode {
  id: string;
  definedVars: string[];
  referencedVars: string[];
  dependsOnBlockIds: string[];
  dependentBlockIds: string[];
}

export interface PageDAGAnalysis {
  nodes: Map<string, BlockDependencyNode>;
  staleBlockIds: Set<string>;
}

// Extract assigned variable names (e.g., x = 10, df, func_name, ClassName)
function extractDefinedVariables(code: string): string[] {
  if (!code) return [];
  const defined = new Set<string>();

  // Match variable assignments: var_name = ...
  const assignRegex = /(?:^|\n)\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*=(?!=)/g;
  let match;
  while ((match = assignRegex.exec(code)) !== null) {
    const varName = match[1];
    if (!['if', 'while', 'for', 'with', 'return', 'def', 'class', 'import', 'from', 'raise'].includes(varName)) {
      defined.add(varName);
    }
  }

  // Match function definitions: def func_name(...):
  const defRegex = /(?:^|\n)\s*def\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/g;
  while ((match = defRegex.exec(code)) !== null) {
    defined.add(match[1]);
  }

  // Match class definitions: class ClassName:
  const classRegex = /(?:^|\n)\s*class\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*[:\(]/g;
  while ((match = classRegex.exec(code)) !== null) {
    defined.add(match[1]);
  }

  return Array.from(defined);
}

// Extract referenced variable names used in code
function extractReferencedVariables(code: string, definedInBlock: Set<string>): string[] {
  if (!code) return [];
  const referenced = new Set<string>();

  // Match identifiers
  const identRegex = /\b([a-zA-Z_][a-zA-Z0-9_]*)\b/g;
  const keywords = new Set([
    'and', 'as', 'assert', 'async', 'await', 'break', 'class', 'continue', 'def',
    'del', 'elif', 'else', 'except', 'False', 'finally', 'for', 'from', 'global',
    'if', 'import', 'in', 'is', 'lambda', 'None', 'nonlocal', 'not', 'or', 'pass',
    'raise', 'return', 'True', 'try', 'while', 'with', 'yield', 'print', 'len', 'range',
    'int', 'str', 'float', 'list', 'dict', 'set', 'tuple', 'type', 'open', 'sum', 'min', 'max'
  ]);

  let match;
  while ((match = identRegex.exec(code)) !== null) {
    const name = match[1];
    if (!keywords.has(name) && !definedInBlock.has(name)) {
      referenced.add(name);
    }
  }

  return Array.from(referenced);
}

export function buildPageDAG(blocks: BlockCodeNode[]): Map<string, BlockDependencyNode> {
  const nodes = new Map<string, BlockDependencyNode>();

  const blockData = blocks.map((b) => {
    const definedVars = extractDefinedVariables(b.code);
    const definedSet = new Set(definedVars);
    const referencedVars = extractReferencedVariables(b.code, definedSet);
    return {
      id: b.id,
      definedVars,
      referencedVars,
      dependsOnBlockIds: [] as string[],
      dependentBlockIds: [] as string[],
    };
  });

  // Wire dependencies across blocks sequentially
  for (let i = 0; i < blockData.length; i++) {
    const current = blockData[i];

    for (let j = 0; j < i; j++) {
      const earlier = blockData[j];
      const hasDependency = current.referencedVars.some((ref) => earlier.definedVars.includes(ref));

      if (hasDependency) {
        current.dependsOnBlockIds.push(earlier.id);
        earlier.dependentBlockIds.push(current.id);
      }
    }
  }

  for (const b of blockData) {
    nodes.set(b.id, b);
  }

  return nodes;
}

export function getStaleBlockIds(
  modifiedBlockId: string,
  dagNodes: Map<string, BlockDependencyNode>
): Set<string> {
  const stale = new Set<string>();
  const queue = [modifiedBlockId];

  while (queue.length > 0) {
    const currId = queue.shift()!;
    const node = dagNodes.get(currId);

    if (node) {
      for (const depId of node.dependentBlockIds) {
        if (!stale.has(depId)) {
          stale.add(depId);
          queue.push(depId);
        }
      }
    }
  }

  return stale;
}

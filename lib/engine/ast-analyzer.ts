// AST Code Import & Complexity Analyzer for Dual-Engine Execution Routing

export type ExecutionEngineStrategy = 'LOCAL_WASM' | 'CLOUD_DOCKER';

export interface CodeAnalysisResult {
  strategy: ExecutionEngineStrategy;
  reason: string;
}

const CLOUD_ONLY_PATTERNS = [
  { pattern: /codebook\.(camera|microphone|vision|output\.plotly|output\.webgl|output\.html)/i, reason: 'Requires CodeBook hardware streams or server output renderer' },
  { pattern: /import\s+(cv2|mediapipe|torch|tensorflow|transformers|scipy|statsmodels|bs4|beautifulsoup4|lxml|openpyxl|xlsxwriter|httpx)/i, reason: 'Uses heavy C-extension or server-side library' },
  { pattern: /from\s+(cv2|mediapipe|torch|tensorflow|transformers|scipy|statsmodels|bs4|beautifulsoup4|lxml|openpyxl|xlsxwriter|httpx)/i, reason: 'Uses heavy C-extension or server-side library' },
  { pattern: /import\s+(requests|urllib|socket|subprocess|shutil|pathlib)/i, reason: 'Requires server network socket or filesystem access' },
  { pattern: /from\s+(requests|urllib|socket|subprocess|shutil|pathlib)/i, reason: 'Requires server network socket or filesystem access' },
];

export function stripPythonCommentsAndStrings(code: string): string {
  // Strip multiline docstrings ('''...''' and """...""")
  let cleaned = code.replace(/('''[\s\S]*?'''|"""[\s\S]*?""")/g, '');
  // Strip single-line comments (#...)
  cleaned = cleaned.replace(/#.*$/gm, '');
  return cleaned;
}

export function analyzeCodeExecutionStrategy(code: string): CodeAnalysisResult {
  if (!code || code.trim().length === 0) {
    return { strategy: 'LOCAL_WASM', reason: 'Empty snippet' };
  }

  const cleanedCode = stripPythonCommentsAndStrings(code);

  for (const { pattern, reason } of CLOUD_ONLY_PATTERNS) {
    if (pattern.test(cleanedCode)) {
      return {
        strategy: 'CLOUD_DOCKER',
        reason,
      };
    }
  }

  return {
    strategy: 'LOCAL_WASM',
    reason: 'Pure Python / NumPy / Pandas code suitable for in-browser Wasm execution',
  };
}

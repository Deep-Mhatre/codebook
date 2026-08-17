// Dual-Engine Code Execution Router (Pyodide Wasm + Docker Backend)

import { analyzeCodeExecutionStrategy, ExecutionEngineStrategy } from './ast-analyzer';
import { executeInWasm, WasmExecutionResult } from './wasm-runner';

export interface ExecutionRouterOptions {
  code: string;
  pageId?: string;
  onStrategySelected?: (strategy: ExecutionEngineStrategy, reason: string) => void;
  executeCloudDocker: () => Promise<void>;
}

export interface ExecutionRouterResult {
  handledLocally: boolean;
  result?: WasmExecutionResult;
  error?: string;
}

export async function routeAndExecuteCode(
  options: ExecutionRouterOptions
): Promise<ExecutionRouterResult> {
  const { code, onStrategySelected, executeCloudDocker } = options;

  const analysis = analyzeCodeExecutionStrategy(code);
  if (onStrategySelected) {
    onStrategySelected(analysis.strategy, analysis.reason);
  }

  if (analysis.strategy === 'LOCAL_WASM') {
    try {
      const wasmResult = await executeInWasm(code, 8000);
      return {
        handledLocally: true,
        result: wasmResult,
      };
    } catch (wasmErr: unknown) {
      console.warn('Wasm execution failed or timed out, falling back to Cloud Docker:', wasmErr);
    }
  }

  // Fallback / Route to Cloud Docker Execution
  await executeCloudDocker();
  return {
    handledLocally: false,
  };
}

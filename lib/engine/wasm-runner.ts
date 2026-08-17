// Client-side Pyodide Wasm Execution Runner

import { OutputItem } from '@/components/notebook/output/output-block';

export interface WasmExecutionResult {
  status: 'success' | 'error';
  executionTime: number;
  outputs: OutputItem[];
  engine: 'WASM_PYODIDE';
}

let workerInstance: Worker | null = null;
const pendingExecutions = new Map<string, { resolve: (res: WasmExecutionResult) => void; reject: (err: unknown) => void }>();

function getWorker(): Worker | null {
  if (typeof window === 'undefined') return null;

  if (!workerInstance) {
    try {
      workerInstance = new Worker('/pyodide/wasm-worker.js');

      workerInstance.onmessage = (event) => {
        const { type, id, success, error } = event.data;

        if (type === 'init_done') {
          if (!success) {
            console.warn('Pyodide Wasm worker initialization warning:', error);
          }
          return;
        }

        if (type === 'execution_result' && id) {
          const handler = pendingExecutions.get(id);
          if (handler) {
            pendingExecutions.delete(id);
            handler.resolve(event.data as WasmExecutionResult);
          }
        }
      };

      workerInstance.postMessage({ type: 'init' });
    } catch (err) {
      console.warn('Failed to spawn Pyodide worker:', err);
      return null;
    }
  }

  return workerInstance;
}

export async function executeInWasm(code: string, timeoutMs: number = 10000): Promise<WasmExecutionResult> {
  const worker = getWorker();
  if (!worker) {
    throw new Error('Pyodide Worker not supported in this environment');
  }

  const id = `exec_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      pendingExecutions.delete(id);
      reject(new Error(`Wasm Execution Timed Out after ${timeoutMs / 1000}s`));
    }, timeoutMs);

    pendingExecutions.set(id, {
      resolve: (res) => {
        clearTimeout(timer);
        resolve(res);
      },
      reject: (err) => {
        clearTimeout(timer);
        reject(err);
      },
    });

    worker.postMessage({ type: 'execute', code, id });
  });
}

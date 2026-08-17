// Pyodide WebWorker for client-side Python execution
importScripts('https://cdn.jsdelivr.net/pyodide/v0.26.1/full/pyodide.js');

let pyodideInstance = null;

async function initPyodide() {
  if (!pyodideInstance) {
    pyodideInstance = await loadPyodide({
      indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.26.1/full/',
    });
  }
  return pyodideInstance;
}

self.onmessage = async (event) => {
  const { type, code, id } = event.data;

  if (type === 'init') {
    try {
      await initPyodide();
      self.postMessage({ type: 'init_done', success: true });
    } catch (err) {
      self.postMessage({ type: 'init_done', success: false, error: err.message });
    }
    return;
  }

  if (type === 'execute') {
    const startTime = performance.now();
    let stdoutBuffer = [];
    let stderrBuffer = [];

    try {
      const pyodide = await initPyodide();

      // Redirect stdout & stderr
      pyodide.setStdout({
        batched: (text) => stdoutBuffer.push(text),
      });
      pyodide.setStderr({
        batched: (text) => stderrBuffer.push(text),
      });

      // Load packages if numpy/pandas used
      if (code.includes('import numpy') || code.includes('from numpy')) {
        await pyodide.loadPackage('numpy');
      }
      if (code.includes('import pandas') || code.includes('from pandas')) {
        await pyodide.loadPackage('pandas');
      }

      await pyodide.runPythonAsync(code);

      const executionTime = Number(((performance.now() - startTime) / 1000).toFixed(3));
      const outputs = [];

      const stdoutText = stdoutBuffer.join('\n').trim();
      const stderrText = stderrBuffer.join('\n').trim();

      if (stdoutText) {
        outputs.push({ type: 'text', content: stdoutText });
      }
      if (stderrText) {
        outputs.push({ type: 'text', content: stderrText });
      }
      if (!stdoutText && !stderrText) {
        outputs.push({ type: 'text', content: 'Code executed successfully (no stdout).' });
      }

      self.postMessage({
        type: 'execution_result',
        id,
        status: 'success',
        executionTime,
        outputs,
        engine: 'WASM_PYODIDE',
      });
    } catch (err) {
      const executionTime = Number(((performance.now() - startTime) / 1000).toFixed(3));
      self.postMessage({
        type: 'execution_result',
        id,
        status: 'error',
        executionTime,
        outputs: [{ type: 'error', content: err.message || String(err) }],
        engine: 'WASM_PYODIDE',
      });
    }
  }
};

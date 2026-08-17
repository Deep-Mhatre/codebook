// Bi-Directional Jupyter (.ipynb) Converter Engine for CodeBook

import { BlockItem } from '@/components/notebook/block-editor';
import { OutputItem } from '@/components/notebook/output/output-block';

export interface IpynbCell {
  cell_type: 'code' | 'markdown';
  metadata: Record<string, unknown>;
  source: string | string[];
  outputs?: Record<string, unknown>[];
  execution_count?: number | null;
}

export interface IpynbNotebook {
  nbformat: number;
  nbformat_minor: number;
  metadata: {
    language_info?: { name: string; version?: string };
    kernelspec?: { name: string; display_name: string };
  };
  cells: IpynbCell[];
}

export interface ImportedNotebookResult {
  title: string;
  blocks: BlockItem[];
}

export function parseIpynbToCodeBook(ipynbContent: string, fallbackTitle: string = 'Imported Notebook'): ImportedNotebookResult {
  try {
    const data: IpynbNotebook = JSON.parse(ipynbContent);
    const blocks: BlockItem[] = [];

    const cells = data.cells || [];

    cells.forEach((cell, idx) => {
      const sourceStr = Array.isArray(cell.source) ? cell.source.join('') : cell.source || '';
      const blockId = `imported_block_${Date.now()}_${idx}`;

      if (cell.cell_type === 'markdown') {
        const lines = sourceStr.trim().split('\n');
        const firstLine = lines[0] || '';

        if (firstLine.startsWith('#')) {
          const headingText = firstLine.replace(/^#+\s*/, '');
          blocks.push({
            id: blockId,
            type: 'heading',
            content: headingText,
          });

          const remainingText = lines.slice(1).join('\n').trim();
          if (remainingText) {
            blocks.push({
              id: `${blockId}_text`,
              type: 'text',
              content: remainingText,
            });
          }
        } else {
          blocks.push({
            id: blockId,
            type: 'text',
            content: sourceStr,
          });
        }
      } else if (cell.cell_type === 'code') {
        const outputs: OutputItem[] = [];

        if (cell.outputs && Array.isArray(cell.outputs)) {
          cell.outputs.forEach((out) => {
            const outputType = out.output_type as string;
            if (outputType === 'stream') {
              const text = Array.isArray(out.text) ? out.text.join('') : (out.text as string) || '';
              outputs.push({ type: 'text', content: text });
            } else if (outputType === 'execute_result' || outputType === 'display_data') {
              const dataObj = (out.data as Record<string, unknown>) || {};
              if (dataObj['image/png']) {
                const b64 = Array.isArray(dataObj['image/png']) ? (dataObj['image/png'] as string[]).join('') : (dataObj['image/png'] as string);
                outputs.push({ type: 'image', imageUrl: `data:image/png;base64,${b64}` });
              } else if (dataObj['text/plain']) {
                const text = Array.isArray(dataObj['text/plain']) ? (dataObj['text/plain'] as string[]).join('') : (dataObj['text/plain'] as string);
                outputs.push({ type: 'text', content: text });
              }
            } else if (outputType === 'error') {
              const traceback = Array.isArray(out.traceback) ? (out.traceback as string[]).join('\n') : (out.ename as string) || 'Execution Error';
              outputs.push({ type: 'error', content: traceback });
            }
          });
        }

        blocks.push({
          id: blockId,
          type: 'code',
          content: sourceStr,
          language: 'python',
          executionStatus: outputs.length > 0 ? 'success' : 'idle',
          outputs,
        });
      }
    });

    return {
      title: fallbackTitle,
      blocks: blocks.length > 0 ? blocks : [{ id: 'block-default', type: 'text', content: 'Empty notebook' }],
    };
  } catch (err) {
    throw new Error(`Failed to parse .ipynb file: ${(err as Error).message}`);
  }
}

export function exportCodeBookToIpynb(title: string, blocks: BlockItem[]): string {
  const cells: IpynbCell[] = [];

  // Add Notebook Title as top Markdown Cell
  if (title) {
    cells.push({
      cell_type: 'markdown',
      metadata: {},
      source: [`# ${title}\n`],
    });
  }

  blocks.forEach((block) => {
    if (block.type === 'heading') {
      cells.push({
        cell_type: 'markdown',
        metadata: {},
        source: [`## ${block.content}\n`],
      });
    } else if (block.type === 'text') {
      cells.push({
        cell_type: 'markdown',
        metadata: {},
        source: [block.content],
      });
    } else if (block.type === 'code') {
      const cellOutputs: Record<string, unknown>[] = [];

      if (block.outputs && block.outputs.length > 0) {
        block.outputs.forEach((out) => {
          if (out.type === 'text') {
            cellOutputs.push({
              output_type: 'stream',
              name: 'stdout',
              text: out.content ? out.content.split('\n').map((l) => l + '\n') : [''],
            });
          } else if (out.type === 'error') {
            cellOutputs.push({
              output_type: 'error',
              ename: 'ExecutionError',
              evalue: out.content || '',
              traceback: out.content ? out.content.split('\n') : [],
            });
          } else if (out.type === 'image' && out.imageUrl) {
            const base64Data = out.imageUrl.replace(/^data:image\/png;base64,/, '');
            cellOutputs.push({
              output_type: 'display_data',
              data: {
                'image/png': base64Data,
              },
              metadata: {},
            });
          }
        });
      }

      cells.push({
        cell_type: 'code',
        metadata: {},
        source: block.content ? block.content.split('\n').map((line, idx, arr) => (idx === arr.length - 1 ? line : line + '\n')) : [''],
        execution_count: 1,
        outputs: cellOutputs,
      });
    }
  });

  const notebook: IpynbNotebook = {
    nbformat: 4,
    nbformat_minor: 5,
    metadata: {
      language_info: { name: 'python', version: '3.11' },
      kernelspec: { name: 'python3', display_name: 'Python 3' },
    },
    cells,
  };

  return JSON.stringify(notebook, null, 2);
}

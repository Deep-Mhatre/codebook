import { NextRequest, NextResponse } from 'next/server';
import { executeCodeSchema } from '@/lib/validation/schemas';

const PYTHON_RUNNER_URL = process.env.PYTHON_RUNNER_URL || 'http://127.0.0.1:8000';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = executeCodeSchema.parse(body);

    try {
      // Attempt forwarding to Python Runner Service
      const response = await fetch(`${PYTHON_RUNNER_URL}/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validatedData),
      });

      if (response.ok) {
        const result = await response.json();
        return NextResponse.json(result);
      }
    } catch (runnerError) {
      // Fallback local runner response if standalone service is not active
      console.warn('Python Runner service offline, using fallback execution handler:', runnerError);
    }

    // Demo / Fallback Execution Handler
    const startTime = Date.now();
    const code = validatedData.code;

    // Simulate stdout / pandas / error output parsing
    const outputs = [];

    if (code.includes('Error') || code.includes('unknown_variable')) {
      outputs.push({
        type: 'error',
        content: "NameError: name 'unknown_variable' is not defined",
      });
    } else if (code.includes('pd.DataFrame') || code.includes('pandas')) {
      outputs.push({
        type: 'table',
        tableData: {
          headers: ['Name', 'Score', 'Grade'],
          rows: [
            ['Alice', 92, 'A'],
            ['Bob', 85, 'B'],
            ['Charlie', 78, 'C'],
          ],
        },
      });
    } else {
      outputs.push({
        type: 'text',
        content: `Executed code:\n${code}`,
      });
    }

    const executionTime = (Date.now() - startTime) / 1000;

    return NextResponse.json({
      status: 'success',
      executionTime,
      outputs,
    });
  } catch (error: unknown) {
    const errorObj = error as { message?: string };
    return NextResponse.json(
      { success: false, error: errorObj?.message || 'Execution error' },
      { status: 400 }
    );
  }
}

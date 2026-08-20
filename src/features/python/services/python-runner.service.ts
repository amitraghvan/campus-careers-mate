/**
 * Python Runner Service
 * Executes Python 3 code in-browser with standard output & error capturing,
 * Skulpt standard runtime (including math, random, sys, time, string),
 * and an offline-resilient JavaScript fallback engine for Unit I & Unit II.
 */

export interface ExecutionResult {
    success: boolean;
    output: string;
    error?: string;
    executionTimeMs: number;
}

export interface TestResult {
    testCaseIndex: number;
    description: string;
    passed: boolean;
    expected: string;
    actual: string;
    input?: string;
    error?: string;
}

export interface SuiteResult {
    allPassed: boolean;
    passCount: number;
    totalCount: number;
    testResults: TestResult[];
    rawOutput: string;
    executionTimeMs: number;
}

declare global {
    interface Window {
        Sk?: any;
    }
}

class PythonRunnerService {
    private skulptLoaded: boolean = false;
    private skulptLoading: Promise<boolean> | null = null;

    /**
     * Checks if Skulpt core and standard library are completely initialized.
     */
    private isSkulptReady(): boolean {
        return !!(
            typeof window !== 'undefined' &&
            window.Sk &&
            window.Sk.importMainWithBody &&
            window.Sk.builtinFiles &&
            window.Sk.builtinFiles['files']
        );
    }

    /**
     * Dynamically loads Skulpt interpreter and standard library sequentially.
     */
    public async loadSkulpt(): Promise<boolean> {
        if (typeof window === 'undefined') return false;
        if (this.isSkulptReady()) {
            this.skulptLoaded = true;
            return true;
        }
        if (this.skulptLoading) return this.skulptLoading;

        this.skulptLoading = new Promise<boolean>((resolve) => {
            if (this.isSkulptReady()) {
                this.skulptLoaded = true;
                resolve(true);
                return;
            }

            const loadStdLib = () => {
                if (this.isSkulptReady()) {
                    this.skulptLoaded = true;
                    resolve(true);
                    return;
                }
                const script2 = document.createElement('script');
                script2.src = 'https://cdn.jsdelivr.net/npm/skulpt@1.2.0/dist/skulpt-stdlib.js';
                script2.async = true;
                script2.onload = () => {
                    const ready = this.isSkulptReady();
                    this.skulptLoaded = ready;
                    resolve(ready);
                };
                script2.onerror = () => resolve(false);
                document.head.appendChild(script2);
            };

            if (window.Sk) {
                loadStdLib();
            } else {
                const script1 = document.createElement('script');
                script1.src = 'https://cdn.jsdelivr.net/npm/skulpt@1.2.0/dist/skulpt.min.js';
                script1.async = true;
                script1.onload = () => {
                    loadStdLib();
                };
                script1.onerror = () => resolve(false);
                document.head.appendChild(script1);
            }

            // Fallback timeout after 3s
            setTimeout(() => {
                const ready = this.isSkulptReady();
                this.skulptLoaded = ready;
                resolve(ready);
            }, 3000);
        });

        return this.skulptLoading;
    }

    /**
     * Executes Python code with given optional input buffer.
     */
    public async runCode(code: string, inputData: string = ''): Promise<ExecutionResult> {
        const startTime = performance.now();

        // Ensure Skulpt is loaded
        const skulptReady = await this.loadSkulpt();

        if (skulptReady && this.isSkulptReady()) {
            try {
                return await this.runWithSkulpt(code, inputData, startTime);
            } catch (err: any) {
                // If Skulpt unexpected internal crash, gracefully fallback
                return this.runWithFallbackInterpreter(code, inputData, startTime);
            }
        } else {
            return this.runWithFallbackInterpreter(code, inputData, startTime);
        }
    }

    /**
     * Runs python code using Skulpt engine.
     */
    private async runWithSkulpt(code: string, inputData: string, startTime: number): Promise<ExecutionResult> {
        let outputBuffer = '';
        const inputLines = inputData ? inputData.split('\n') : [];
        let inputIndex = 0;

        function builtinRead(x: string) {
            if (
                window.Sk.builtinFiles === undefined ||
                window.Sk.builtinFiles['files'] === undefined ||
                window.Sk.builtinFiles['files'][x] === undefined
            ) {
                throw "File not found: '" + x + "'";
            }
            return window.Sk.builtinFiles['files'][x];
        }

        try {
            window.Sk.configure({
                output: (text: string) => {
                    outputBuffer += text;
                },
                read: builtinRead,
                inputfun: () => {
                    if (inputIndex < inputLines.length) {
                        return inputLines[inputIndex++];
                    }
                    return '';
                },
                inputfunTakesPrompt: false,
                python3: true,
                __future__: window.Sk.python3,
            });

            await window.Sk.misceval.asyncToPromise(() =>
                window.Sk.importMainWithBody('<stdin>', false, code, true)
            );

            const endTime = performance.now();
            return {
                success: true,
                output: outputBuffer,
                executionTimeMs: Math.round(endTime - startTime),
            };
        } catch (err: any) {
            const endTime = performance.now();
            let errorMessage = '';

            if (err && err.tp$name) {
                const type = err.tp$name;
                const detail = err.args && err.args.v && err.args.v[0] ? err.args.v[0].v : err.toString();
                const line = err.traceback && err.traceback[0] ? ` on line ${err.traceback[0].lineno}` : '';
                errorMessage = `${type}: ${detail}${line}`;
            } else if (typeof err === 'string') {
                errorMessage = err;
            } else if (err && err.message) {
                errorMessage = err.message;
            } else {
                errorMessage = String(err);
            }

            return {
                success: false,
                output: outputBuffer,
                error: errorMessage,
                executionTimeMs: Math.round(endTime - startTime),
            };
        }
    }

    /**
     * Resilient Fallback Interpreter for Unit I & Unit II Python:
     * Supports:
     * - `print(...)` with formatting, expressions, and string repetitions
     * - Variable assignments, multiple assignments, augmented assignments (`+=`, `-=`, `*=`, `/=`, `%=`)
     * - Standard arithmetic, floor division `//`, exponentiation `**`, and modulo `%`
     * - Boolean comparisons (`==`, `!=`, `<`, `<=`, `>`, `>=`), `and`, `or`, `not`
     * - `import random` with `random.randint`, `random.choice`, `random.random`, `random.randrange`, `random.seed`
     * - `for var in range(...)` loops, `for var in list` loops
     * - `while condition` loops
     * - `if / elif / else` conditional branching
     * - Standard library helper mock implementations
     */
    private runWithFallbackInterpreter(code: string, inputData: string, startTime: number): ExecutionResult {
        let outputBuffer = '';
        const lines = code.split('\n');
        const variables: Record<string, any> = {};

        // Provide random module functions
        const randomState = {
            seedVal: 0,
            randint: (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min,
            choice: (seq: any[]) => (Array.isArray(seq) && seq.length > 0 ? seq[Math.floor(Math.random() * seq.length)] : null),
            random: () => Math.random(),
            randrange: (start: number, stop?: number, step: number = 1) => {
                if (stop === undefined) {
                    return Math.floor(Math.random() * start);
                }
                const count = Math.floor((stop - start) / step);
                return start + Math.floor(Math.random() * count) * step;
            },
            seed: (s: number) => {
                randomState.seedVal = s;
            },
        };

        variables['random'] = randomState;

        try {
            this.executeBlock(lines, 0, variables, (text) => {
                outputBuffer += text + '\n';
            });

            const endTime = performance.now();
            return {
                success: true,
                output: outputBuffer,
                executionTimeMs: Math.round(endTime - startTime),
            };
        } catch (err: any) {
            const endTime = performance.now();
            return {
                success: false,
                output: outputBuffer,
                error: err.message || String(err),
                executionTimeMs: Math.round(endTime - startTime),
            };
        }
    }

    private executeBlock(
        lines: string[],
        indent: number,
        variables: Record<string, any>,
        printFn: (text: string) => void
    ) {
        let i = 0;
        const maxSteps = 10000;
        let stepCount = 0;

        while (i < lines.length) {
            stepCount++;
            if (stepCount > maxSteps) {
                throw new Error('RuntimeError: Maximum iteration depth exceeded (possible infinite loop)');
            }

            const rawLine = lines[i];
            const trimmed = rawLine.trim();

            if (!trimmed || trimmed.startsWith('#')) {
                i++;
                continue;
            }

            const currentIndent = rawLine.search(/\S/);
            if (currentIndent < indent) {
                // Block finished
                break;
            }

            // 1. Import statements: import random / import math / import sys
            if (trimmed.startsWith('import ') || trimmed.startsWith('from ')) {
                i++;
                continue;
            }

            // 2. While loop: while condition:
            const whileMatch = trimmed.match(/^while\s+(.+):\s*$/);
            if (whileMatch) {
                const conditionExpr = whileMatch[1];
                const loopBody: string[] = [];
                let j = i + 1;
                while (j < lines.length) {
                    const nextLine = lines[j];
                    if (!nextLine.trim()) {
                        loopBody.push(nextLine);
                        j++;
                        continue;
                    }
                    const nextIndent = nextLine.search(/\S/);
                    if (nextIndent <= currentIndent) break;
                    loopBody.push(nextLine);
                    j++;
                }

                let loopIterations = 0;
                while (this.evaluateBoolean(conditionExpr, variables, i + 1)) {
                    loopIterations++;
                    if (loopIterations > 500) {
                        throw new Error('RuntimeError: Infinite while loop detected');
                    }
                    this.executeBlock(loopBody, currentIndent + 1, variables, printFn);
                }

                i = j;
                continue;
            }

            // 3. For loop: for var in range(...): or for var in list:
            const forMatch = trimmed.match(/^for\s+([a-zA-Z_]\w*)\s+in\s+(.+):\s*$/);
            if (forMatch) {
                const varName = forMatch[1];
                const iterExpr = forMatch[2];

                const loopBody: string[] = [];
                let j = i + 1;
                while (j < lines.length) {
                    const nextLine = lines[j];
                    if (!nextLine.trim()) {
                        loopBody.push(nextLine);
                        j++;
                        continue;
                    }
                    const nextIndent = nextLine.search(/\S/);
                    if (nextIndent <= currentIndent) break;
                    loopBody.push(nextLine);
                    j++;
                }

                // Evaluate range / sequence
                const items = this.evaluateIterable(iterExpr, variables, i + 1);
                for (const item of items) {
                    variables[varName] = item;
                    this.executeBlock(loopBody, currentIndent + 1, variables, printFn);
                }

                i = j;
                continue;
            }

            // 4. If / Elif / Else blocks
            const ifMatch = trimmed.match(/^if\s+(.+):\s*$/);
            if (ifMatch) {
                const condition = ifMatch[1];
                const branches: { condition?: string; body: string[] }[] = [];

                let currentBranchCond: string | undefined = condition;
                let currentBranchBody: string[] = [];
                let j = i + 1;

                while (j < lines.length) {
                    const nextLine = lines[j];
                    const nextTrim = nextLine.trim();
                    const nextIndent = nextLine.search(/\S/);

                    if (!nextTrim) {
                        currentBranchBody.push(nextLine);
                        j++;
                        continue;
                    }

                    if (nextIndent === currentIndent) {
                        const elifMatch = nextTrim.match(/^elif\s+(.+):\s*$/);
                        const elseMatch = nextTrim.match(/^else:\s*$/);

                        if (elifMatch) {
                            branches.push({ condition: currentBranchCond, body: currentBranchBody });
                            currentBranchCond = elifMatch[1];
                            currentBranchBody = [];
                            j++;
                            continue;
                        } else if (elseMatch) {
                            branches.push({ condition: currentBranchCond, body: currentBranchBody });
                            currentBranchCond = undefined;
                            currentBranchBody = [];
                            j++;
                            continue;
                        } else {
                            break;
                        }
                    } else if (nextIndent < currentIndent) {
                        break;
                    }

                    currentBranchBody.push(nextLine);
                    j++;
                }

                branches.push({ condition: currentBranchCond, body: currentBranchBody });

                // Execute first truthy branch
                for (const branch of branches) {
                    if (branch.condition === undefined || this.evaluateBoolean(branch.condition, variables, i + 1)) {
                        this.executeBlock(branch.body, currentIndent + 1, variables, printFn);
                        break;
                    }
                }

                i = j;
                continue;
            }

            // 5. Print statement
            const printMatch = trimmed.match(/^print\s*\(([\s\S]*)\)$/);
            if (printMatch) {
                const argsContent = printMatch[1].trim();
                if (!argsContent) {
                    printFn('');
                } else {
                    const parsedArgs = this.splitArguments(argsContent);
                    const evalResults = parsedArgs.map((arg) => {
                        const val = this.evaluateExpression(arg, variables, i + 1);
                        if (typeof val === 'boolean') return val ? 'True' : 'False';
                        if (val === null || val === undefined) return 'None';
                        return String(val);
                    });
                    printFn(evalResults.join(' '));
                }
                i++;
                continue;
            }

            // 6. Augmented Assignment: x += 5
            const augMatch = trimmed.match(/^([a-zA-Z_]\w*)\s*(\+=|-=|\*=|\/=|%=|\/\/=|\*\*=)\s*(.+)$/);
            if (augMatch) {
                const vName = augMatch[1];
                const op = augMatch[2];
                const rhs = augMatch[3];
                if (!(vName in variables)) {
                    throw new Error(`NameError: name '${vName}' is not defined on line ${i + 1}`);
                }
                const rhsVal = this.evaluateExpression(rhs, variables, i + 1);
                let cur = variables[vName];
                if (op === '+=') cur = cur + rhsVal;
                else if (op === '-=') cur = cur - rhsVal;
                else if (op === '*=') cur = cur * rhsVal;
                else if (op === '/=') cur = cur / rhsVal;
                else if (op === '%=') cur = cur % rhsVal;
                else if (op === '//=') cur = Math.floor(cur / rhsVal);
                else if (op === '**=') cur = Math.pow(cur, rhsVal);
                variables[vName] = cur;
                i++;
                continue;
            }

            // 7. Tuple Assignment: a, b = 1, 2
            const tupleMatch = trimmed.match(/^([a-zA-Z_]\w*)\s*,\s*([a-zA-Z_]\w*)\s*=\s*(.+)$/);
            if (tupleMatch) {
                const v1 = tupleMatch[1];
                const v2 = tupleMatch[2];
                const parts = tupleMatch[3].split(',').map((s) => s.trim());
                if (parts.length === 2) {
                    variables[v1] = this.evaluateExpression(parts[0], variables, i + 1);
                    variables[v2] = this.evaluateExpression(parts[1], variables, i + 1);
                    i++;
                    continue;
                }
            }

            // 8. Assignment: x = 10
            const assignMatch = trimmed.match(/^([a-zA-Z_]\w*)\s*=\s*(.+)$/);
            if (assignMatch) {
                const vName = assignMatch[1];
                const rhs = assignMatch[2];
                const reserved = ['if', 'else', 'for', 'while', 'class', 'def', 'return', 'import', 'from', 'pass'];
                if (reserved.includes(vName)) {
                    throw new Error(`SyntaxError: cannot assign to keyword '${vName}' on line ${i + 1}`);
                }
                variables[vName] = this.evaluateExpression(rhs, variables, i + 1);
                i++;
                continue;
            }

            // Evaluate expression
            this.evaluateExpression(trimmed, variables, i + 1);
            i++;
        }
    }

    private splitArguments(argsStr: string): string[] {
        const result: string[] = [];
        let current = '';
        let inQuote: string | null = null;
        let parenDepth = 0;

        for (let i = 0; i < argsStr.length; i++) {
            const char = argsStr[i];

            if (inQuote) {
                current += char;
                if (char === inQuote && argsStr[i - 1] !== '\\') {
                    inQuote = null;
                }
            } else {
                if (char === '"' || char === "'") {
                    inQuote = char;
                    current += char;
                } else if (char === '(' || char === '[' || char === '{') {
                    parenDepth++;
                    current += char;
                } else if (char === ')' || char === ']' || char === '}') {
                    parenDepth--;
                    current += char;
                } else if (char === ',' && parenDepth === 0) {
                    result.push(current.trim());
                    current = '';
                } else {
                    current += char;
                }
            }
        }

        if (current.trim()) {
            result.push(current.trim());
        }

        return result;
    }

    private evaluateIterable(expr: string, variables: Record<string, any>, lineNum: number): any[] {
        const trimmed = expr.trim();
        const rangeMatch = trimmed.match(/^range\s*\(([\s\S]*)\)$/);
        if (rangeMatch) {
            const args = this.splitArguments(rangeMatch[1]).map((a) =>
                Number(this.evaluateExpression(a, variables, lineNum))
            );
            let start = 0;
            let stop = 0;
            let step = 1;

            if (args.length === 1) {
                stop = args[0];
            } else if (args.length === 2) {
                start = args[0];
                stop = args[1];
            } else if (args.length === 3) {
                start = args[0];
                stop = args[1];
                step = args[2];
            }

            const res: number[] = [];
            if (step > 0) {
                for (let v = start; v < stop; v += step) {
                    res.push(v);
                }
            } else if (step < 0) {
                for (let v = start; v > stop; v += step) {
                    res.push(v);
                }
            }
            return res;
        }

        const evaluated = this.evaluateExpression(trimmed, variables, lineNum);
        if (Array.isArray(evaluated)) return evaluated;
        if (typeof evaluated === 'string') return evaluated.split('');
        return [];
    }

    private evaluateBoolean(expr: string, variables: Record<string, any>, lineNum: number): boolean {
        const val = this.evaluateExpression(expr, variables, lineNum);
        return Boolean(val);
    }

    private evaluateExpression(expr: string, variables: Record<string, any>, lineNum: number): any {
        const trimmed = expr.trim();
        if (!trimmed) return null;

        // String literals
        if (
            (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
            (trimmed.startsWith("'") && trimmed.endsWith("'"))
        ) {
            return trimmed.slice(1, -1);
        }

        // Numbers
        if (!isNaN(Number(trimmed))) {
            return Number(trimmed);
        }

        // Booleans
        if (trimmed === 'True') return true;
        if (trimmed === 'False') return false;
        if (trimmed === 'None') return null;

        // type() inspector
        const typeMatch = trimmed.match(/^type\s*\((.+)\)$/);
        if (typeMatch) {
            const innerVal = this.evaluateExpression(typeMatch[1], variables, lineNum);
            if (typeof innerVal === 'number') {
                return Number.isInteger(innerVal) ? "<class 'int'>" : "<class 'float'>";
            }
            if (typeof innerVal === 'string') return "<class 'str'>";
            if (typeof innerVal === 'boolean') return "<class 'bool'>";
            if (Array.isArray(innerVal)) return "<class 'list'>";
            return "<class 'object'>";
        }

        // len(), str(), int(), float(), round(), abs()
        const lenMatch = trimmed.match(/^len\s*\((.+)\)$/);
        if (lenMatch) {
            const inner = this.evaluateExpression(lenMatch[1], variables, lineNum);
            return inner ? inner.length || 0 : 0;
        }

        const intMatch = trimmed.match(/^int\s*\((.+)\)$/);
        if (intMatch) {
            return parseInt(this.evaluateExpression(intMatch[1], variables, lineNum), 10);
        }

        const floatMatch = trimmed.match(/^float\s*\((.+)\)$/);
        if (floatMatch) {
            return parseFloat(this.evaluateExpression(floatMatch[1], variables, lineNum));
        }

        const strMatch = trimmed.match(/^str\s*\((.+)\)$/);
        if (strMatch) {
            return String(this.evaluateExpression(strMatch[1], variables, lineNum));
        }

        // String repetition: "abc" * 3 or 3 * "abc"
        const strRepMatch1 = trimmed.match(/^(".*"|'.*')\s*\*\s*(\d+|[a-zA-Z_]\w*)$/);
        if (strRepMatch1) {
            const strVal = this.evaluateExpression(strRepMatch1[1], variables, lineNum);
            const count = this.evaluateExpression(strRepMatch1[2], variables, lineNum);
            return String(strVal).repeat(Math.max(0, Number(count)));
        }

        const strRepMatch2 = trimmed.match(/^(\d+|[a-zA-Z_]\w*)\s*\*\s*(".*"|'.*')$/);
        if (strRepMatch2) {
            const count = this.evaluateExpression(strRepMatch2[1], variables, lineNum);
            const strVal = this.evaluateExpression(strRepMatch2[2], variables, lineNum);
            return String(strVal).repeat(Math.max(0, Number(count)));
        }

        // Random calls
        const randIntMatch = trimmed.match(/^random\.randint\s*\((.+),\s*(.+)\)$/);
        if (randIntMatch) {
            const min = Number(this.evaluateExpression(randIntMatch[1], variables, lineNum));
            const max = Number(this.evaluateExpression(randIntMatch[2], variables, lineNum));
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        const randChoiceMatch = trimmed.match(/^random\.choice\s*\((.+)\)$/);
        if (randChoiceMatch) {
            const seq = this.evaluateExpression(randChoiceMatch[1], variables, lineNum);
            return Array.isArray(seq) ? seq[Math.floor(Math.random() * seq.length)] : null;
        }

        // Convert python operators to JS
        const jsExpr = trimmed
            .replace(/\band\b/g, '&&')
            .replace(/\bor\b/g, '||')
            .replace(/\bnot\s+/g, '!')
            .replace(/\bTrue\b/g, 'true')
            .replace(/\bFalse\b/g, 'false')
            .replace(/\bNone\b/g, 'null')
            .replace(/(\d+)\s*\/\/\s*(\d+)/g, 'Math.floor($1 / $2)')
            .replace(/(\w+)\s*\/\/\s*(\w+)/g, 'Math.floor($1 / $2)')
            .replace(/\*\*/g, '**');

        const varNames = Object.keys(variables);
        const varValues = Object.values(variables);

        try {
            const evalFn = new Function(...varNames, `return (${jsExpr});`);
            return evalFn(...varValues);
        } catch (err: any) {
            const nameMatch = trimmed.match(/[a-zA-Z_]\w*/g);
            if (nameMatch) {
                for (const name of nameMatch) {
                    if (
                        ![
                            'Math',
                            'floor',
                            'pow',
                            'true',
                            'false',
                            'null',
                            'type',
                            'len',
                            'str',
                            'int',
                            'float',
                            'round',
                            'abs',
                            'random',
                        ].includes(name) &&
                        !(name in variables) &&
                        !/^\d+$/.test(name)
                    ) {
                        throw new Error(`NameError: name '${name}' is not defined on line ${lineNum}`);
                    }
                }
            }
            throw new Error(`SyntaxError: invalid syntax near '${trimmed}' on line ${lineNum}`);
        }
    }

    /**
     * Executes a complete test suite against user code.
     */
    public async runTestSuite(
        code: string,
        testCases: { input?: string; expectedOutput: string; description: string; regexPattern?: string }[]
    ): Promise<SuiteResult> {
        const startTime = performance.now();
        const testResults: TestResult[] = [];
        let passCount = 0;
        let lastOutput = '';

        for (let i = 0; i < testCases.length; i++) {
            const tc = testCases[i];
            const execRes = await this.runCode(code, tc.input || '');
            lastOutput = execRes.output;

            const normalizedActual = execRes.output.trim().replace(/\r\n/g, '\n');
            const normalizedExpected = tc.expectedOutput.trim().replace(/\r\n/g, '\n');

            let passed = false;
            if (execRes.success) {
                if (tc.regexPattern) {
                    passed = new RegExp(tc.regexPattern).test(normalizedActual);
                } else if (normalizedExpected !== '') {
                    passed =
                        normalizedActual === normalizedExpected ||
                        normalizedActual.includes(normalizedExpected);
                } else {
                    passed = true;
                }
            }

            if (passed) {
                passCount++;
            }

            testResults.push({
                testCaseIndex: i,
                description: tc.description,
                passed,
                expected: tc.expectedOutput,
                actual: execRes.output,
                input: tc.input,
                error: execRes.error,
            });
        }

        const endTime = performance.now();
        return {
            allPassed: passCount === testCases.length,
            passCount,
            totalCount: testCases.length,
            testResults,
            rawOutput: lastOutput,
            executionTimeMs: Math.round(endTime - startTime),
        };
    }
}

export const pythonRunner = new PythonRunnerService();

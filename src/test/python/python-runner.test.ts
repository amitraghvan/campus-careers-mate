import { describe, it, expect } from 'vitest';
import { pythonRunner } from '@/features/python/services/python-runner.service';

describe('PythonRunnerService (Fallback Engine)', () => {
    it('executes basic print statements', async () => {
        const res = await pythonRunner.runCode('print("Hello World")');
        expect(res.success).toBe(true);
        expect(res.output.trim()).toBe('Hello World');
    });

    it('evaluates variable assignment and arithmetic', async () => {
        const code = `
x = 10
y = 20
total = x + y
print("Total:", total)
`;
        const res = await pythonRunner.runCode(code);
        expect(res.success).toBe(true);
        expect(res.output.trim()).toBe('Total: 30');
    });

    it('handles Python types and type() inspector', async () => {
        const code = `
age = 20
price = 99.99
name = "Amit"
is_active = True
print(type(age))
print(type(price))
print(type(name))
print(type(is_active))
`;
        const res = await pythonRunner.runCode(code);
        expect(res.success).toBe(true);
        expect(res.output).toContain("<class 'int'>");
        expect(res.output).toContain("<class 'float'>");
        expect(res.output).toContain("<class 'str'>");
        expect(res.output).toContain("<class 'bool'>");
    });

    it('handles string concatenation and repetition', async () => {
        const code = `
first = "Hello"
second = "World"
print(first + " " + second)
print("-" * 5)
`;
        const res = await pythonRunner.runCode(code);
        expect(res.success).toBe(true);
        expect(res.output.trim()).toBe('Hello World\n-----');
    });

    it('detects NameError correctly on missing variables', async () => {
        const code = `
user_name = "Amit"
print(username)
`;
        const res = await pythonRunner.runCode(code);
        expect(res.success).toBe(false);
        expect(res.error).toContain('NameError');
    });

    it('evaluates automated test suite with pass/fail reporting', async () => {
        const code = `
print("Hello World")
`;
        const testCases = [
            { expectedOutput: 'Hello World', description: 'Outputs Hello World' },
        ];
        const suite = await pythonRunner.runTestSuite(code, testCases);
        expect(suite.allPassed).toBe(true);
        expect(suite.passCount).toBe(1);
    });
});

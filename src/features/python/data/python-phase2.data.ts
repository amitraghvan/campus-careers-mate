/**
 * Python Learning Phase 2 (Unit II: Conditional Statements & Iteration)
 * Comprehensive visual curriculum aligned with university standards and industry engineering practices.
 */

import {
    PythonChapter,
    PythonAssessment,
    PythonProject,
    PythonDailyChallenge,
} from '../types/python.types';

export const PHASE_2_CHAPTERS: PythonChapter[] = [
    // ══════════════════════════════════════════════════════════════════════
    // CHAPTER 4 — CONDITIONAL STATEMENTS
    // ══════════════════════════════════════════════════════════════════════
    {
        id: 4,
        chapterNumber: 4,
        title: 'Conditional Statements',
        subtitle: 'Teach your programs how to think, compare, branch, and make intelligent decisions.',
        description: 'Understand Boolean logic, comparison operators, if, if-else, if-elif-else trees, nested conditions, logical operators (and, or, not), modulus arithmetic, and real-world decision systems.',
        estimatedMinutes: 120,
        xpReward: 100,
        badgeName: 'Decision Maker',
        badgeIcon: '🔀',
        lessons: [
            {
                id: 'p2-c4-l1',
                chapterId: 4,
                lessonNumber: 1,
                title: 'Why Do Programs Need Decisions?',
                description: 'Understand how decision making transforms straight-line code into responsive software.',
                durationMinutes: 7,
                xpReward: 10,
                topics: ['Decision Flow', 'Control Flow', 'Branching Logic'],
                whatYoullLearn: [
                    'The difference between sequential execution and conditional branching',
                    'Real-life examples of decision logic (e.g. passing an exam, login checks)',
                    'How computer processors evaluate conditions to choose paths',
                ],
                concept: 'Until now, your programs executed every line in sequence from top to bottom. In the real world, programs must make choices based on data—such as granting access only if a password is correct, or applying a discount only if a cart value exceeds $100.',
                whyItMatters: 'Every app feature—from user authentication to game physics and e-commerce checkout—relies on decision making.',
                visualDiagram: {
                    type: 'flowchart',
                    title: 'Exam Pass / Fail Decision Flow',
                    description: 'The computer checks the condition and branches down one specific path.',
                    diagramText: `        +--------------------+
        |   Start Program    |
        +--------------------+
                  |
                  v
       /----------------------\\
      /   Is marks >= 40 ?     \\
      \\                        /
       \\----------------------/
          /              \\
       YES                NO
        |                  |
        v                  v
+---------------+  +---------------+
| Print "PASS"  |  | Print "FAIL"  |
+---------------+  +---------------+
        \\                  /
         \\                /
          v              v
        +--------------------+
        |    End Program     |
        +--------------------+`,
                },
                syntax: '# Conceptual branching:\nif condition:\n    # code if True\nelse:\n    # code if False',
                exampleCode: 'marks = 65\nif marks >= 40:\n    print("PASS: You qualified!")\nelse:\n    print("FAIL: Please try again.")',
                expectedOutput: 'PASS: You qualified!',
                stepByStepExplanation: [
                    'Line 1: Variable `marks` is assigned 65.',
                    'Line 2: Python checks if 65 >= 40. This evaluates to True.',
                    'Line 3: The indented block runs, printing "PASS: You qualified!".',
                    'Line 4-5: The `else` block is completely skipped because the condition was True.',
                ],
                interactiveStarterCode: 'score = 85\nif score >= 50:\n    print("Level Complete!")\nelse:\n    print("Game Over")',
                quickCheck: [
                    {
                        question: 'What is the primary benefit of conditional statements in programming?',
                        options: [
                            'They make computers run without electricity',
                            'They allow programs to branch and choose different actions based on data',
                            'They automatically delete variables',
                            'They format code indentation',
                        ],
                        correctAnswer: 1,
                        explanation: 'Conditional statements allow programs to execute specific blocks of code based on whether conditions evaluate to True or False.',
                    },
                ],
                miniChallenge: {
                    title: 'Check Temperature Alert',
                    instruction: 'Write code with `temp = 35`. If `temp > 30`, print "Hot Day". Otherwise print "Pleasant Day".',
                    starterCode: 'temp = 35\n# Write decision logic below:\n',
                    expectedOutputSnippet: 'Hot Day',
                    testCases: [{ expectedOutput: 'Hot Day', description: 'Outputs Hot Day for temp=35' }],
                    hint: 'if temp > 30:\n    print("Hot Day")\nelse:\n    print("Pleasant Day")',
                },
            },
            {
                id: 'p2-c4-l2',
                chapterId: 4,
                lessonNumber: 2,
                title: 'Boolean Expressions',
                description: 'Learn how expressions evaluate down to binary truth values: True or False.',
                durationMinutes: 7,
                xpReward: 10,
                topics: ['Boolean Expressions', 'True / False', 'Condition Evaluation'],
                whatYoullLearn: [
                    'What a Boolean expression is (any expression that resolves to True or False)',
                    'How Python compares numbers and text',
                    'Evaluating test statements in Python',
                ],
                concept: 'A **Boolean expression** is an expression that Python evaluates to either `True` or `False`. When you ask Python `5 > 3`, Python calculates the relationship and returns `True`. If you ask `5 < 3`, Python returns `False`.',
                whyItMatters: 'Every `if`, `elif`, and `while` loop condition is fundamentally a Boolean expression.',
                visualDiagram: {
                    type: 'flowchart',
                    title: 'Boolean Reduction Pipeline',
                    diagramText: `+-----------------------+
|  Expression: 5 > 3    |
+-----------------------+
           |
           v [Evaluation]
     /-----------\\
    <  Is 5 > 3 ? >
     \\-----------/
       /       \\
     YES        NO
      |          |
      v          v
   [ True ]   [ False ]`,
                },
                syntax: 'result = (a > b)  # Evaluates to True or False',
                exampleCode: 'print("5 > 3 is:", 5 > 3)\nprint("5 < 3 is:", 5 < 3)\nprint("10 == 10 is:", 10 == 10)\nprint("7 != 5 is:", 7 != 5)',
                expectedOutput: '5 > 3 is: True\n5 < 3 is: False\n10 == 10 is: True\n7 != 5 is: True',
                stepByStepExplanation: [
                    'Line 1: 5 is greater than 3 -> True',
                    'Line 2: 5 is NOT less than 3 -> False',
                    'Line 3: 10 equals 10 -> True',
                    'Line 4: 7 does NOT equal 5 -> True',
                ],
                interactiveStarterCode: 'x = 15\nprint("Is x > 10?", x > 10)\nprint("Is x == 20?", x == 20)',
                quickCheck: [
                    {
                        question: 'What is the value of the Boolean expression `8 <= 8` in Python?',
                        options: ['True', 'False', '8', 'None'],
                        correctAnswer: 0,
                        explanation: 'Since 8 is equal to 8, less-than-or-equal (<=) evaluates to True.',
                    },
                ],
                miniChallenge: {
                    title: 'Evaluate Boolean Expression',
                    instruction: 'Create variable `speed = 75`. Print `speed > 60` (which tests if speed limit is exceeded).',
                    starterCode: '# Evaluate speed limit test:\n',
                    expectedOutputSnippet: 'True',
                    testCases: [{ expectedOutput: 'True', description: 'Evaluates to True' }],
                    hint: 'speed = 75\nprint(speed > 60)',
                },
            },
            {
                id: 'p2-c4-l3',
                chapterId: 4,
                lessonNumber: 3,
                title: 'Comparison Operators Reference',
                description: 'Master all 6 Python comparison operators: ==, !=, >, <, >=, <=.',
                durationMinutes: 8,
                xpReward: 10,
                topics: ['Comparison Operators', 'Equality vs Assignment', 'Relational Operators'],
                whatYoullLearn: [
                    'Equal to (==) vs Assignment (=)',
                    'Not equal to (!=)',
                    'Greater than (>), Less than (<), Greater than or equal (>=), Less than or equal (<=)',
                ],
                concept: 'Python provides 6 relational comparison operators that compare two operands and produce a Boolean. Remember: `=` assigns a value to a variable, while `==` checks if two values are equal!',
                whyItMatters: 'Confusing `=` with `==` is a classic bug that leads to SyntaxErrors in conditions.',
                visualDiagram: {
                    type: 'table',
                    title: 'Python Comparison Operators Summary',
                    description: 'Comprehensive lookup of relational operators and results.',
                    data: {
                        headers: ['Operator', 'Meaning', 'Example', 'Result'],
                        rows: [
                            ['==', 'Equal to', '10 == 10', 'True'],
                            ['!=', 'Not equal to', '10 != 5', 'True'],
                            ['>', 'Greater than', '12 > 7', 'True'],
                            ['<', 'Less than', '4 < 9', 'True'],
                            ['>=', 'Greater than or equal', '5 >= 5', 'True'],
                            ['<=', 'Less than or equal', '3 <= 2', 'False'],
                        ],
                    },
                },
                syntax: 'a == b  # Equality\na != b  # Inequality\na > b   # Greater\na < b   # Less\na >= b  # Greater or Equal\na <= b  # Less or Equal',
                exampleCode: 'p1 = 100\np2 = 100\nprint("p1 == p2:", p1 == p2)\nprint("p1 != p2:", p1 != p2)',
                expectedOutput: 'p1 == p2: True\np1 != p2: False',
                interactiveStarterCode: 'a, b = 25, 30\nprint("a < b:", a < b)\nprint("a >= b:", a >= b)',
                quickCheck: [
                    {
                        question: 'Which operator tests if two variables have different values?',
                        options: ['!=', '<>', 'not =', '!=='],
                        correctAnswer: 0,
                        explanation: '`!=` is the inequality operator in Python.',
                    },
                ],
                miniChallenge: {
                    title: 'Compare Two Balances',
                    instruction: 'Given `required = 500` and `balance = 750`, print `balance >= required`.',
                    starterCode: 'required = 500\nbalance = 750\n# Print comparison:\n',
                    expectedOutputSnippet: 'True',
                    testCases: [{ expectedOutput: 'True', description: 'Outputs True' }],
                    hint: 'print(balance >= required)',
                },
            },
            {
                id: 'p2-c4-l4',
                chapterId: 4,
                lessonNumber: 4,
                title: 'The if Statement',
                description: 'Learn the syntax of the standalone if statement: condition, colon, and indented block.',
                durationMinutes: 8,
                xpReward: 10,
                topics: ['if Statement', 'Colon (:)', 'Indented Block', 'Conditional Execution'],
                whatYoullLearn: [
                    'How to write a basic `if` statement in Python',
                    'Why the colon `:` at the end of the `if` line is mandatory',
                    'How the indented block executes only when the condition is True',
                ],
                concept: 'The `if` statement is Python\'s simplest decision maker. It tests a condition: if the condition is `True`, Python executes the indented block beneath it. If `False`, Python skips the block entirely.',
                whyItMatters: 'Every validation check (like verifying password length or user age) begins with an `if` statement.',
                visualDiagram: {
                    type: 'flowchart',
                    title: 'Standalone IF Flowchart',
                    diagramText: `         +---------------+
         | Start Program |
         +---------------+
                 |
                 v
       /-------------------\\
      /  Condition True?    \\
      \\                     /
       \\-------------------/
          /             \\
       True             False
        |                 |
        v                 |
+---------------+         |
| Execute Block |         |
+---------------+         |
        |                 |
        v                 v
   +---------------------------+
   |   Continue Next Line      |
   +---------------------------+`,
                },
                syntax: 'if condition:\n    # Indented block executes ONLY if condition is True\n    statement_1\n    statement_2',
                exampleCode: 'age = 20\nif age >= 18:\n    print("Eligible to vote")\nprint("Program finished.")',
                expectedOutput: 'Eligible to vote\nProgram finished.',
                stepByStepExplanation: [
                    '1. `age` is 20.',
                    '2. `if age >= 18:` evaluates to True (20 >= 18).',
                    '3. Python enters the indented block and prints "Eligible to vote".',
                    '4. Python leaves the block and continues with "Program finished.".',
                ],
                interactiveStarterCode: 'battery = 15\nif battery < 20:\n    print("Low Battery Warning!")',
                quickCheck: [
                    {
                        question: 'What character is required at the end of the `if condition` line?',
                        options: ['; (semicolon)', ': (colon)', '{ (curly brace)', 'then'],
                        correctAnswer: 1,
                        explanation: 'In Python, all compound statements (if, else, for, while, def) must end with a colon (:).',
                    },
                ],
                miniChallenge: {
                    title: 'Speed Warning Alert',
                    instruction: 'Given `speed = 85`. If `speed > 70`, print "Over Speed Limit".',
                    starterCode: 'speed = 85\n# Write if statement below:\n',
                    expectedOutputSnippet: 'Over Speed Limit',
                    testCases: [{ expectedOutput: 'Over Speed Limit', description: 'Outputs warning when speed=85' }],
                    hint: 'if speed > 70:\n    print("Over Speed Limit")',
                },
            },
            {
                id: 'p2-c4-l5',
                chapterId: 4,
                lessonNumber: 5,
                title: 'Indentation in Python',
                description: 'Understand how Python uses 4 spaces of indentation instead of curly braces to define blocks.',
                durationMinutes: 7,
                xpReward: 10,
                topics: ['Indentation', 'IndentationError', 'PEP 8 (4 Spaces)'],
                whatYoullLearn: [
                    'How Python uses indentation to know which lines belong inside an `if` block',
                    'The PEP 8 standard: 4 spaces per indentation level',
                    'Diagnosing and fixing `IndentationError: expected an indented block`',
                ],
                concept: 'Unlike languages like C, Java, or JavaScript that use `{}` curly braces to wrap code blocks, Python uses **whitespace indentation**. Every statement inside a block must be indented consistently (standard: 4 spaces).',
                whyItMatters: 'Indentation makes Python code look neat, readable, and structured by design.',
                visualDiagram: {
                    type: 'flowchart',
                    title: 'Indentation Block Structure',
                    diagramText: `if condition:
....statement_1  <-- Inside IF block (Indented 4 spaces)
....statement_2  <-- Inside IF block (Indented 4 spaces)
statement_3      <-- Outside IF block (Runs regardless)`,
                },
                syntax: '# CORRECT:\nif score > 50:\n    print("Passed")\n    print("Well done")\n\n# INCORRECT (Syntax/IndentationError):\n# if score > 50:\n# print("Passed")',
                exampleCode: 'score = 95\nif score >= 90:\n    print("Top Performer!")\n    print("You earned a gold star ⭐")\nprint("Evaluation done.")',
                expectedOutput: 'Top Performer!\nYou earned a gold star ⭐\nEvaluation done.',
                interactiveStarterCode: '# Notice how both indented lines run only when condition is True\nx = 10\nif x == 10:\n    print("Line 1 in block")\n    print("Line 2 in block")',
                quickCheck: [
                    {
                        question: 'What error does Python raise if you omit indentation after an if statement?',
                        options: ['TypeError', 'IndentationError', 'NameError', 'ValueError'],
                        correctAnswer: 1,
                        explanation: 'Python raises `IndentationError: expected an indented block`.',
                    },
                ],
                miniChallenge: {
                    title: 'Fix Indentation Bug',
                    instruction: 'Fix the indentation in the code below so it prints "Access Granted" inside the if block.',
                    starterCode: 'is_admin = True\nif is_admin:\nprint("Access Granted")',
                    expectedOutputSnippet: 'Access Granted',
                    testCases: [{ expectedOutput: 'Access Granted', description: 'Outputs Access Granted with valid indentation' }],
                    hint: 'Add 4 spaces before print("Access Granted").',
                },
            },
            {
                id: 'p2-c4-l6',
                chapterId: 4,
                lessonNumber: 6,
                title: 'The if-else Statement',
                description: 'Provide an alternative fallback branch when the condition is False.',
                durationMinutes: 8,
                xpReward: 10,
                topics: ['if-else Statement', 'Dual Branching', 'Binary Choices'],
                whatYoullLearn: [
                    'How `else:` defines what happens when the `if` condition evaluates to False',
                    'Why exactly ONE of the two blocks is guaranteed to execute',
                    'Writing clean binary decision programs',
                ],
                concept: 'An `if-else` statement provides two mutually exclusive paths. If the condition is `True`, the `if` block executes. If `False`, the `else` block executes. One of the two blocks will ALWAYS run, but never both.',
                whyItMatters: 'Most real-world decisions are binary: Logged In vs Logged Out, Pass vs Fail, Valid vs Invalid.',
                visualDiagram: {
                    type: 'flowchart',
                    title: 'IF-ELSE Decision Branching',
                    diagramText: `                +---------------+
                | Start Program |
                +---------------+
                        |
                        v
              /-------------------\\
             /   Is age >= 18 ?    \\
             \\                     /
              \\-------------------/
                 /             \\
             True               False
              |                   |
              v                   v
      +---------------+   +---------------+
      | Print "Adult" |   | Print "Minor" |
      +---------------+   +---------------+
              \\                   /
               \\                 /
                v               v
             +--------------------+
             |    Next Statement  |
             +--------------------+`,
                },
                syntax: 'if condition:\n    # Executes if True\n    block_1\nelse:\n    # Executes if False\n    block_2',
                exampleCode: 'age = 16\nif age >= 18:\n    print("Adult: Full ticket price")\nelse:\n    print("Minor: Discounted ticket price")',
                expectedOutput: 'Minor: Discounted ticket price',
                stepByStepExplanation: [
                    '1. `age` is 16.',
                    '2. `age >= 18` is checked (16 >= 18 is False).',
                    '3. The `if` block is skipped.',
                    '4. The `else` block executes, printing "Minor: Discounted ticket price".',
                ],
                interactiveStarterCode: 'is_logged_in = False\nif is_logged_in:\n    print("Welcome to your Dashboard")\nelse:\n    print("Please Log In to continue")',
                quickCheck: [
                    {
                        question: 'Can both the `if` and `else` blocks execute in a single run?',
                        options: ['Yes, always', 'No, exactly one block executes', 'Only if the computer is fast'],
                        correctAnswer: 1,
                        explanation: '`if` and `else` are mutually exclusive—only one branch runs.',
                    },
                ],
                miniChallenge: {
                    title: 'Pass / Fail Checker',
                    instruction: 'Given `marks = 35`. If `marks >= 40`, print "Passed". Otherwise print "Failed".',
                    starterCode: 'marks = 35\n# Write if-else below:\n',
                    expectedOutputSnippet: 'Failed',
                    testCases: [{ expectedOutput: 'Failed', description: 'Outputs Failed for marks=35' }],
                    hint: 'if marks >= 40:\n    print("Passed")\nelse:\n    print("Failed")',
                },
            },
            {
                id: 'p2-c4-l7',
                chapterId: 4,
                lessonNumber: 7,
                title: 'The if-elif-else Statement',
                description: 'Handle multiple distinct conditions in sequence with elif (short for else if).',
                durationMinutes: 9,
                xpReward: 10,
                topics: ['if-elif-else', 'Multi-way Branching', 'Sequential Decision Tree'],
                whatYoullLearn: [
                    'What `elif` stands for (else if)',
                    'How Python checks conditions from top to bottom and stops at the FIRST match',
                    'Why the final `else` serves as a default catch-all fallback',
                ],
                concept: 'When you have more than two possible outcomes (like grades A, B, C, D, F or traffic lights Red, Yellow, Green), use `elif`. Python tests conditions from top to bottom. As soon as it finds a `True` condition, it executes that block and **skips all remaining elif and else blocks**.',
                whyItMatters: 'Multi-way branching is essential for grading systems, tiered tax brackets, routing rules, and status badges.',
                visualDiagram: {
                    type: 'flowchart',
                    title: 'IF-ELIF-ELSE Decision Tree',
                    diagramText: `        /----------------------\\
       /    Is marks >= 90 ?    \\  --- YES ---> [ Grade A+ ]
       \\                        /
        \\----------------------/
                   | NO
                   v
        /----------------------\\
       /    Is marks >= 80 ?    \\  --- YES ---> [ Grade A ]
       \\                        /
        \\----------------------/
                   | NO
                   v
        /----------------------\\
       /    Is marks >= 70 ?    \\  --- YES ---> [ Grade B ]
       \\                        /
        \\----------------------/
                   | NO
                   v
           [ Grade C (else) ]`,
                },
                syntax: 'if condition_1:\n    block_1\nelif condition_2:\n    block_2\nelif condition_3:\n    block_3\nelse:\n    fallback_block',
                exampleCode: 'marks = 82\nif marks >= 90:\n    print("Grade: A+")\nelif marks >= 80:\n    print("Grade: A")\nelif marks >= 70:\n    print("Grade: B")\nelse:\n    print("Grade: Needs Improvement")',
                expectedOutput: 'Grade: A',
                stepByStepExplanation: [
                    '1. `marks` is 82.',
                    '2. `marks >= 90` is False (82 >= 90 is False) -> move to first elif.',
                    '3. `marks >= 80` is True (82 >= 80 is True) -> print "Grade: A".',
                    '4. Python jumps straight to the end, skipping remaining elif/else blocks.',
                ],
                interactiveStarterCode: 'signal = "Yellow"\nif signal == "Red":\n    print("Stop")\nelif signal == "Yellow":\n    print("Get Ready")\nelif signal == "Green":\n    print("Go")\nelse:\n    print("Invalid Signal")',
                quickCheck: [
                    {
                        question: 'What happens when Python encounters the first True condition in an if-elif chain?',
                        options: [
                            'It executes that block and ignores all subsequent elif/else blocks',
                            'It tests all remaining conditions anyway',
                            'It restarts from the beginning',
                        ],
                        correctAnswer: 0,
                        explanation: 'Python executes the first matching block and exits the entire chain.',
                    },
                ],
                miniChallenge: {
                    title: 'Speed Category Classifier',
                    instruction: 'Given `speed = 45`. If `speed > 60` print "Fast". If `speed >= 30` print "Moderate". Otherwise print "Slow".',
                    starterCode: 'speed = 45\n# Write if-elif-else:\n',
                    expectedOutputSnippet: 'Moderate',
                    testCases: [{ expectedOutput: 'Moderate', description: 'Outputs Moderate for speed=45' }],
                    hint: 'if speed > 60:\n    print("Fast")\nelif speed >= 30:\n    print("Moderate")\nelse:\n    print("Slow")',
                },
            },
            {
                id: 'p2-c4-l8',
                chapterId: 4,
                lessonNumber: 8,
                title: 'Nested Conditionals',
                description: 'Learn how to place conditional statements inside other conditional statements.',
                durationMinutes: 8,
                xpReward: 10,
                topics: ['Nested Conditionals', 'Inner vs Outer Conditions', 'Hierarchical Decisions'],
                whatYoullLearn: [
                    'What nested conditionals are (an `if` statement placed inside another `if` block)',
                    'How inner conditions are only evaluated if the outer condition succeeds',
                    'When to use nested conditionals vs logical `and` operators',
                ],
                concept: 'A **nested conditional** is a conditional statement placed inside another conditional block. The inner condition is checked ONLY IF the outer condition was `True`.',
                whyItMatters: 'Nested conditions model 2-step verification (e.g. valid username -> check password, or age >= 18 -> check VIP pass).',
                visualDiagram: {
                    type: 'flowchart',
                    title: 'Nested Conditional Flow',
                    diagramText: `        /---------------------\\
       /     Is age >= 18 ?    \\
       \\                       /
        \\---------------------/
           /                 \\
       YES                    NO
        |                      |
        v                      v
 /--------------------\\   [ Entry Denied: Underage ]
/    Has Valid ID?     \\
\\                      /
 \\--------------------/
    /              \\
  YES               NO
   |                 |
   v                 v
[ Entry Allowed ] [ Denied: No ID ]`,
                },
                syntax: 'if outer_condition:\n    if inner_condition:\n        # Both conditions are True\n        print("Success")\n    else:\n        # Outer is True, Inner is False\n        print("Inner Failed")\nelse:\n    # Outer is False\n    print("Outer Failed")',
                exampleCode: 'age = 20\nhas_id = True\n\nif age >= 18:\n    if has_id:\n        print("Entry granted!")\n    else:\n        print("ID required!")\nelse:\n    print("Must be 18 or older.")',
                expectedOutput: 'Entry granted!',
                interactiveStarterCode: 'logged_in = True\nis_subscribed = True\nif logged_in:\n    if is_subscribed:\n        print("Premium Video Playing 🎬")',
                quickCheck: [
                    {
                        question: 'When will the inner `if` condition in a nested conditional be evaluated?',
                        options: [
                            'Only if the outer `if` condition is True',
                            'Always, regardless of the outer condition',
                            'Only if the outer `if` condition is False',
                        ],
                        correctAnswer: 0,
                        explanation: 'The inner block is only entered if the outer condition evaluates to True.',
                    },
                ],
                miniChallenge: {
                    title: 'Nested Account Verification',
                    instruction: 'Given `has_account = True` and `is_verified = True`. Use nested if statements to print "Access Granted" only if both are True.',
                    starterCode: 'has_account = True\nis_verified = True\n# Write nested if statements:\n',
                    expectedOutputSnippet: 'Access Granted',
                    testCases: [{ expectedOutput: 'Access Granted', description: 'Outputs Access Granted' }],
                    hint: 'if has_account:\n    if is_verified:\n        print("Access Granted")',
                },
            },
            {
                id: 'p2-c4-l9',
                chapterId: 4,
                lessonNumber: 9,
                title: 'Logical AND Operator',
                description: 'Combine multiple conditions where ALL conditions must be True.',
                durationMinutes: 7,
                xpReward: 10,
                topics: ['Logical and', 'Truth Tables', 'Compound Conditions'],
                whatYoullLearn: [
                    'How the `and` operator combines two Boolean expressions',
                    'Why `and` returns True ONLY if BOTH operands are True',
                    'Simplifying nested conditionals with `and`',
                ],
                concept: 'The `and` operator connects two conditions. It evaluates to `True` only when BOTH conditions are `True`. If either condition is `False`, the entire expression becomes `False`.',
                whyItMatters: 'Using `and` replaces deep nested indentation with a single clean, readable line.',
                visualDiagram: {
                    type: 'table',
                    title: 'Truth Table: Logical AND',
                    data: {
                        headers: ['Condition A', 'Condition B', 'A and B Result'],
                        rows: [
                            ['True', 'True', 'True  ✅'],
                            ['True', 'False', 'False ❌'],
                            ['False', 'True', 'False ❌'],
                            ['False', 'False', 'False ❌'],
                        ],
                    },
                },
                syntax: 'if condition_1 and condition_2:\n    # Executes only if BOTH are True\n    statement',
                exampleCode: 'age = 22\nhas_license = True\nif age >= 18 and has_license:\n    print("Eligible to drive a car 🚗")',
                expectedOutput: 'Eligible to drive a car 🚗',
                interactiveStarterCode: 'gpa = 3.9\nattendance = 92\nif gpa >= 3.5 and attendance >= 85:\n    print("Dean\'s Honor Roll! 🎓")',
                quickCheck: [
                    {
                        question: 'What is the value of `(10 > 5) and (3 > 7)`?',
                        options: ['True', 'False', '10', 'Error'],
                        correctAnswer: 1,
                        explanation: '10 > 5 is True, but 3 > 7 is False. True and False is False.',
                    },
                ],
                miniChallenge: {
                    title: 'Verify Loan Eligibility with and',
                    instruction: 'Given `income = 60000` and `credit_score = 750`. If `income >= 50000 and credit_score >= 700`, print "Loan Approved".',
                    starterCode: 'income = 60000\ncredit_score = 750\n# Write condition below:\n',
                    expectedOutputSnippet: 'Loan Approved',
                    testCases: [{ expectedOutput: 'Loan Approved', description: 'Outputs Loan Approved' }],
                    hint: 'if income >= 50000 and credit_score >= 700:\n    print("Loan Approved")',
                },
            },
            {
                id: 'p2-c4-l10',
                chapterId: 4,
                lessonNumber: 10,
                title: 'Logical OR Operator',
                description: 'Combine conditions where AT LEAST ONE condition must be True.',
                durationMinutes: 7,
                xpReward: 10,
                topics: ['Logical or', 'Alternative Conditions', 'Truth Tables'],
                whatYoullLearn: [
                    'How the `or` operator works in Python',
                    'Why `or` returns True if ANY condition is True',
                    'Handling multiple acceptable scenarios',
                ],
                concept: 'The `or` operator connects two conditions and evaluates to `True` if AT LEAST ONE condition is `True`. It only evaluates to `False` if BOTH conditions are `False`.',
                whyItMatters: 'Useful when multiple options qualify a user (e.g. payment via Credit Card OR UPI, discount for Students OR Seniors).',
                visualDiagram: {
                    type: 'table',
                    title: 'Truth Table: Logical OR',
                    data: {
                        headers: ['Condition A', 'Condition B', 'A or B Result'],
                        rows: [
                            ['True', 'True', 'True  ✅'],
                            ['True', 'False', 'True  ✅'],
                            ['False', 'True', 'True  ✅'],
                            ['False', 'False', 'False ❌'],
                        ],
                    },
                },
                syntax: 'if condition_1 or condition_2:\n    # Executes if at least one is True\n    statement',
                exampleCode: 'is_weekend = False\nis_holiday = True\nif is_weekend or is_holiday:\n    print("Time to relax! 🎉")',
                expectedOutput: 'Time to relax! 🎉',
                interactiveStarterCode: 'has_coupon = False\nis_member = True\nif has_coupon or is_member:\n    print("10% Discount Applied")',
                quickCheck: [
                    {
                        question: 'What is the value of `False or True` in Python?',
                        options: ['True', 'False', 'None', 'Error'],
                        correctAnswer: 0,
                        explanation: '`or` needs only one True operand to evaluate to True.',
                    },
                ],
                miniChallenge: {
                    title: 'Discount Eligibility Check',
                    instruction: 'Given `is_student = True` and `is_senior = False`. If `is_student or is_senior`, print "Discount Granted".',
                    starterCode: 'is_student = True\nis_senior = False\n# Write or condition:\n',
                    expectedOutputSnippet: 'Discount Granted',
                    testCases: [{ expectedOutput: 'Discount Granted', description: 'Outputs Discount Granted' }],
                    hint: 'if is_student or is_senior:\n    print("Discount Granted")',
                },
            },
            {
                id: 'p2-c4-l11',
                chapterId: 4,
                lessonNumber: 11,
                title: 'Logical NOT Operator',
                description: 'Invert truth values using not (True becomes False, False becomes True).',
                durationMinutes: 6,
                xpReward: 10,
                topics: ['Logical not', 'Inversion', 'Negation'],
                whatYoullLearn: [
                    'How the unary `not` operator reverses a Boolean value',
                    'Writing cleaner negative condition checks',
                    'Examples with flags and boolean state variables',
                ],
                concept: 'The `not` operator reverses the Boolean state of an expression. `not True` evaluates to `False`, and `not False` evaluates to `True`.',
                whyItMatters: 'Allows writing natural English-like checks: `if not is_raining:` or `if not has_errors:`.',
                visualDiagram: {
                    type: 'table',
                    title: 'Truth Table: Logical NOT',
                    data: {
                        headers: ['Input A', 'not A Result'],
                        rows: [
                            ['True', 'False'],
                            ['False', 'True'],
                        ],
                    },
                },
                syntax: 'if not condition:\n    # Executes if condition is False\n    statement',
                exampleCode: 'is_raining = False\nif not is_raining:\n    print("Go outside for a walk ☀️")',
                expectedOutput: 'Go outside for a walk ☀️',
                interactiveStarterCode: 'is_game_over = False\nif not is_game_over:\n    print("Game in progress... 🎮")',
                quickCheck: [
                    {
                        question: 'What is the output of `print(not (5 > 10))`?',
                        options: ['True', 'False', '5', '10'],
                        correctAnswer: 0,
                        explanation: '5 > 10 is False. not False is True.',
                    },
                ],
                miniChallenge: {
                    title: 'Check Inactive State with not',
                    instruction: 'Given `is_blocked = False`. If `not is_blocked`, print "User is Active".',
                    starterCode: 'is_blocked = False\n# Write not condition:\n',
                    expectedOutputSnippet: 'User is Active',
                    testCases: [{ expectedOutput: 'User is Active', description: 'Outputs User is Active' }],
                    hint: 'if not is_blocked:\n    print("User is Active")',
                },
            },
            {
                id: 'p2-c4-l12',
                chapterId: 4,
                lessonNumber: 12,
                title: 'Combining Logical Operators & Precedence',
                description: 'Combine and, or, not with parentheses to construct complex business rules.',
                durationMinutes: 8,
                xpReward: 10,
                topics: ['Operator Precedence', 'Compound Boolean Logic', 'Parentheses Grouping'],
                whatYoullLearn: [
                    'The logical precedence hierarchy: `not` > `and` > `or`',
                    'Why parentheses `( )` should always be used for clarity in compound expressions',
                    'Building robust security and qualification checks',
                ],
                concept: 'When combining logical operators, Python executes `not` first, then `and`, and finally `or`. You should always wrap compound sub-conditions in parentheses to make your logic explicit and prevent subtle bugs.',
                whyItMatters: 'Complex authorization (e.g. Admin OR (Manager AND in_same_department)) requires proper precedence.',
                syntax: 'if (cond_1 or cond_2) and cond_3:\n    statement',
                exampleCode: 'is_admin = False\nis_owner = True\nhas_token = True\n\nif (is_admin or is_owner) and has_token:\n    print("Full Edit Permissions Granted")',
                expectedOutput: 'Full Edit Permissions Granted',
                interactiveStarterCode: 'age = 22\nis_student = True\nhas_id = True\nif (age < 25 or is_student) and has_id:\n    print("Eligible for Campus Discount")',
                quickCheck: [
                    {
                        question: 'Which logical operator has the highest precedence in Python?',
                        options: ['or', 'and', 'not', 'All equal'],
                        correctAnswer: 2,
                        explanation: '`not` has higher precedence than `and`, which has higher precedence than `or`.',
                    },
                ],
                miniChallenge: {
                    title: 'Complex Eligibility Evaluator',
                    instruction: 'Given `has_pass = True`, `has_ticket = False`, `is_vip = True`. If `(has_pass or has_ticket) and is_vip`, print "VIP Entry Confirmed".',
                    starterCode: 'has_pass = True\nhas_ticket = False\nis_vip = True\n# Write combined condition:\n',
                    expectedOutputSnippet: 'VIP Entry Confirmed',
                    testCases: [{ expectedOutput: 'VIP Entry Confirmed', description: 'Outputs VIP Entry Confirmed' }],
                    hint: 'if (has_pass or has_ticket) and is_vip:\n    print("VIP Entry Confirmed")',
                },
            },
            {
                id: 'p2-c4-l13',
                chapterId: 4,
                lessonNumber: 13,
                title: 'The Modulus Operator (%)',
                description: 'Understand division remainders and why % is essential for number patterns.',
                durationMinutes: 7,
                xpReward: 10,
                topics: ['Modulus Operator (%)', 'Division Remainder', 'Arithmetic Patterns'],
                whatYoullLearn: [
                    'What the modulus operator `%` calculates (the remainder after division)',
                    'How 10 % 3 = 1 because 3 * 3 = 9 with 1 remaining',
                    'How to use modulus in everyday programming algorithms',
                ],
                concept: 'The modulus operator `%` returns the remainder when the left operand is divided by the right operand. For example, 14 % 4 = 2 (since 4 goes into 14 three times with 2 left over).',
                whyItMatters: 'Modulus is used to determine divisibility, find even/odd numbers, extract digits, and wrap circular clocks.',
                visualDiagram: {
                    type: 'step_trace',
                    title: 'Modulus Division Breakdown (10 % 3 = 1)',
                    data: {
                        steps: [
                            { step: 1, label: 'Dividend', value: '10', note: 'Number to divide' },
                            { step: 2, label: 'Divisor', value: '3', note: 'Divide by 3' },
                            { step: 3, label: 'Quotient (10 // 3)', value: '3', note: '3 * 3 = 9' },
                            { step: 4, label: 'Remainder (10 - 9)', value: '1', note: '10 % 3 = 1' },
                        ],
                    },
                },
                syntax: 'remainder = a % b',
                exampleCode: 'print("10 % 3 =", 10 % 3)\nprint("20 % 5 =", 20 % 5)\nprint("15 % 4 =", 15 % 4)',
                expectedOutput: '10 % 3 = 1\n20 % 5 = 0\n15 % 4 = 3',
                interactiveStarterCode: 'n = 27\nprint("Remainder of 27 divided by 6 is:", n % 6)',
                quickCheck: [
                    {
                        question: 'What is the output of `17 % 5`?',
                        options: ['3', '2', '3.4', '1'],
                        correctAnswer: 1,
                        explanation: '5 * 3 = 15. 17 - 15 = 2. Remainder is 2.',
                    },
                ],
                miniChallenge: {
                    title: 'Calculate Remainder',
                    instruction: 'Create `num = 47`. Calculate `rem = num % 7` and print `rem`.',
                    starterCode: 'num = 47\n# Calculate and print modulus:\n',
                    expectedOutputSnippet: '5',
                    testCases: [{ expectedOutput: '5', description: 'Outputs 5 (47 % 7 = 5)' }],
                    hint: 'rem = num % 7\nprint(rem)',
                },
            },
            {
                id: 'p2-c4-l14',
                chapterId: 4,
                lessonNumber: 14,
                title: 'Checking Even and Odd Numbers',
                description: 'Combine modulus with conditional checks to classify even and odd integers.',
                durationMinutes: 7,
                xpReward: 10,
                topics: ['Even / Odd', 'Divisibility by 2', 'number % 2 == 0'],
                whatYoullLearn: [
                    'Why any integer `n % 2 == 0` is Even',
                    'Why any integer `n % 2 != 0` is Odd',
                    'Writing a complete even/odd classifier program',
                ],
                concept: 'An **even number** is completely divisible by 2 with zero remainder (`n % 2 == 0`). An **odd number** leaves a remainder of 1 when divided by 2 (`n % 2 != 0`).',
                whyItMatters: 'Even/odd logic is one of the most frequently asked interview questions for beginner programmers.',
                visualDiagram: {
                    type: 'flowchart',
                    title: 'Even vs Odd Decision Flowchart',
                    diagramText: `            +--------------+
            | Input number |
            +--------------+
                   |
                   v
        /----------------------\\
       /    number % 2 == 0?    \\
       \\                        /
        \\----------------------/
           /                \\
        YES                  NO
         |                    |
         v                    v
  +--------------+     +--------------+
  | Print "EVEN" |     | Print "ODD"  |
  +--------------+     +--------------+`,
                },
                syntax: 'if number % 2 == 0:\n    print("Even")\nelse:\n    print("Odd")',
                exampleCode: 'number = 14\nif number % 2 == 0:\n    print(number, "is Even")\nelse:\n    print(number, "is Odd")',
                expectedOutput: '14 is Even',
                interactiveStarterCode: 'val = 21\nif val % 2 == 0:\n    print("Even")\nelse:\n    print("Odd")',
                quickCheck: [
                    {
                        question: 'What condition correctly identifies an even number in Python?',
                        options: ['n / 2 == 0', 'n % 2 == 0', 'n // 2 == 0', 'n == 2'],
                        correctAnswer: 1,
                        explanation: '`n % 2 == 0` tests that dividing n by 2 leaves a remainder of 0.',
                    },
                ],
                miniChallenge: {
                    title: 'Even or Odd Program',
                    instruction: 'Given `num = 19`. If it is even print "Even", otherwise print "Odd".',
                    starterCode: 'num = 19\n# Write even/odd test:\n',
                    expectedOutputSnippet: 'Odd',
                    testCases: [{ expectedOutput: 'Odd', description: 'Outputs Odd for num=19' }],
                    hint: 'if num % 2 == 0:\n    print("Even")\nelse:\n    print("Odd")',
                },
            },
            {
                id: 'p2-c4-l15',
                chapterId: 4,
                lessonNumber: 15,
                title: 'Checking Positive, Negative, or Zero',
                description: 'Classify any real number into positive, negative, or zero using 3-way branching.',
                durationMinutes: 7,
                xpReward: 10,
                topics: ['Sign Classification', 'if-elif-else', 'Boundary Testing'],
                whatYoullLearn: [
                    'Testing `> 0` for Positive',
                    'Testing `< 0` for Negative',
                    'Using `else` for Zero',
                ],
                concept: 'Every real number falls into one of three categories: greater than zero (Positive), less than zero (Negative), or exactly zero (Zero). An `if-elif-else` structure handles all three cases cleanly.',
                whyItMatters: 'Essential for financial ledgers (profits, losses, break-even) and coordinate physics.',
                visualDiagram: {
                    type: 'flowchart',
                    title: 'Sign Classification Flow',
                    diagramText: `     /-----------------\\
    /    number > 0 ?   \\ --- YES ---> [ Positive ]
    \\                   /
     \\-----------------/
             | NO
             v
     /-----------------\\
    /    number < 0 ?   \\ --- YES ---> [ Negative ]
    \\                   /
     \\-----------------/
             | NO
             v
       [ Zero (0) ]`,
                },
                syntax: 'if num > 0:\n    print("Positive")\nelif num < 0:\n    print("Negative")\nelse:\n    print("Zero")',
                exampleCode: 'val = -12\nif val > 0:\n    print("Positive")\nelif val < 0:\n    print("Negative")\nelse:\n    print("Zero")',
                expectedOutput: 'Negative',
                interactiveStarterCode: 'test_val = 0\nif test_val > 0:\n    print("Positive")\nelif test_val < 0:\n    print("Negative")\nelse:\n    print("Zero")',
                quickCheck: [
                    {
                        question: 'What is output if `val = 0` in `if val > 0: ... elif val < 0: ... else: print("Zero")`?',
                        options: ['Positive', 'Negative', 'Zero', 'Error'],
                        correctAnswer: 2,
                        explanation: 'Since 0 is neither > 0 nor < 0, it falls into the else block and prints "Zero".',
                    },
                ],
                miniChallenge: {
                    title: 'Sign Classifier',
                    instruction: 'Given `x = 42`. Write an if-elif-else statement to print "Positive", "Negative", or "Zero".',
                    starterCode: 'x = 42\n# Classify sign:\n',
                    expectedOutputSnippet: 'Positive',
                    testCases: [{ expectedOutput: 'Positive', description: 'Outputs Positive' }],
                    hint: 'if x > 0:\n    print("Positive")\nelif x < 0:\n    print("Negative")\nelse:\n    print("Zero")',
                },
            },
            {
                id: 'p2-c4-l16',
                chapterId: 4,
                lessonNumber: 16,
                title: 'Step-by-Step Grade Calculator',
                description: 'Build an academic grading system mapping numerical percentages to letter grades.',
                durationMinutes: 8,
                xpReward: 10,
                topics: ['Grading Logic', 'Range Partitions', 'Academic Systems'],
                whatYoullLearn: [
                    'How to design overlapping range thresholds properly',
                    'Why checking in descending order (90, 80, 70, 60) avoids unnecessary `and` expressions',
                    'Building robust student result reporting',
                ],
                concept: 'When grading scores on a scale: >=90 is A+, >=80 is A, >=70 is B, >=60 is C, and <60 is F. By checking in descending order with `elif`, each step automatically implies the previous checks were False.',
                whyItMatters: 'Demonstrates clean mathematical range partitioning without bloated code.',
                syntax: 'if marks >= 90:\n    grade = "A+"\nelif marks >= 80:\n    grade = "A"\nelif marks >= 70:\n    grade = "B"\nelif marks >= 60:\n    grade = "C"\nelse:\n    grade = "F"',
                exampleCode: 'score = 88\nif score >= 90:\n    grade = "A+"\nelif score >= 80:\n    grade = "A"\nelif score >= 70:\n    grade = "B"\nelse:\n    grade = "C"\nprint("Score:", score, "-> Grade:", grade)',
                expectedOutput: 'Score: 88 -> Grade: A',
                interactiveStarterCode: 'student_marks = 74\nif student_marks >= 90:\n    print("Grade A+")\nelif student_marks >= 80:\n    print("Grade A")\nelif student_marks >= 70:\n    print("Grade B")\nelse:\n    print("Grade C")',
                quickCheck: [
                    {
                        question: 'Why is it better to check `marks >= 90`, then `marks >= 80` instead of starting with `marks >= 50`?',
                        options: [
                            'Starting from the top ensures higher grades are captured first before lower thresholds match',
                            'Python only understands descending numbers',
                            'Starting from the top saves memory',
                        ],
                        correctAnswer: 0,
                        explanation: 'Descending order prevents higher scores (like 95) from prematurely matching lower conditions like >= 50.',
                    },
                ],
                miniChallenge: {
                    title: 'Compute Student Grade',
                    instruction: 'Given `marks = 92`. If `marks >= 90` print "A+". If `marks >= 80` print "A". Otherwise print "B".',
                    starterCode: 'marks = 92\n# Write grading logic:\n',
                    expectedOutputSnippet: 'A+',
                    testCases: [{ expectedOutput: 'A+', description: 'Outputs A+' }],
                    hint: 'if marks >= 90:\n    print("A+")\nelif marks >= 80:\n    print("A")\nelse:\n    print("B")',
                },
            },
            {
                id: 'p2-c4-l17',
                chapterId: 4,
                lessonNumber: 17,
                title: 'Real-World Conditional Systems',
                description: 'Explore real-world software architectures: ATM withdrawal, e-commerce discounts, and login systems.',
                durationMinutes: 8,
                xpReward: 15,
                topics: ['ATM Logic', 'Discount Engines', 'Validation Systems'],
                whatYoullLearn: [
                    'Modeling the Input -> Condition -> Decision -> Output pipeline',
                    'ATM cash withdrawal logic with balance and daily limit checks',
                    'E-commerce shopping cart discount systems',
                ],
                concept: 'Production software combines multiple conditions to protect user security and handle business transactions. For example, an ATM checks: 1) Is PIN correct? 2) Is withdrawal amount <= balance? 3) Is amount a multiple of 100?',
                whyItMatters: 'This connects programming fundamentals directly to software engineering architectures.',
                visualDiagram: {
                    type: 'flowchart',
                    title: 'ATM Cash Withdrawal Decision Engine',
                    diagramText: `     +--------------------------+
     | Request Withdrawal: $200 |
     +--------------------------+
                  |
                  v
       /----------------------\\
      /   Is Balance >= $200 ? \\ --- NO ---> [ Decline: Insufficient Funds ]
      \\                        /
       \\----------------------/
                  | YES
                  v
       /----------------------\\
      /    Within Daily Limit? \\ --- NO ---> [ Decline: Exceeds Daily Limit ]
      \\                        /
       \\----------------------/
                  | YES
                  v
      [ Dispense Cash & Update Balance ]`,
                },
                syntax: '# ATM Withdrawal Pipeline:\nif amount <= balance:\n    balance -= amount\n    print("Dispensed:", amount)\nelse:\n    print("Insufficient funds")',
                exampleCode: 'cart_total = 120\nis_prime = True\n\nif cart_total >= 100 or is_prime:\n    shipping = 0\nelse:\n    shipping = 10\n\nprint("Final Cart Total:", cart_total + shipping)',
                expectedOutput: 'Final Cart Total: 120',
                interactiveStarterCode: 'balance = 1000\nwithdraw = 300\nif withdraw <= balance:\n    balance -= withdraw\n    print("Success! Remaining Balance:", balance)\nelse:\n    print("Insufficient funds")',
                quickCheck: [
                    {
                        question: 'What design pattern does Input -> Condition -> Decision -> Output represent?',
                        options: ['Hardware soldering', 'Core software decision processing pipeline', 'Website design only'],
                        correctAnswer: 1,
                        explanation: 'It represents the universal decision processing pipeline of computer programs.',
                    },
                ],
                miniChallenge: {
                    title: 'ATM Balance Check',
                    instruction: 'Given `balance = 500` and `withdraw = 200`. If `withdraw <= balance`, subtract it and print "Withdrawal Successful". Otherwise print "Insufficient Funds".',
                    starterCode: 'balance = 500\nwithdraw = 200\n# Write ATM check:\n',
                    expectedOutputSnippet: 'Withdrawal Successful',
                    testCases: [{ expectedOutput: 'Withdrawal Successful', description: 'Outputs Withdrawal Successful' }],
                    hint: 'if withdraw <= balance:\n    print("Withdrawal Successful")\nelse:\n    print("Insufficient Funds")',
                },
            },
        ],
        challenges: [
            {
                id: 'p2-c4-ch1',
                chapterId: 4,
                challengeNumber: 1,
                title: 'Adult or Minor Classifier',
                difficulty: 'Easy',
                xpReward: 20,
                description: 'Given `age = 17`, check if age is >= 18. Print "Adult" if True, otherwise print "Minor".',
                instructions: ['Use if-else statement.', 'If age >= 18 print "Adult", else print "Minor".'],
                starterCode: 'age = 17\n# Write decision logic:\n',
                solutionCode: 'age = 17\nif age >= 18:\n    print("Adult")\nelse:\n    print("Minor")',
                solutionExplanation: 'Compares age against 18 and outputs Minor for 17.',
                hints: [
                    { level: 1, title: 'Concept', content: 'Use an if-else structure.' },
                    { level: 2, title: 'Approach', content: 'Check if age >= 18.' },
                    { level: 3, title: 'Pseudocode', content: 'if age >= 18: print("Adult") else: print("Minor")' },
                    { level: 4, title: 'Detailed Guidance', content: '17 is less than 18, so it prints "Minor".' },
                ],
                testCases: [{ expectedOutput: 'Minor', description: 'Outputs Minor for age=17' }],
                topicCategory: 'conditions',
            },
            {
                id: 'p2-c4-ch2',
                chapterId: 4,
                challengeNumber: 2,
                title: 'Even or Odd Number',
                difficulty: 'Easy',
                xpReward: 20,
                description: 'Given `number = 28`, use modulus `%` to check if it is even or odd. Print "Even" or "Odd".',
                instructions: ['Test number % 2 == 0.', 'Print "Even" if divisible by 2, else "Odd".'],
                starterCode: 'number = 28\n# Check even or odd:\n',
                solutionCode: 'number = 28\nif number % 2 == 0:\n    print("Even")\nelse:\n    print("Odd")',
                solutionExplanation: '28 % 2 equals 0, so it prints Even.',
                hints: [
                    { level: 1, title: 'Concept', content: 'Use the modulus operator %.' },
                    { level: 2, title: 'Approach', content: 'if number % 2 == 0:' },
                    { level: 3, title: 'Pseudocode', content: 'if number % 2 == 0: print("Even") else: print("Odd")' },
                    { level: 4, title: 'Detailed Guidance', content: '28 is divisible by 2.' },
                ],
                testCases: [{ expectedOutput: 'Even', description: 'Outputs Even for number=28' }],
                topicCategory: 'conditions',
            },
            {
                id: 'p2-c4-ch3',
                chapterId: 4,
                challengeNumber: 3,
                title: 'Positive, Negative, or Zero',
                difficulty: 'Easy',
                xpReward: 20,
                description: 'Given `num = -5`, classify it as "Positive", "Negative", or "Zero".',
                instructions: ['Use if-elif-else to test > 0, < 0, and else.'],
                starterCode: 'num = -5\n# Classify sign:\n',
                solutionCode: 'num = -5\nif num > 0:\n    print("Positive")\nelif num < 0:\n    print("Negative")\nelse:\n    print("Zero")',
                solutionExplanation: '-5 is less than 0, so it prints Negative.',
                hints: [
                    { level: 1, title: 'Concept', content: 'Use a 3-way if-elif-else chain.' },
                    { level: 2, title: 'Approach', content: 'Check num > 0, num < 0, else.' },
                    { level: 3, title: 'Pseudocode', content: 'if num > 0: ... elif num < 0: ... else: ...' },
                    { level: 4, title: 'Detailed Guidance', content: 'Prints "Negative".' },
                ],
                testCases: [{ expectedOutput: 'Negative', description: 'Outputs Negative for num=-5' }],
                topicCategory: 'conditions',
            },
            {
                id: 'p2-c4-ch4',
                chapterId: 4,
                challengeNumber: 4,
                title: 'Largest of Two Numbers',
                difficulty: 'Easy',
                xpReward: 20,
                description: 'Given `a = 45` and `b = 78`, find and print the larger number.',
                instructions: ['Compare a and b with >.', 'Print the larger value.'],
                starterCode: 'a = 45\nb = 78\n# Print the maximum:\n',
                solutionCode: 'a = 45\nb = 78\nif a > b:\n    print(a)\nelse:\n    print(b)',
                solutionExplanation: 'Compares a and b and outputs 78.',
                hints: [
                    { level: 1, title: 'Concept', content: 'Compare a > b.' },
                    { level: 2, title: 'Approach', content: 'if a > b print a, else print b.' },
                    { level: 3, title: 'Pseudocode', content: 'if a > b: print(a) else: print(b)' },
                    { level: 4, title: 'Detailed Guidance', content: '78 is larger.' },
                ],
                testCases: [{ expectedOutput: '78', description: 'Outputs 78' }],
                topicCategory: 'conditions',
            },
            {
                id: 'p2-c4-ch5',
                chapterId: 4,
                challengeNumber: 5,
                title: 'Largest of Three Numbers',
                difficulty: 'Medium',
                xpReward: 35,
                description: 'Given `x = 50`, `y = 85`, `z = 65`, determine and print the largest of the three numbers.',
                instructions: [
                    'Use logical `and` in if-elif statements.',
                    'Check if x is largest, then if y is largest, else z is largest.',
                    'Print the maximum value.',
                ],
                starterCode: 'x = 50\ny = 85\nz = 65\n# Find largest of three:\n',
                solutionCode: 'x = 50\ny = 85\nz = 65\nif x >= y and x >= z:\n    print(x)\nelif y >= x and y >= z:\n    print(y)\nelse:\n    print(z)',
                solutionExplanation: 'Compares each candidate with the other two using logical and.',
                hints: [
                    { level: 1, title: 'Concept', content: 'Combine conditions using `and`.' },
                    { level: 2, title: 'Approach', content: 'if x >= y and x >= z: print(x)...' },
                    { level: 3, title: 'Pseudocode', content: 'if x>=y and x>=z: print(x) elif y>=x and y>=z: print(y) else: print(z)' },
                    { level: 4, title: 'Detailed Guidance', content: '85 is largest.' },
                ],
                testCases: [{ expectedOutput: '85', description: 'Outputs 85' }],
                topicCategory: 'conditions',
            },
            {
                id: 'p2-c4-ch6',
                chapterId: 4,
                challengeNumber: 6,
                title: 'Grade Calculator Engine',
                difficulty: 'Medium',
                xpReward: 35,
                description: 'Given `marks = 84`, assign `grade` as follows: >=90 is "A+", >=80 is "A", >=70 is "B", >=60 is "C", otherwise "F". Print `grade`.',
                instructions: ['Use if-elif-else chain.', 'Print the grade.'],
                starterCode: 'marks = 84\n# Calculate grade:\n',
                solutionCode: 'marks = 84\nif marks >= 90:\n    grade = "A+"\nelif marks >= 80:\n    grade = "A"\nelif marks >= 70:\n    grade = "B"\nelif marks >= 60:\n    grade = "C"\nelse:\n    grade = "F"\nprint(grade)',
                solutionExplanation: '84 falls into the >= 80 range, resulting in grade "A".',
                hints: [
                    { level: 1, title: 'Concept', content: 'Use sequential elif in descending order.' },
                    { level: 2, title: 'Approach', content: 'if marks >= 90: ... elif marks >= 80: ...' },
                    { level: 3, title: 'Pseudocode', content: 'grade = "A"\\nprint(grade)' },
                    { level: 4, title: 'Detailed Guidance', content: 'Outputs A.' },
                ],
                testCases: [{ expectedOutput: 'A', description: 'Outputs A for marks=84' }],
                topicCategory: 'conditions',
            },
            {
                id: 'p2-c4-ch7',
                chapterId: 4,
                challengeNumber: 7,
                title: 'Leap Year Checker',
                difficulty: 'Medium',
                xpReward: 35,
                description: 'A year is a leap year if `(year % 4 == 0 and year % 100 != 0) or (year % 400 == 0)`. For `year = 2024`, print "Leap Year" if True, else "Standard Year".',
                instructions: ['Apply the leap year mathematical formula.', 'Print "Leap Year" or "Standard Year".'],
                starterCode: 'year = 2024\n# Check leap year:\n',
                solutionCode: 'year = 2024\nif (year % 4 == 0 and year % 100 != 0) or (year % 400 == 0):\n    print("Leap Year")\nelse:\n    print("Standard Year")',
                solutionExplanation: '2024 is divisible by 4 and not 100, so it is a Leap Year.',
                hints: [
                    { level: 1, title: 'Concept', content: 'Combine modulus checks with and / or.' },
                    { level: 2, title: 'Approach', content: 'if (year % 4 == 0 and year % 100 != 0) or (year % 400 == 0):' },
                    { level: 3, title: 'Pseudocode', content: 'print("Leap Year")' },
                    { level: 4, title: 'Detailed Guidance', content: '2024 is a leap year.' },
                ],
                testCases: [{ expectedOutput: 'Leap Year', description: 'Outputs Leap Year for 2024' }],
                topicCategory: 'conditions',
            },
            {
                id: 'p2-c4-ch8',
                chapterId: 4,
                challengeNumber: 8,
                title: 'Simple Login Authenticator',
                difficulty: 'Medium',
                xpReward: 35,
                description: 'Given `username = "admin"` and `password = "pass123"`. If `username == "admin" and password == "pass123"`, print "Login Successful". Otherwise print "Invalid Credentials".',
                instructions: ['Check both username and password with `and`.', 'Print the authentication status.'],
                starterCode: 'username = "admin"\npassword = "pass123"\n# Authenticate login:\n',
                solutionCode: 'username = "admin"\npassword = "pass123"\nif username == "admin" and password == "pass123":\n    print("Login Successful")\nelse:\n    print("Invalid Credentials")',
                solutionExplanation: 'Both credentials match, so Login Successful is printed.',
                hints: [
                    { level: 1, title: 'Concept', content: 'Use the == and `and` operator.' },
                    { level: 2, title: 'Approach', content: 'if username == "admin" and password == "pass123":' },
                    { level: 3, title: 'Pseudocode', content: 'print("Login Successful")' },
                    { level: 4, title: 'Detailed Guidance', content: 'Both strings must match.' },
                ],
                testCases: [{ expectedOutput: 'Login Successful', description: 'Outputs Login Successful' }],
                topicCategory: 'conditions',
            },
            {
                id: 'p2-c4-ch9',
                chapterId: 4,
                challengeNumber: 9,
                title: 'Shopping Discount Calculator',
                difficulty: 'Hard',
                xpReward: 50,
                description: 'A store offers discounts based on total purchase amount:\n- If `cart >= 200`: 20% discount (0.20)\n- Else if `cart >= 100`: 10% discount (0.10)\n- Otherwise: 0% discount\nGiven `cart = 150`, calculate `final_amount = cart - (cart * discount_rate)` and print `final_amount`.',
                instructions: ['Determine discount_rate using if-elif-else.', 'Calculate and print final_amount.'],
                starterCode: 'cart = 150\n# Calculate final amount with discount:\n',
                solutionCode: 'cart = 150\nif cart >= 200:\n    rate = 0.20\nelif cart >= 100:\n    rate = 0.10\nelse:\n    rate = 0.0\nfinal_amount = cart - (cart * rate)\nprint(final_amount)',
                solutionExplanation: '150 qualifies for 10% discount: 150 - 15 = 135.0.',
                hints: [
                    { level: 1, title: 'Concept', content: 'Find the rate first, then compute discount.' },
                    { level: 2, title: 'Approach', content: 'final_amount = cart - (cart * rate)' },
                    { level: 3, title: 'Pseudocode', content: 'rate = 0.10\\nprint(135.0)' },
                    { level: 4, title: 'Detailed Guidance', content: '150 - (150 * 0.10) = 135.0.' },
                ],
                testCases: [{ expectedOutput: '135.0', description: 'Outputs 135.0' }],
                topicCategory: 'conditions',
            },
            {
                id: 'p2-c4-ch10',
                chapterId: 4,
                challengeNumber: 10,
                title: 'Placement Eligibility Checker',
                difficulty: 'Hard',
                xpReward: 50,
                description: 'A candidate is eligible for placement interviews if `cgpa >= 7.5 and backlogs == 0`. Given `cgpa = 8.2` and `backlogs = 0`, print "Eligible for Placement". Otherwise print "Not Eligible".',
                instructions: ['Check both criteria.', 'Print eligibility message.'],
                starterCode: 'cgpa = 8.2\nbacklogs = 0\n# Check placement eligibility:\n',
                solutionCode: 'cgpa = 8.2\nbacklogs = 0\nif cgpa >= 7.5 and backlogs == 0:\n    print("Eligible for Placement")\nelse:\n    print("Not Eligible")',
                solutionExplanation: 'Candidate has 8.2 CGPA and 0 backlogs, so Eligible for Placement is printed.',
                hints: [
                    { level: 1, title: 'Concept', content: 'Use `and` to enforce both conditions.' },
                    { level: 2, title: 'Approach', content: 'if cgpa >= 7.5 and backlogs == 0:' },
                    { level: 3, title: 'Pseudocode', content: 'print("Eligible for Placement")' },
                    { level: 4, title: 'Detailed Guidance', content: 'Both must be true.' },
                ],
                testCases: [{ expectedOutput: 'Eligible for Placement', description: 'Outputs Eligible for Placement' }],
                topicCategory: 'conditions',
            },
        ],
        quiz: {
            chapterId: 4,
            title: 'Chapter 4 Quiz: Decision Control & Conditionals',
            description: 'Evaluate your grasp of if-else branching, Boolean truth tables, comparisons, and nested conditions.',
            passingScorePercent: 70,
            xpReward: 100,
            questions: [
                {
                    id: 'q4-1',
                    question: 'What is the value of `True and False` in Python?',
                    type: 'predict_output',
                    options: ['True', 'False', 'None', 'Error'],
                    correctAnswer: 1,
                    explanation: '`and` requires both operands to be True.',
                    topic: 'booleans',
                },
                {
                    id: 'q4-2',
                    question: 'What is the output of the following code?\nx = 15\nif x > 20:\n    print("A")\nelif x > 10:\n    print("B")\nelse:\n    print("C")',
                    codeSnippet: 'x = 15\nif x > 20:\n    print("A")\nelif x > 10:\n    print("B")\nelse:\n    print("C")',
                    type: 'predict_output',
                    options: ['A', 'B', 'C', 'B and C'],
                    correctAnswer: 1,
                    explanation: '15 > 20 is False. 15 > 10 is True, so "B" is printed and execution finishes.',
                    topic: 'conditions',
                },
                {
                    id: 'q4-3',
                    question: 'Which operator checks for inequality between two values?',
                    type: 'mcq',
                    options: ['!=', '<>', 'not =', '!=='],
                    correctAnswer: 0,
                    explanation: '`!=` is Python\'s inequality operator.',
                    topic: 'conditions',
                },
                {
                    id: 'q4-4',
                    question: 'What does `14 % 4` evaluate to?',
                    type: 'predict_output',
                    options: ['3.5', '2', '3', '0'],
                    correctAnswer: 1,
                    explanation: '14 divided by 4 is 3 with remainder 2.',
                    topic: 'conditions',
                },
                {
                    id: 'q4-5',
                    question: 'How do you check if a number `n` is odd in Python?',
                    type: 'mcq',
                    options: ['n % 2 != 0', 'n % 2 == 0', 'n // 2 == 1', 'n / 2 == 1'],
                    correctAnswer: 0,
                    explanation: 'An odd number leaves a non-zero remainder (1) when divided by 2.',
                    topic: 'conditions',
                },
                {
                    id: 'q4-6',
                    question: 'What is the output of `not (10 == 10)`?',
                    type: 'predict_output',
                    options: ['True', 'False', '10', 'None'],
                    correctAnswer: 1,
                    explanation: '10 == 10 is True. not True is False.',
                    topic: 'booleans',
                },
                {
                    id: 'q4-7',
                    question: 'What character is required at the end of an if/elif/else line?',
                    type: 'conceptual',
                    options: ['; (semicolon)', ': (colon)', '{ (curly brace)', 'then'],
                    correctAnswer: 1,
                    explanation: 'Colons (:) are mandatory after compound header statements in Python.',
                    topic: 'conditions',
                },
                {
                    id: 'q4-8',
                    question: 'What is the result of `False or (True and True)`?',
                    type: 'predict_output',
                    options: ['True', 'False', 'None', 'Error'],
                    correctAnswer: 0,
                    explanation: 'True and True is True. False or True evaluates to True.',
                    topic: 'booleans',
                },
                {
                    id: 'q4-9',
                    question: 'What error is raised if code inside an if block is not indented?',
                    type: 'identify_error',
                    options: ['SyntaxError: invalid keyword', 'IndentationError: expected an indented block', 'NameError', 'ValueError'],
                    correctAnswer: 1,
                    explanation: 'Python requires indented blocks after colons.',
                    topic: 'debugging',
                },
                {
                    id: 'q4-10',
                    question: 'What is printed by this code?\nscore = 75\nif score >= 90:\n    print("A")\nif score >= 70:\n    print("B")',
                    codeSnippet: 'score = 75\nif score >= 90:\n    print("A")\nif score >= 70:\n    print("B")',
                    type: 'predict_output',
                    options: ['B', 'A and B', 'Nothing', 'A'],
                    correctAnswer: 0,
                    explanation: 'These are two separate independent `if` statements. The second `if` (75 >= 70) is True and prints "B".',
                    topic: 'conditions',
                },
                {
                    id: 'q4-11',
                    question: 'Which logical operator has the highest precedence?',
                    type: 'conceptual',
                    options: ['or', 'and', 'not', 'All equal'],
                    correctAnswer: 2,
                    explanation: '`not` takes precedence over `and`, which takes precedence over `or`.',
                    topic: 'booleans',
                },
                {
                    id: 'q4-12',
                    question: 'What is the output of `print(bool(0))` in Python?',
                    type: 'predict_output',
                    options: ['True', 'False', '0', 'None'],
                    correctAnswer: 1,
                    explanation: '0 is considered "falsy" in Python, so `bool(0)` is False.',
                    topic: 'booleans',
                },
                {
                    id: 'q4-13',
                    question: 'A conditional statement placed inside another conditional statement is called what?',
                    type: 'conceptual',
                    options: ['Recursive conditional', 'Nested conditional', 'Parallel conditional', 'Chained loop'],
                    correctAnswer: 1,
                    explanation: 'An `if` statement inside another `if` is called a nested conditional.',
                    topic: 'conditions',
                },
                {
                    id: 'q4-14',
                    question: 'What is the output of `5 > 3 == True` in Python?',
                    type: 'predict_output',
                    options: ['True', 'False', 'SyntaxError'],
                    correctAnswer: 1,
                    explanation: 'Python chains comparisons: `5 > 3 and 3 == True` -> `True and False` -> False.',
                    topic: 'booleans',
                },
                {
                    id: 'q4-15',
                    question: 'Why does Python stop checking remaining `elif` branches once a True branch is found?',
                    type: 'conceptual',
                    options: [
                        'Because if-elif-else is designed for mutually exclusive single-path selection',
                        'Because the CPU stops working',
                        'It does not stop; it runs all branches',
                    ],
                    correctAnswer: 0,
                    explanation: 'The if-elif-else construct executes at most one matching branch.',
                    topic: 'conditions',
                },
            ],
        },
    },

    // ══════════════════════════════════════════════════════════════════════
    // CHAPTER 5 — RANDOM NUMBERS
    // ══════════════════════════════════════════════════════════════════════
    {
        id: 5,
        chapterNumber: 5,
        title: 'Random Numbers',
        subtitle: 'Harness Python\'s random module for game simulations, dice rolls, coin tosses, and unpredictable values.',
        description: 'Understand the random module, randint(), randrange(), random.choice(), combining randomness with conditional logic, and building interactive games.',
        estimatedMinutes: 90,
        xpReward: 100,
        badgeName: 'Random Explorer',
        badgeIcon: '🎲',
        lessons: [
            {
                id: 'p2-c5-l1',
                chapterId: 5,
                lessonNumber: 1,
                title: 'What Are Random Numbers?',
                description: 'Discover how randomness powers games, simulations, testing, and security.',
                durationMinutes: 6,
                xpReward: 10,
                topics: ['Randomness', 'Simulations', 'Game Mechanics'],
                whatYoullLearn: [
                    'What pseudo-random numbers are in computer science',
                    'Why software needs randomness (games, dice rolls, shuffling playlists, AI training)',
                    'How Python generates unpredictable outcomes',
                ],
                concept: 'A random number is a value generated in a way that makes its next result difficult to predict. In computer software, pseudo-random generators use mathematical algorithms to produce sequences that appear completely random.',
                whyItMatters: 'Every game (dice rolls, card shuffles, enemy spawns) and security system (OTP generation, encryption keys) depends on random numbers.',
                visualDiagram: {
                    type: 'flowchart',
                    title: 'Random Generation Pipeline',
                    diagramText: `+------------------------+
|  Call random generator |
+------------------------+
            |
            v
     [ Dice: 1 to 6 ]
     /   |   |   |   \\
    1    2   3   4    5   6
            |
            v
 [ Unpredictable Result: 4 ]`,
                },
                syntax: '# In Python, we import the built-in random library:\nimport random',
                exampleCode: 'import random\n# Generates random integer between 1 and 6 (inclusive)\nroll = random.randint(1, 6)\nprint("You rolled a:", roll)',
                expectedOutput: 'You rolled a: [Random number 1-6]',
                stepByStepExplanation: [
                    '1. `import random` loads Python\'s built-in randomness module.',
                    '2. `random.randint(1, 6)` generates an integer between 1 and 6 inclusive.',
                    '3. Each time the program runs, a new unpredictable number is printed.',
                ],
                interactiveStarterCode: 'import random\nnum = random.randint(1, 100)\nprint("Random number between 1 and 100:", num)',
                quickCheck: [
                    {
                        question: 'Which Python module is used to generate random values?',
                        options: ['math', 'random', 'time', 'os'],
                        correctAnswer: 1,
                        explanation: 'Python\'s standard library module for randomness is `random`.',
                    },
                ],
                miniChallenge: {
                    title: 'Generate a Random Dice Roll',
                    instruction: 'Import random and print a random integer between 1 and 6 using `random.randint(1, 6)`.',
                    starterCode: '# Generate dice roll:\n',
                    expectedOutputSnippet: '',
                    testCases: [
                        { expectedOutput: '', description: 'Generates number between 1 and 6', regexPattern: '^[1-6]$' },
                    ],
                    hint: 'import random\nprint(random.randint(1, 6))',
                },
            },
            {
                id: 'p2-c5-l2',
                chapterId: 5,
                lessonNumber: 2,
                title: 'The random Module & import',
                description: 'Understand Python modules and how import unlocks specialized toolkits.',
                durationMinutes: 6,
                xpReward: 10,
                topics: ['import Keyword', 'Standard Library', 'Module Namespaces'],
                whatYoullLearn: [
                    'What a module is (a Python file containing pre-written functions and tools)',
                    'How `import random` makes randomness functions accessible',
                    'Using the dot notation: `random.function_name()`',
                ],
                concept: 'Python comes with a "batteries included" philosophy. A **module** is a library of pre-written functions. By typing `import random`, you bring all random number tools into your program under the `random.` namespace.',
                whyItMatters: 'Modular programming lets developers reuse battle-tested libraries without writing complex math from scratch.',
                syntax: 'import random\n\n# Access functions with dot notation:\nrandom.randint(1, 10)\nrandom.choice(["A", "B"])',
                exampleCode: 'import random\nval = random.randint(10, 20)\nprint("Generated in range [10, 20]:", val)',
                expectedOutput: 'Generated in range [10, 20]: [Number 10-20]',
                interactiveStarterCode: 'import random\nprint("Imported random successfully!")',
                quickCheck: [
                    {
                        question: 'What keyword brings an external Python module into your script?',
                        options: ['include', 'import', 'require', 'using'],
                        correctAnswer: 1,
                        explanation: '`import` is the Python keyword to load modules.',
                    },
                ],
                miniChallenge: {
                    title: 'Import and Call randint',
                    instruction: 'Write `import random` and print `random.randint(50, 60)`.',
                    starterCode: '# Import and call randint:\n',
                    expectedOutputSnippet: '',
                    testCases: [{ expectedOutput: '', description: 'Returns integer in 50-60', regexPattern: '^5[0-9]|60$' }],
                    hint: 'import random\nprint(random.randint(50, 60))',
                },
            },
            {
                id: 'p2-c5-l3',
                chapterId: 5,
                lessonNumber: 3,
                title: 'random.randint(a, b)',
                description: 'Generate inclusive random integers where both endpoints a and b can be chosen.',
                durationMinutes: 7,
                xpReward: 10,
                topics: ['random.randint', 'Inclusive Range', 'Integer Generation'],
                whatYoullLearn: [
                    'How `randint(a, b)` returns an integer $N$ such that $a \\le N \\le b$',
                    'Why both endpoints are INCLUSIVE in randint',
                    'Generating random scores, lottery numbers, and counters',
                ],
                concept: 'The function `random.randint(a, b)` generates a random integer between `a` and `b`, **including both `a` and `b`**.',
                whyItMatters: 'When simulating a 6-sided dice, `random.randint(1, 6)` can return 1, 2, 3, 4, 5, or 6.',
                visualDiagram: {
                    type: 'number_line',
                    title: 'randint(1, 6) Inclusive Range',
                    description: 'Both start (1) and stop (6) can be produced.',
                    data: {
                        start: 1,
                        stop: 6,
                        step: 1,
                    },
                },
                syntax: 'import random\nnumber = random.randint(start, end)  # Both start and end are inclusive',
                exampleCode: 'import random\nlottery = random.randint(1000, 9999)\nprint("4-Digit Lucky Code:", lottery)',
                expectedOutput: '4-Digit Lucky Code: [Random 1000-9999]',
                interactiveStarterCode: 'import random\ncard = random.randint(1, 13)\nprint("Card Value:", card)',
                quickCheck: [
                    {
                        question: 'Can `random.randint(1, 5)` return the number 5?',
                        options: ['Yes, both endpoints are inclusive', 'No, 5 is excluded', 'Only on weekends'],
                        correctAnswer: 0,
                        explanation: '`randint(a, b)` is fully inclusive of both endpoints a and b.',
                    },
                ],
                miniChallenge: {
                    title: 'Generate Lucky Number 1-10',
                    instruction: 'Create variable `lucky = random.randint(1, 10)` and print `lucky`.',
                    starterCode: 'import random\n# Generate lucky number:\n',
                    expectedOutputSnippet: '',
                    testCases: [{ expectedOutput: '', description: 'Returns 1-10', regexPattern: '^[1-9]|10$' }],
                    hint: 'import random\nlucky = random.randint(1, 10)\nprint(lucky)',
                },
            },
            {
                id: 'p2-c5-l4',
                chapterId: 5,
                lessonNumber: 4,
                title: 'random.randrange(start, stop, step)',
                description: 'Generate random numbers with standard Python half-open intervals (stop excluded) and step increments.',
                durationMinutes: 7,
                xpReward: 10,
                topics: ['random.randrange', 'Exclusive Stop', 'Step Parameter'],
                whatYoullLearn: [
                    'The difference between `randint(1, 10)` (inclusive) and `randrange(1, 10)` (excludes 10)',
                    'Using the `step` parameter (e.g. random even numbers: `randrange(0, 100, 2)`)',
                    'Comparing `randrange` with the `range()` function',
                ],
                concept: '`random.randrange()` behaves like Python\'s `range()` function: the `stop` value is **excluded**. For example, `randrange(1, 10)` produces numbers from 1 to 9, never 10. You can also specify a step: `randrange(0, 10, 2)` produces only even numbers (0, 2, 4, 6, 8).',
                whyItMatters: 'Use `randrange` whenever you need stepped intervals like random even numbers or increments of 5.',
                visualDiagram: {
                    type: 'table',
                    title: 'randint vs randrange Comparison',
                    data: {
                        headers: ['Function', 'Syntax', 'Possible Values for (1, 5)'],
                        rows: [
                            ['randint', 'random.randint(1, 5)', '1, 2, 3, 4, 5 (Inclusive)'],
                            ['randrange', 'random.randrange(1, 5)', '1, 2, 3, 4 (5 Excluded)'],
                            ['randrange with step', 'random.randrange(0, 10, 2)', '0, 2, 4, 6, 8 (Even only)'],
                        ],
                    },
                },
                syntax: 'import random\nval = random.randrange(stop)\nval = random.randrange(start, stop)\nval = random.randrange(start, stop, step)',
                exampleCode: 'import random\neven_rand = random.randrange(0, 20, 2)\nprint("Random Even Number < 20:", even_rand)',
                expectedOutput: 'Random Even Number < 20: [Even 0, 2, 4... 18]',
                interactiveStarterCode: 'import random\n# Generates random multiple of 5 between 10 and 50\nnum = random.randrange(10, 50, 5)\nprint("Multiple of 5:", num)',
                quickCheck: [
                    {
                        question: 'What is the maximum possible return value of `random.randrange(1, 10)`?',
                        options: ['10', '9', '11', '8'],
                        correctAnswer: 1,
                        explanation: '`randrange(1, 10)` excludes the stop value 10, so the maximum possible output is 9.',
                    },
                ],
                miniChallenge: {
                    title: 'Random Even Number with randrange',
                    instruction: 'Generate and print a random even number between 2 and 20 using `random.randrange(2, 20, 2)`.',
                    starterCode: 'import random\n# Generate even number:\n',
                    expectedOutputSnippet: '',
                    testCases: [{ expectedOutput: '', description: 'Returns even number 2-18', regexPattern: '^(2|4|6|8|10|12|14|16|18)$' }],
                    hint: 'import random\nprint(random.randrange(2, 20, 2))',
                },
            },
            {
                id: 'p2-c5-l5',
                chapterId: 5,
                lessonNumber: 5,
                title: 'random.choice()',
                description: 'Pick a random element from a sequence or list of items.',
                durationMinutes: 7,
                xpReward: 10,
                topics: ['random.choice', 'Sequence Selection', 'Lists & Strings'],
                whatYoullLearn: [
                    'How `random.choice(sequence)` picks a single item at random',
                    'Selecting from lists of strings (e.g. `["Rock", "Paper", "Scissors"]`)',
                    'Selecting a random character from a text string',
                ],
                concept: 'The function `random.choice(sequence)` randomly selects and returns a single element from a collection (such as a list of colors or words).',
                whyItMatters: 'Used for randomized games (Rock-Paper-Scissors, coin flips), picking random trivia questions, or selecting prize winners.',
                visualDiagram: {
                    type: 'flowchart',
                    title: 'random.choice Selection Flow',
                    diagramText: `["Red", "Blue", "Green", "Yellow"]
                |
                v [random.choice()]
         /--------------\\
        |  Random Pick  |
         \\--------------/
                |
                v
            "Green"`,
                },
                syntax: 'import random\nitems = ["Heads", "Tails"]\nresult = random.choice(items)',
                exampleCode: 'import random\ncolors = ["Ruby Red", "Ocean Blue", "Emerald Green"]\npicked = random.choice(colors)\nprint("Selected Color:", picked)',
                expectedOutput: 'Selected Color: [One of the 3 colors]',
                interactiveStarterCode: 'import random\noptions = ["Rock", "Paper", "Scissors"]\ncomputer_move = random.choice(options)\nprint("Computer chose:", computer_move)',
                quickCheck: [
                    {
                        question: 'What does `random.choice(["A", "B", "C"])` do?',
                        options: [
                            'Returns all 3 letters joined together',
                            'Selects and returns a single random element ("A", "B", or "C")',
                            'Sorts the letters in reverse order',
                        ],
                        correctAnswer: 1,
                        explanation: '`choice()` randomly returns a single item from the provided collection.',
                    },
                ],
                miniChallenge: {
                    title: 'Pick a Random Coin Side',
                    instruction: 'Given `coin = ["Heads", "Tails"]`, print a random choice using `random.choice(coin)`.',
                    starterCode: 'import random\ncoin = ["Heads", "Tails"]\n# Pick random coin side:\n',
                    expectedOutputSnippet: '',
                    testCases: [{ expectedOutput: '', description: 'Returns Heads or Tails', regexPattern: '^(Heads|Tails)$' }],
                    hint: 'import random\ncoin = ["Heads", "Tails"]\nprint(random.choice(coin))',
                },
            },
            {
                id: 'p2-c5-l6',
                chapterId: 5,
                lessonNumber: 6,
                title: 'Random Boolean Logic & Coin Toss',
                description: 'Combine random generation with conditional if-else statements to build interactive simulations.',
                durationMinutes: 7,
                xpReward: 10,
                topics: ['Coin Toss Simulator', 'Random Conditions', 'Game Outcomes'],
                whatYoullLearn: [
                    'How to branch program execution based on a random outcome',
                    'Simulating a virtual coin flip',
                    'Writing win / loss condition checks',
                ],
                concept: 'By combining `random.choice()` with an `if-else` statement, your program can respond dynamically to unpredictable game events.',
                whyItMatters: 'This is the foundation for all video game random number generation (RNG) and AI decisions.',
                visualDiagram: {
                    type: 'flowchart',
                    title: 'Coin Toss Game Flowchart',
                    diagramText: `     +--------------------------+
     | coin = random.choice(...) |
     +--------------------------+
                  |
                  v
       /----------------------\\
      /    coin == "Heads" ?   \\
      \\                        /
       \\----------------------/
          /              \\
       YES                NO
        |                  |
        v                  v
+---------------+  +---------------+
| Print "WIN!"  |  | Print "LOSE"  |
+---------------+  +---------------+`,
                },
                syntax: 'import random\nflip = random.choice(["Heads", "Tails"])\nif flip == "Heads":\n    print("You Win!")\nelse:\n    print("Try Again")',
                exampleCode: 'import random\ncoin = random.choice(["Heads", "Tails"])\nprint("Coin landed on:", coin)\nif coin == "Heads":\n    print("Player Wins!")\nelse:\n    print("Computer Wins!")',
                expectedOutput: 'Coin landed on: [Heads/Tails]\n[Player/Computer] Wins!',
                interactiveStarterCode: 'import random\noutcome = random.choice(["Critical Hit 💥", "Standard Hit ⚔️", "Miss ❌"])\nprint("Attack Result:", outcome)',
                quickCheck: [
                    {
                        question: 'Why do we combine `random` with `if-else` in games?',
                        options: [
                            'To make the game respond dynamically to unpredictable random events',
                            'To slow down the processor',
                            'To replace standard input',
                        ],
                        correctAnswer: 0,
                        explanation: 'Randomness provides uncertainty, and if-else logic handles the resulting outcomes.',
                    },
                ],
                miniChallenge: {
                    title: 'Coin Flip Win Checker',
                    instruction: 'Create `coin = random.choice(["Heads", "Tails"])`. If `coin == "Heads"`, print "Winner". Otherwise print "Loser".',
                    starterCode: 'import random\n# Write coin flip win check:\n',
                    expectedOutputSnippet: '',
                    testCases: [{ expectedOutput: '', description: 'Outputs Winner or Loser', regexPattern: '^(Winner|Loser)$' }],
                    hint: 'import random\ncoin = random.choice(["Heads", "Tails"])\nif coin == "Heads":\n    print("Winner")\nelse:\n    print("Loser")',
                },
            },
            {
                id: 'p2-c5-l7',
                chapterId: 5,
                lessonNumber: 7,
                title: 'The Number Guessing Game Logic',
                description: 'Deconstruct the logic behind guessing games: secret generation, comparison, and hints.',
                durationMinutes: 8,
                xpReward: 10,
                topics: ['Guessing Game Logic', 'High / Low Hints', 'Comparison Feedback'],
                whatYoullLearn: [
                    'How the computer picks a hidden secret number',
                    'Comparing a player\'s guess with the secret: `guess == secret`, `guess > secret`, `guess < secret`',
                    'Providing directional hints: "Too High" vs "Too Low"',
                ],
                concept: 'In a number guessing game, the computer generates a secret integer (e.g. `secret = random.randint(1, 50)`). The player submits a guess. The program compares the guess with the secret using an `if-elif-else` structure to provide hints.',
                whyItMatters: 'Demonstrates binary search intuition and range narrowing in algorithms.',
                visualDiagram: {
                    type: 'flowchart',
                    title: 'Number Guessing Comparison Logic',
                    diagramText: `       /--------------------\\
      /   guess == secret ?  \\ --- YES ---> [ "Correct! You Win 🎉" ]
      \\                      /
       \\--------------------/
                 | NO
                 v
       /--------------------\\
      /    guess > secret ?  \\ --- YES ---> [ "Too High! ⬇️" ]
      \\                      /
       \\--------------------/
                 | NO
                 v
      [ "Too Low! ⬆️" ]`,
                },
                syntax: 'secret = random.randint(1, 100)\nif guess == secret:\n    print("Correct!")\nelif guess > secret:\n    print("Too High")\nelse:\n    print("Too Low")',
                exampleCode: 'secret = 42\nguess = 50\nif guess == secret:\n    print("Correct! 🎉")\nelif guess > secret:\n    print("Too High! Guess lower.")\nelse:\n    print("Too Low! Guess higher.")',
                expectedOutput: 'Too High! Guess lower.',
                stepByStepExplanation: [
                    '1. Secret number is 42, player guessed 50.',
                    '2. `guess == secret` (50 == 42) is False.',
                    '3. `guess > secret` (50 > 42) is True -> prints "Too High! Guess lower.".',
                ],
                interactiveStarterCode: 'secret = 25\nmy_guess = 20\nif my_guess == secret:\n    print("Jackpot!")\nelif my_guess < secret:\n    print("Too Low! Aim higher.")\nelse:\n    print("Too High!")',
                quickCheck: [
                    {
                        question: 'If `secret = 30` and `guess = 45`, what feedback should the program give?',
                        options: ['Too Low', 'Too High', 'Correct', 'Error'],
                        correctAnswer: 1,
                        explanation: 'Since 45 > 30, the guess is Too High.',
                    },
                ],
                miniChallenge: {
                    title: 'Compare Guess with Secret',
                    instruction: 'Given `secret = 15` and `guess = 15`. If `guess == secret`, print "Correct Guess". Otherwise print "Wrong Guess".',
                    starterCode: 'secret = 15\nguess = 15\n# Compare guess:\n',
                    expectedOutputSnippet: 'Correct Guess',
                    testCases: [{ expectedOutput: 'Correct Guess', description: 'Outputs Correct Guess' }],
                    hint: 'if guess == secret:\n    print("Correct Guess")\nelse:\n    print("Wrong Guess")',
                },
            },
            {
                id: 'p2-c5-l8',
                chapterId: 5,
                lessonNumber: 8,
                title: 'Building a Dice Simulator',
                description: 'Simulate rolling two dice and calculating sum combinations.',
                durationMinutes: 7,
                xpReward: 10,
                topics: ['Dice Rolling', 'Multiple Random Values', 'Sum Combinations'],
                whatYoullLearn: [
                    'Simulating multiple independent dice rolls (`die1` and `die2`)',
                    'Summing dice values and detecting special outcomes (like rolling a pair/doubles)',
                    'Formatting board game mechanics',
                ],
                concept: 'In board games like Monopoly, two 6-sided dice are rolled simultaneously. Each die is an independent random event (`random.randint(1, 6)`). The total score is the sum of both dice.',
                whyItMatters: 'Demonstrates simulating multiple independent probabilistic events in Python.',
                syntax: 'die1 = random.randint(1, 6)\ndie2 = random.randint(1, 6)\ntotal = die1 + die2',
                exampleCode: 'import random\ndie1 = random.randint(1, 6)\ndie2 = random.randint(1, 6)\ntotal = die1 + die2\nprint("Die 1:", die1)\nprint("Die 2:", die2)\nprint("Total:", total)\nif die1 == die2:\n    print("Doubles Rolled! 🎲🎲")',
                expectedOutput: 'Die 1: [1-6]\nDie 2: [1-6]\nTotal: [2-12]',
                interactiveStarterCode: 'import random\nd1 = random.randint(1, 6)\nd2 = random.randint(1, 6)\nprint("Rolled:", d1, "+", d2, "=", d1 + d2)',
                quickCheck: [
                    {
                        question: 'What is the minimum and maximum possible sum of rolling two standard 6-sided dice?',
                        options: ['1 to 12', '2 to 12', '0 to 12', '2 to 6'],
                        correctAnswer: 1,
                        explanation: 'Minimum is 1 + 1 = 2; maximum is 6 + 6 = 12.',
                    },
                ],
                miniChallenge: {
                    title: 'Simulate Two Dice',
                    instruction: 'Create `d1 = random.randint(1, 6)` and `d2 = random.randint(1, 6)`. Print their sum `d1 + d2`.',
                    starterCode: 'import random\n# Roll two dice and print sum:\n',
                    expectedOutputSnippet: '',
                    testCases: [{ expectedOutput: '', description: 'Outputs sum between 2 and 12', regexPattern: '^(2|3|4|5|6|7|8|9|10|11|12)$' }],
                    hint: 'import random\nd1 = random.randint(1, 6)\nd2 = random.randint(1, 6)\nprint(d1 + d2)',
                },
            },
            {
                id: 'p2-c5-l9',
                chapterId: 5,
                lessonNumber: 9,
                title: 'Rock Paper Scissors Game Logic',
                description: 'Construct the decision matrix for the classic Rock-Paper-Scissors game.',
                durationMinutes: 8,
                xpReward: 15,
                topics: ['Rock Paper Scissors', 'Decision Matrix', 'Game Rules'],
                whatYoullLearn: [
                    'The Rock-Paper-Scissors rules: Rock beats Scissors, Scissors beats Paper, Paper beats Rock',
                    'Detecting a Tie when `player == computer`',
                    'Using `and` / `or` to evaluate all winning scenarios cleanly',
                ],
                concept: 'Rock-Paper-Scissors has 3 possible moves. When player and computer choose, there are 3 outcomes: Tie, Player Wins, or Computer Wins. We can check for a Tie first, then check the 3 player winning combinations.',
                whyItMatters: 'A classic computer science project that tests logical combinations and game state evaluation.',
                visualDiagram: {
                    type: 'flowchart',
                    title: 'Rock Paper Scissors Win/Loss Tree',
                    diagramText: `+---------------------------------------+
| Player Choice vs Computer Choice     |
+---------------------------------------+
                   |
                   v
       /-------------------------\\
      /     player == computer?   \\ --- YES ---> [ "It's a Tie! 🤝" ]
      \\                           /
       \\-------------------------/
                   | NO
                   v
       /-------------------------\\
      /   Player Winning Moves?   \\
      |   - Rock beats Scissors   | --- YES ---> [ "Player Wins! 🎉" ]
      |   - Scissors beats Paper  |
      \\   - Paper beats Rock      /
       \\-------------------------/
                   | NO
                   v
          [ "Computer Wins! 💻" ]`,
                },
                syntax: 'if player == computer:\n    result = "Tie"\nelif (player == "Rock" and computer == "Scissors") or \\\n     (player == "Scissors" and computer == "Paper") or \\\n     (player == "Paper" and computer == "Rock"):\n    result = "Player Wins"\nelse:\n    result = "Computer Wins"',
                exampleCode: 'player = "Rock"\ncomputer = "Scissors"\n\nif player == computer:\n    print("Tie!")\nelif (player == "Rock" and computer == "Scissors") or (player == "Scissors" and computer == "Paper") or (player == "Paper" and computer == "Rock"):\n    print("Player Wins!")\nelse:\n    print("Computer Wins!")',
                expectedOutput: 'Player Wins!',
                interactiveStarterCode: 'import random\nmoves = ["Rock", "Paper", "Scissors"]\nplayer = "Paper"\ncomputer = random.choice(moves)\nprint("Player:", player, "| Computer:", computer)',
                quickCheck: [
                    {
                        question: 'If player chooses "Scissors" and computer chooses "Paper", what is the outcome?',
                        options: ['Player Wins', 'Computer Wins', 'Tie'],
                        correctAnswer: 0,
                        explanation: 'Scissors cut Paper, so Player Wins.',
                    },
                ],
                miniChallenge: {
                    title: 'Rock vs Scissors Test',
                    instruction: 'Given `player = "Rock"` and `computer = "Scissors"`. Write conditional code that prints "Player Wins".',
                    starterCode: 'player = "Rock"\ncomputer = "Scissors"\n# Write RPS condition:\n',
                    expectedOutputSnippet: 'Player Wins',
                    testCases: [{ expectedOutput: 'Player Wins', description: 'Outputs Player Wins' }],
                    hint: 'if player == "Rock" and computer == "Scissors":\n    print("Player Wins")',
                },
            },
        ],
        challenges: [
            {
                id: 'p2-c5-ch1',
                chapterId: 5,
                challengeNumber: 1,
                title: 'Random Integer in Range',
                difficulty: 'Easy',
                xpReward: 20,
                description: 'Import `random` and generate a random number between 10 and 20 (inclusive). Print the number.',
                instructions: ['Use random.randint(10, 20).', 'Print the result.'],
                starterCode: '# Generate random integer:\n',
                solutionCode: 'import random\nprint(random.randint(10, 20))',
                solutionExplanation: 'Generates an inclusive random integer between 10 and 20.',
                hints: [
                    { level: 1, title: 'Concept', content: 'Import random module first.' },
                    { level: 2, title: 'Approach', content: 'Use random.randint(10, 20).' },
                    { level: 3, title: 'Pseudocode', content: 'import random\\nprint(random.randint(10, 20))' },
                    { level: 4, title: 'Detailed Guidance', content: 'Generates single integer.' },
                ],
                testCases: [{ expectedOutput: '', description: 'Returns 10-20', regexPattern: '^(1[0-9]|20)$' }],
                topicCategory: 'random',
            },
            {
                id: 'p2-c5-ch2',
                chapterId: 5,
                challengeNumber: 2,
                title: 'Dice Simulator Single Roll',
                difficulty: 'Easy',
                xpReward: 20,
                description: 'Simulate rolling a 6-sided die using `random.randint(1, 6)`. Print "Roll: " followed by the number.',
                instructions: ['Generate number 1-6.', 'Print in format "Roll: X".'],
                starterCode: '# Roll a dice:\n',
                solutionCode: 'import random\nroll = random.randint(1, 6)\nprint("Roll:", roll)',
                solutionExplanation: 'Simulates a 6-sided die roll.',
                hints: [
                    { level: 1, title: 'Concept', content: 'Use random.randint(1, 6).' },
                    { level: 2, title: 'Approach', content: 'print("Roll:", roll)' },
                    { level: 3, title: 'Pseudocode', content: 'import random\\nroll = random.randint(1, 6)\\nprint("Roll:", roll)' },
                    { level: 4, title: 'Detailed Guidance', content: 'Roll must be 1 to 6.' },
                ],
                testCases: [{ expectedOutput: '', description: 'Outputs Roll: 1-6', regexPattern: '^Roll: [1-6]$' }],
                topicCategory: 'random',
            },
            {
                id: 'p2-c5-ch3',
                chapterId: 5,
                challengeNumber: 3,
                title: 'Coin Toss Simulation',
                difficulty: 'Easy',
                xpReward: 20,
                description: 'Use `random.choice(["Heads", "Tails"])` to flip a coin and print the outcome.',
                instructions: ['Define list with "Heads" and "Tails".', 'Print random choice.'],
                starterCode: '# Coin toss simulation:\n',
                solutionCode: 'import random\nprint(random.choice(["Heads", "Tails"]))',
                solutionExplanation: 'Picks Heads or Tails randomly.',
                hints: [
                    { level: 1, title: 'Concept', content: 'Use random.choice.' },
                    { level: 2, title: 'Approach', content: 'random.choice(["Heads", "Tails"])' },
                    { level: 3, title: 'Pseudocode', content: 'print(random.choice(["Heads", "Tails"]))' },
                    { level: 4, title: 'Detailed Guidance', content: 'Prints Heads or Tails.' },
                ],
                testCases: [{ expectedOutput: '', description: 'Outputs Heads or Tails', regexPattern: '^(Heads|Tails)$' }],
                topicCategory: 'random',
            },
            {
                id: 'p2-c5-ch4',
                chapterId: 5,
                challengeNumber: 4,
                title: 'Random Color Selector',
                difficulty: 'Easy',
                xpReward: 25,
                description: 'Pick a random color from `colors = ["Red", "Green", "Blue", "Yellow"]` and print it.',
                instructions: ['Use random.choice with the colors list.', 'Print the picked color.'],
                starterCode: 'import random\ncolors = ["Red", "Green", "Blue", "Yellow"]\n# Select random color:\n',
                solutionCode: 'import random\ncolors = ["Red", "Green", "Blue", "Yellow"]\nprint(random.choice(colors))',
                solutionExplanation: 'Selects one color from the 4 options.',
                hints: [
                    { level: 1, title: 'Concept', content: 'Pass the colors list to random.choice().' },
                    { level: 2, title: 'Approach', content: 'print(random.choice(colors))' },
                    { level: 3, title: 'Pseudocode', content: 'print(random.choice(colors))' },
                    { level: 4, title: 'Detailed Guidance', content: 'Returns Red, Green, Blue, or Yellow.' },
                ],
                testCases: [{ expectedOutput: '', description: 'Returns one of 4 colors', regexPattern: '^(Red|Green|Blue|Yellow)$' }],
                topicCategory: 'random',
            },
            {
                id: 'p2-c5-ch5',
                chapterId: 5,
                challengeNumber: 5,
                title: 'Random Password Character',
                difficulty: 'Medium',
                xpReward: 35,
                description: 'Given `chars = "ABCDEF123456!@#"`, use `random.choice(chars)` to pick a single random character and print it.',
                instructions: ['Use random.choice on the string.', 'Print the character.'],
                starterCode: 'import random\nchars = "ABCDEF123456!@#"\n# Pick random char:\n',
                solutionCode: 'import random\nchars = "ABCDEF123456!@#"\nprint(random.choice(chars))',
                solutionExplanation: 'random.choice works on strings as sequences of characters.',
                hints: [
                    { level: 1, title: 'Concept', content: 'random.choice can take a string as input.' },
                    { level: 2, title: 'Approach', content: 'print(random.choice(chars))' },
                    { level: 3, title: 'Pseudocode', content: 'print(random.choice(chars))' },
                    { level: 4, title: 'Detailed Guidance', content: 'Prints 1 char from the set.' },
                ],
                testCases: [{ expectedOutput: '', description: 'Returns 1 char from chars', regexPattern: '^[A-F1-6!@#]$' }],
                topicCategory: 'random',
            },
            {
                id: 'p2-c5-ch6',
                chapterId: 5,
                challengeNumber: 6,
                title: 'Number Guessing Evaluator',
                difficulty: 'Medium',
                xpReward: 35,
                description: 'Given `secret = 20` and `guess = 20`. Write an if-elif-else that checks:\n- If `guess == secret`: print "You guessed it!"\n- If `guess > secret`: print "Too High"\n- Else: print "Too Low"',
                instructions: ['Compare guess and secret.', 'Print the exact feedback message.'],
                starterCode: 'secret = 20\nguess = 20\n# Write guessing logic:\n',
                solutionCode: 'secret = 20\nguess = 20\nif guess == secret:\n    print("You guessed it!")\nelif guess > secret:\n    print("Too High")\nelse:\n    print("Too Low")',
                solutionExplanation: 'guess equals secret (20 == 20), so it prints "You guessed it!".',
                hints: [
                    { level: 1, title: 'Concept', content: 'Use if-elif-else structure.' },
                    { level: 2, title: 'Approach', content: 'if guess == secret: print("You guessed it!")...' },
                    { level: 3, title: 'Pseudocode', content: 'if guess == secret: ...' },
                    { level: 4, title: 'Detailed Guidance', content: 'Outputs You guessed it!' },
                ],
                testCases: [{ expectedOutput: 'You guessed it!', description: 'Outputs You guessed it!' }],
                topicCategory: 'random',
            },
        ],
        quiz: {
            chapterId: 5,
            title: 'Chapter 5 Quiz: Random Numbers & Applications',
            description: 'Test your understanding of the random module, randint, choice, randrange, and game simulations.',
            passingScorePercent: 70,
            xpReward: 100,
            questions: [
                {
                    id: 'q5-1',
                    question: 'What is the purpose of `import random` in Python?',
                    type: 'mcq',
                    options: ['To generate random numbers and random selections', 'To speed up internet connection', 'To format code indentation', 'To delete files'],
                    correctAnswer: 0,
                    explanation: '`import random` imports Python\'s built-in randomness module.',
                    topic: 'random',
                },
                {
                    id: 'q5-2',
                    question: 'What is the range of possible return values for `random.randint(1, 10)`?',
                    type: 'mcq',
                    options: ['1 to 10 (inclusive of both 1 and 10)', '1 to 9 (10 is excluded)', '0 to 10', '0 to 9'],
                    correctAnswer: 0,
                    explanation: '`randint(a, b)` includes both endpoints a and b.',
                    topic: 'random',
                },
                {
                    id: 'q5-3',
                    question: 'How does `random.randrange(1, 10)` differ from `random.randint(1, 10)`?',
                    type: 'conceptual',
                    options: [
                        '`randrange(1, 10)` excludes 10 (produces 1 to 9), while `randint(1, 10)` includes 10',
                        '`randrange` only works with floats',
                        'There is no difference',
                        '`randint` only works with negative numbers',
                    ],
                    correctAnswer: 0,
                    explanation: '`randrange` uses half-open intervals where the stop boundary is excluded.',
                    topic: 'random',
                },
                {
                    id: 'q5-4',
                    question: 'What function picks a random item from a list `["Apple", "Banana", "Orange"]`?',
                    type: 'mcq',
                    options: ['random.choice()', 'random.pick()', 'random.select()', 'random.item()'],
                    correctAnswer: 0,
                    explanation: '`random.choice()` selects a single element from a sequence.',
                    topic: 'random',
                },
                {
                    id: 'q5-5',
                    question: 'What does `random.randrange(0, 10, 2)` produce?',
                    type: 'predict_output',
                    options: ['Random even integers between 0 and 8', 'Random odd numbers', 'Floating point numbers', 'All numbers 0 to 10'],
                    correctAnswer: 0,
                    explanation: 'With start=0, stop=10, step=2, only even numbers (0, 2, 4, 6, 8) can be generated.',
                    topic: 'random',
                },
                {
                    id: 'q5-6',
                    question: 'Can `random.choice("HELLO")` select a single letter from the string "HELLO"?',
                    type: 'true_false',
                    options: ['True (Strings are valid sequences)', 'False (choice only works on lists of numbers)'],
                    correctAnswer: 0,
                    explanation: 'True. Strings in Python are sequences of characters and can be passed to `random.choice()`.',
                    topic: 'random',
                },
                {
                    id: 'q5-7',
                    question: 'In a number guessing game where `secret = 25` and `guess = 10`, what condition tests that the guess was too low?',
                    type: 'mcq',
                    options: ['guess < secret', 'guess > secret', 'guess == secret', 'guess != secret'],
                    correctAnswer: 0,
                    explanation: '`guess < secret` indicates the submitted guess is lower than the target.',
                    topic: 'random',
                },
                {
                    id: 'q5-8',
                    question: 'What is the result of `random.randint(5, 5)`?',
                    type: 'predict_output',
                    options: ['Always 5', 'A number between 0 and 5', 'Error: start and end cannot be equal', 'None'],
                    correctAnswer: 0,
                    explanation: 'When start equals end in randint, the only possible outcome is that number (5).',
                    topic: 'random',
                },
                {
                    id: 'q5-9',
                    question: 'What happens if you try to call `randint(1, 6)` without writing `import random` first?',
                    type: 'identify_error',
                    options: ['NameError: name \'randint\' is not defined', 'SyntaxError', 'TypeError', 'It works automatically'],
                    correctAnswer: 0,
                    explanation: 'Python raises a NameError because the function name is not in the global namespace without importing it.',
                    topic: 'debugging',
                },
                {
                    id: 'q5-10',
                    question: 'Why are computer-generated random numbers often referred to as "pseudo-random"?',
                    type: 'conceptual',
                    options: [
                        'Because they are calculated by deterministic mathematical algorithms that simulate true randomness',
                        'Because they only work on fake computers',
                        'Because they are always zero',
                    ],
                    correctAnswer: 0,
                    explanation: 'Pseudo-random algorithms generate sequences that appear random statistically but stem from a mathematical seed.',
                    topic: 'random',
                },
            ],
        },
    },

    // ══════════════════════════════════════════════════════════════════════
    // CHAPTER 6 — ITERATIVE STATEMENTS
    // ══════════════════════════════════════════════════════════════════════
    {
        id: 6,
        chapterNumber: 6,
        title: 'Iterative Statements',
        subtitle: 'Repeat instructions efficiently with while loops, for loops, range(), nested loops, counters, and accumulators.',
        description: 'Deep dive into loop mechanics, iteration tables, loop control variables, infinite loops prevention, range parameters, nested grid loops, pattern generation, accumulators, encapsulation, generalization, and loop debugging.',
        estimatedMinutes: 150,
        xpReward: 100,
        badgeName: 'Loop Warrior',
        badgeIcon: '⚔️',
        lessons: [
            {
                id: 'p2-c6-l1',
                chapterId: 6,
                lessonNumber: 1,
                title: 'Why Do We Need Loops?',
                description: 'Understand how iteration eliminates repetitive code and enables scalable automation.',
                durationMinutes: 7,
                xpReward: 10,
                topics: ['Loop Concepts', 'Code Repetition', 'DRY Principle (Don\'t Repeat Yourself)'],
                whatYoullLearn: [
                    'The problem with copy-pasting code multiple times',
                    'How loops execute a single block of instructions repeatedly',
                    'The DRY (Don\'t Repeat Yourself) software engineering principle',
                ],
                concept: 'Imagine printing numbers 1 to 1,000. Without loops, you would need 1,000 separate `print()` lines! A **loop** allows you to write the instruction once and tell Python to repeat it as many times as needed.',
                whyItMatters: 'Loops are the engine of all data processing: scanning database records, animating game frames, and processing financial transactions.',
                visualDiagram: {
                    type: 'flowchart',
                    title: 'Without Loop vs With Loop Architecture',
                    diagramText: `WITHOUT LOOP (Manual & Bloated)       WITH LOOP (Clean & Scalable)
+-------------------------------+      +-------------------------------+
| print(1)                      |      |  for i in range(1, 6):        |
| print(2)                      |      |      print(i)                 |
| print(3)                      |      +-------------------------------+
| print(4)                      |                      |
| print(5)                      |                      v
+-------------------------------+               [ Repeat 5 times ]`,
                },
                syntax: '# With loop:\nfor i in range(1, 6):\n    print(i)',
                exampleCode: 'for i in range(1, 6):\n    print("Iteration:", i)',
                expectedOutput: 'Iteration: 1\nIteration: 2\nIteration: 3\nIteration: 4\nIteration: 5',
                stepByStepExplanation: [
                    '1. `range(1, 6)` produces sequence 1, 2, 3, 4, 5.',
                    '2. In iteration 1, `i` is 1 -> prints "Iteration: 1".',
                    '3. In iteration 2, `i` is 2 -> prints "Iteration: 2".',
                    '4. Continues until all 5 numbers are processed.',
                ],
                interactiveStarterCode: 'for count in range(1, 4):\n    print("Python is awesome! 🚀")',
                quickCheck: [
                    {
                        question: 'What is the main benefit of using loops instead of duplicate print statements?',
                        options: [
                            'Loops allow repetitive actions without duplicate code and scale easily to millions of items',
                            'Loops delete old code',
                            'Loops make the font larger',
                        ],
                        correctAnswer: 0,
                        explanation: 'Loops automate repetition and adhere to the DRY principle.',
                    },
                ],
                miniChallenge: {
                    title: 'Loop Repeat 3 Times',
                    instruction: 'Write a loop that prints "Looping" 3 times.',
                    starterCode: '# Write loop to print Looping 3 times:\n',
                    expectedOutputSnippet: 'Looping\nLooping\nLooping',
                    testCases: [{ expectedOutput: 'Looping\nLooping\nLooping', description: 'Outputs 3 lines' }],
                    hint: 'for i in range(3):\n    print("Looping")',
                },
            },
            {
                id: 'p2-c6-l2',
                chapterId: 6,
                lessonNumber: 2,
                title: 'The while Loop',
                description: 'Repeat a block of code as long as a specified condition remains True.',
                durationMinutes: 8,
                xpReward: 10,
                topics: ['while Loop', 'Condition-Controlled Loop', 'Loop Body'],
                whatYoullLearn: [
                    'How the `while condition:` statement functions',
                    'The 3 essential components: Initialization, Condition, and Update',
                    'How the loop terminates as soon as the condition evaluates to False',
                ],
                concept: 'A `while` loop repeatedly executes its block **as long as its condition is True**. Before each iteration, Python checks the condition. If `True`, it runs the body. If `False`, the loop immediately ends.',
                whyItMatters: 'Used when the exact number of iterations is not known in advance (e.g. while game is active, while user has not clicked exit).',
                visualDiagram: {
                    type: 'flowchart',
                    title: 'while Loop Execution Flow',
                    diagramText: `             +---------------+
             |   count = 1   |  <-- Initialization
             +---------------+
                     |
                     v
          /---------------------\\
         /    Is count <= 5 ?    \\ <-----+
         \\                       /       |
          \\---------------------/        |
             /               \\           |
          YES                 NO         |
           |                   |         |
           v                   v         |
   +----------------+       +-----+      |
   |  print(count)  |       | END |      |
   +----------------+       +-----+      |
           |                             |
           v                             |
   +----------------+                    |
   |   count += 1   |  ------------------+ [Loop back to condition]
   +----------------+`,
                },
                syntax: 'count = 1          # 1. Initialize\nwhile count <= 5:  # 2. Condition\n    print(count)   # 3. Body\n    count += 1     # 4. Update',
                exampleCode: 'count = 1\nwhile count <= 5:\n    print(count)\n    count += 1\nprint("Loop completed!")',
                expectedOutput: '1\n2\n3\n4\n5\nLoop completed!',
                stepByStepExplanation: [
                    '1. `count` starts at 1.',
                    '2. Check: Is 1 <= 5? (True) -> print 1, increment count to 2.',
                    '3. Check: Is 2 <= 5? (True) -> print 2, increment count to 3.',
                    '4. Continues until count becomes 6 (6 <= 5 is False) -> Loop terminates.',
                ],
                interactiveStarterCode: 'n = 1\nwhile n <= 3:\n    print("Step", n)\n    n += 1',
                quickCheck: [
                    {
                        question: 'When does a while loop stop executing?',
                        options: [
                            'When its condition evaluates to False',
                            'After exactly 10 iterations always',
                            'When the computer runs out of memory',
                        ],
                        correctAnswer: 0,
                        explanation: 'A while loop evaluates its condition before every iteration and terminates when the condition becomes False.',
                    },
                ],
                miniChallenge: {
                    title: 'Count from 1 to 4 with while',
                    instruction: 'Initialize `i = 1`. Use a while loop to print `i` while `i <= 4`. Update with `i += 1`.',
                    starterCode: 'i = 1\n# Write while loop:\n',
                    expectedOutputSnippet: '1\n2\n3\n4',
                    testCases: [{ expectedOutput: '1\n2\n3\n4', description: 'Outputs 1 2 3 4' }],
                    hint: 'while i <= 4:\n    print(i)\n    i += 1',
                },
            },
            {
                id: 'p2-c6-l3',
                chapterId: 6,
                lessonNumber: 3,
                title: 'How while Loop Executes (Iteration Table)',
                description: 'Trace while loop variables iteration-by-iteration using a step trace table.',
                durationMinutes: 8,
                xpReward: 10,
                topics: ['Loop Trace Table', 'State Tracking', 'Dry Run'],
                whatYoullLearn: [
                    'How to dry-run a loop on paper or mentally',
                    'Tracking variable values before and after each iteration',
                    'Predicting exact loop outputs without running the code',
                ],
                concept: 'A **trace table** shows the value of every variable at each iteration of a loop. This is the single most effective tool for understanding loops and finding off-by-one errors.',
                whyItMatters: 'Technical interviewers frequently ask candidates to trace loop states step-by-step.',
                visualDiagram: {
                    type: 'table',
                    title: 'Iteration-by-Iteration Trace Table (while count <= 5)',
                    data: {
                        headers: ['Iteration #', 'count at Start', 'Condition (count <= 5)', 'Action / Output', 'count at End'],
                        rows: [
                            ['1', '1', '1 <= 5 (True)', 'print(1)', '2'],
                            ['2', '2', '2 <= 5 (True)', 'print(2)', '3'],
                            ['3', '3', '3 <= 5 (True)', 'print(3)', '4'],
                            ['4', '4', '4 <= 5 (True)', 'print(4)', '5'],
                            ['5', '5', '5 <= 5 (True)', 'print(5)', '6'],
                            ['6', '6', '6 <= 5 (False)', 'Loop Stops 🛑', '6'],
                        ],
                    },
                },
                syntax: '# Tracing structure:\n# Variable values change deterministically with each pass',
                exampleCode: 'x = 2\nwhile x <= 8:\n    print("x is:", x)\n    x += 2',
                expectedOutput: 'x is: 2\nx is: 4\nx is: 6\nx is: 8',
                interactiveStarterCode: 'val = 10\nwhile val >= 7:\n    print("Countdown:", val)\n    val -= 1',
                quickCheck: [
                    {
                        question: 'In the trace table for `while count <= 5`, what is the value of `count` immediately AFTER the loop terminates?',
                        options: ['5', '6', '4', '0'],
                        correctAnswer: 1,
                        explanation: 'Count was incremented from 5 to 6, which caused 6 <= 5 to become False and end the loop.',
                    },
                ],
                miniChallenge: {
                    title: 'Even Numbers Step Trace',
                    instruction: 'Create `x = 2`. Write a while loop with `x <= 6` that prints `x` and increments `x += 2`.',
                    starterCode: 'x = 2\n# Write loop:\n',
                    expectedOutputSnippet: '2\n4\n6',
                    testCases: [{ expectedOutput: '2\n4\n6', description: 'Outputs 2 4 6' }],
                    hint: 'while x <= 6:\n    print(x)\n    x += 2',
                },
            },
            {
                id: 'p2-c6-l4',
                chapterId: 6,
                lessonNumber: 4,
                title: 'Loop Control Variables & Updates',
                description: 'Understand the variable that controls loop termination and why the update step is crucial.',
                durationMinutes: 7,
                xpReward: 10,
                topics: ['Loop Control Variable (LCV)', 'Update Step', 'State Progression'],
                whatYoullLearn: [
                    'What a Loop Control Variable (LCV) is',
                    'Why the update statement (like `count += 1` or `count -= 1`) must move toward False',
                    'What happens when the LCV is never updated',
                ],
                concept: 'A **Loop Control Variable (LCV)** is the variable whose value determines whether the loop continues or stops. Every while loop MUST modify its LCV inside the loop body so that the condition eventually becomes `False`.',
                whyItMatters: 'Forgetting to update the LCV is the #1 cause of frozen/hung programs (infinite loops).',
                visualDiagram: {
                    type: 'flowchart',
                    title: 'The 3 Pillars of a While Loop',
                    diagramText: `1. INITIALIZE (Before loop)  --->  count = 1
                                         |
2. TEST (Condition check)   --->  while count <= 5:
                                         |
3. UPDATE (Inside body)     --->      count += 1  (Moves towards False!)`,
                },
                syntax: 'lcv = initial_value\nwhile lcv < limit:\n    # body\n    lcv += 1  # Vital update step',
                exampleCode: 'i = 0\nwhile i < 3:\n    print("Valid update:", i)\n    i += 1  # Updates LCV',
                expectedOutput: 'Valid update: 0\nValid update: 1\nValid update: 2',
                interactiveStarterCode: 'k = 5\nwhile k > 0:\n    print("Value:", k)\n    k -= 1',
                quickCheck: [
                    {
                        question: 'What happens if you forget to increment the loop control variable in `while count <= 5:`?',
                        options: [
                            'The loop runs forever (infinite loop)',
                            'Python guesses the increment',
                            'The computer deletes the code',
                        ],
                        correctAnswer: 0,
                        explanation: 'If count never changes, count <= 5 stays True forever, creating an infinite loop.',
                    },
                ],
                miniChallenge: {
                    title: 'Countdown Loop Update',
                    instruction: 'Create `timer = 3`. Use a while loop to print `timer` while `timer > 0`. Update with `timer -= 1`.',
                    starterCode: 'timer = 3\n# Write countdown:\n',
                    expectedOutputSnippet: '3\n2\n1',
                    testCases: [{ expectedOutput: '3\n2\n1', description: 'Outputs 3 2 1' }],
                    hint: 'while timer > 0:\n    print(timer)\n    timer -= 1',
                },
            },
            {
                id: 'p2-c6-l5',
                chapterId: 6,
                lessonNumber: 5,
                title: 'Infinite Loops & Safe Practices',
                description: 'Learn why infinite loops happen, how to avoid them, and when intentional infinite loops are used with break.',
                durationMinutes: 8,
                xpReward: 10,
                topics: ['Infinite Loops', 'break Statement', 'Safety Guards'],
                whatYoullLearn: [
                    'What an infinite loop is (a loop whose condition NEVER evaluates to False)',
                    'How to terminate an infinite loop in terminal with Ctrl+C',
                    'Using `while True:` intentionally combined with `break`',
                ],
                concept: 'An **infinite loop** runs endlessly because its condition is always `True`. While accidental infinite loops crash software, intentional infinite loops (`while True:`) are standard in game loops and servers when paired with a `break` statement to exit on demand.',
                whyItMatters: 'Web servers (like Node.js or FastAPI) run in a `while True:` event loop waiting for user requests.',
                visualDiagram: {
                    type: 'flowchart',
                    title: 'Safe while True with break Flow',
                    diagramText: `          +---------------------+
          |     while True:     | <----+
          +---------------------+      |
                     |                 |
                     v                 |
             [ Execute Code ]          |
                     |                 |
                     v                 |
          /---------------------\\      |
         /    Exit Condition?    \\ --- NO -+
         \\                       /
          \\---------------------/
                     | YES
                     v
             [ break; (EXIT) ]
                     |
                     v
             +---------------+
             |  End of Loop  |
             +---------------+`,
                },
                syntax: '# Controlled while True loop with break:\ncount = 0\nwhile True:\n    print(count)\n    count += 1\n    if count == 3:\n        break  # Exits loop immediately',
                exampleCode: 'n = 0\nwhile True:\n    print("Processing", n)\n    n += 1\n    if n >= 3:\n        break\nprint("Safely exited.")',
                expectedOutput: 'Processing 0\nProcessing 1\nProcessing 2\nSafely exited.',
                interactiveStarterCode: 'items = 0\nwhile True:\n    items += 1\n    if items == 3:\n        print("Limit reached!")\n        break',
                quickCheck: [
                    {
                        question: 'What keyword immediately breaks out of and terminates a loop?',
                        options: ['stop', 'exit', 'break', 'end'],
                        correctAnswer: 2,
                        explanation: '`break` immediately terminates the enclosing loop.',
                    },
                ],
                miniChallenge: {
                    title: 'Safe break Loop',
                    instruction: 'Write a `while True:` loop that increments `x = 0` by 1 and prints `x`. When `x == 2`, use `break` to exit.',
                    starterCode: 'x = 0\n# Write while True with break:\n',
                    expectedOutputSnippet: '1\n2',
                    testCases: [{ expectedOutput: '1\n2', description: 'Outputs 1 2 and exits' }],
                    hint: 'while True:\n    x += 1\n    print(x)\n    if x == 2:\n        break',
                },
            },
            {
                id: 'p2-c6-l6',
                chapterId: 6,
                lessonNumber: 6,
                title: 'The for Loop',
                description: 'Iterate over sequences and ranges automatically without manual counter management.',
                durationMinutes: 8,
                xpReward: 10,
                topics: ['for Loop', 'Sequences', 'Automatic Iteration'],
                whatYoullLearn: [
                    'How the `for variable in sequence:` syntax works',
                    'How the loop variable automatically takes on each element in turn',
                    'Why for loops are the preferred standard when the number of items is known',
                ],
                concept: 'The `for` loop in Python is a definite loop that iterates over a sequence (such as numbers from `range()`, characters in a string, or items in a list). In each pass, the loop variable is automatically assigned the next item.',
                whyItMatters: '`for` loops eliminate manual index bugs (like forgetting `i += 1`) completely.',
                visualDiagram: {
                    type: 'flowchart',
                    title: 'for Loop Sequence Flow',
                    diagramText: `Sequence: [0, 1, 2, 3, 4]
           |
           v
+-----------------------------+
|  Take next element into i   | <-----+
+-----------------------------+       |
           |                          |
           v                          |
+-----------------------------+       |
|    Execute Body: print(i)   |       |
+-----------------------------+       |
           |                          |
           v                          |
   /---------------------\\            |
  /   More items left?    \\ --- YES --+
  \\                       /
   \\---------------------/
              | NO
              v
           [ END ]`,
                },
                syntax: 'for variable in sequence:\n    # Body executes for each item in sequence\n    statement',
                exampleCode: 'for i in range(5):\n    print(i)',
                expectedOutput: '0\n1\n2\n3\n4',
                stepByStepExplanation: [
                    '1. `range(5)` creates the numbers 0, 1, 2, 3, 4.',
                    '2. Pass 1: `i = 0` -> prints 0.',
                    '3. Pass 2: `i = 1` -> prints 1.',
                    '4. Pass 3: `i = 2` -> prints 2.',
                    '5. Pass 4: `i = 3` -> prints 3.',
                    '6. Pass 5: `i = 4` -> prints 4.',
                ],
                interactiveStarterCode: 'for char in "PYTHON":\n    print("Letter:", char)',
                quickCheck: [
                    {
                        question: 'What numbers are generated by `range(4)`?',
                        options: ['1, 2, 3, 4', '0, 1, 2, 3', '0, 1, 2, 3, 4', '1, 2, 3'],
                        correctAnswer: 1,
                        explanation: '`range(4)` starts at 0 and generates 4 numbers: 0, 1, 2, 3.',
                    },
                ],
                miniChallenge: {
                    title: 'Simple for Loop',
                    instruction: 'Use a for loop with `range(3)` to print the loop variable `i`.',
                    starterCode: '# Write for loop:\n',
                    expectedOutputSnippet: '0\n1\n2',
                    testCases: [{ expectedOutput: '0\n1\n2', description: 'Outputs 0 1 2' }],
                    hint: 'for i in range(3):\n    print(i)',
                },
            },
            {
                id: 'p2-c6-l7',
                chapterId: 6,
                lessonNumber: 7,
                title: 'The range() Function in Detail',
                description: 'Master all 3 forms of range: range(stop), range(start, stop), and range(start, stop, step).',
                durationMinutes: 9,
                xpReward: 10,
                topics: ['range() Function', 'start / stop / step', 'Interval Parameters'],
                whatYoullLearn: [
                    'Form 1: `range(stop)` -> 0 up to stop (stop excluded)',
                    'Form 2: `range(start, stop)` -> start up to stop (stop excluded)',
                    'Form 3: `range(start, stop, step)` -> custom step increments or negative countdowns',
                ],
                concept: 'The `range()` function generates an immutable arithmetic sequence of integers:\n- `range(5)` -> 0, 1, 2, 3, 4\n- `range(1, 6)` -> 1, 2, 3, 4, 5\n- `range(1, 10, 2)` -> 1, 3, 5, 7, 9\n- `range(5, 0, -1)` -> 5, 4, 3, 2, 1 (Countdown!)',
                whyItMatters: '`range()` is the most frequently used sequence generator across data structures and algorithms in Python.',
                visualDiagram: {
                    type: 'number_line',
                    title: 'range(1, 6) vs range(1, 10, 2)',
                    description: 'Number line visualization of step intervals.',
                    data: {
                        start: 1,
                        stop: 6,
                        step: 1,
                    },
                },
                syntax: 'range(stop)\nrange(start, stop)\nrange(start, stop, step)',
                exampleCode: 'print("range(1, 6):")\nfor x in range(1, 6):\n    print(x)\n\nprint("range(0, 10, 2):")\nfor even in range(0, 10, 2):\n    print(even)',
                expectedOutput: 'range(1, 6):\n1\n2\n3\n4\n5\nrange(0, 10, 2):\n0\n2\n4\n6\n8',
                interactiveStarterCode: '# Countdown from 5 to 1 using negative step (-1)\nfor count in range(5, 0, -1):\n    print(count)',
                quickCheck: [
                    {
                        question: 'What numbers are generated by `range(2, 8, 2)`?',
                        options: ['2, 4, 6', '2, 4, 6, 8', '2, 3, 4, 5, 6, 7, 8', '0, 2, 4, 6'],
                        correctAnswer: 0,
                        explanation: 'Starts at 2, increments by 2, stops before 8: 2, 4, 6.',
                    },
                ],
                miniChallenge: {
                    title: 'Generate Multiples of 3',
                    instruction: 'Use a for loop with `range(3, 13, 3)` to print multiples of 3 (3, 6, 9, 12).',
                    starterCode: '# Print multiples of 3:\n',
                    expectedOutputSnippet: '3\n6\n9\n12',
                    testCases: [{ expectedOutput: '3\n6\n9\n12', description: 'Outputs 3 6 9 12' }],
                    hint: 'for i in range(3, 13, 3):\n    print(i)',
                },
            },
            {
                id: 'p2-c6-l8',
                chapterId: 6,
                lessonNumber: 8,
                title: 'for Loop Patterns & Countdowns',
                description: 'Apply for loops to count up, count down, and generate mathematical tables.',
                durationMinutes: 8,
                xpReward: 10,
                topics: ['Countdowns', 'Multiplication Tables', 'Range Tricks'],
                whatYoullLearn: [
                    'How to perform countdowns with `step = -1`',
                    'Generating custom mathematical multiplication tables (e.g. 5 × 1 to 5 × 5)',
                    'Combining strings and loop variables in formatted output',
                ],
                concept: 'By adjusting `start`, `stop`, and `step`, for loops can traverse in any direction. For negative steps, ensure `start > stop`.',
                whyItMatters: 'Used for rocket countdowns, timer ticks, and table formatting.',
                visualDiagram: {
                    type: 'step_trace',
                    title: 'Negative Step Trace (range(3, 0, -1))',
                    data: {
                        steps: [
                            { step: 1, label: 'Start Value', value: '3', note: 'First output' },
                            { step: 2, label: 'Decrement by -1', value: '2', note: 'Second output' },
                            { step: 3, label: 'Decrement by -1', value: '1', note: 'Third output' },
                            { step: 4, label: 'Reached stop (0)', value: 'STOP', note: '0 is excluded' },
                        ],
                    },
                },
                syntax: 'for i in range(10, 0, -1):\n    print(i)',
                exampleCode: 'for i in range(3, 0, -1):\n    print("T-minus", i)\nprint("Blast off! 🚀")',
                expectedOutput: 'T-minus 3\nT-minus 2\nT-minus 1\nBlast off! 🚀',
                interactiveStarterCode: '# Print 5 times table (5 x 1 to 5 x 3)\nfor i in range(1, 4):\n    print("5 x", i, "=", 5 * i)',
                quickCheck: [
                    {
                        question: 'What is required in `range(start, stop, step)` to count backwards?',
                        options: ['A negative step value and start > stop', 'A positive step value', 'An extra else statement'],
                        correctAnswer: 0,
                        explanation: 'Counting downwards requires `start > stop` and a negative step value like `-1`.',
                    },
                ],
                miniChallenge: {
                    title: 'Countdown 3 to 1',
                    instruction: 'Write a for loop using `range(3, 0, -1)` that prints numbers 3, 2, 1.',
                    starterCode: '# Write countdown loop:\n',
                    expectedOutputSnippet: '3\n2\n1',
                    testCases: [{ expectedOutput: '3\n2\n1', description: 'Outputs 3 2 1' }],
                    hint: 'for i in range(3, 0, -1):\n    print(i)',
                },
            },
            {
                id: 'p2-c6-l9',
                chapterId: 6,
                lessonNumber: 9,
                title: 'while vs for: When to Use Which?',
                description: 'Compare while and for loops to choose the best tool for every programming problem.',
                durationMinutes: 7,
                xpReward: 10,
                topics: ['Loop Comparison', 'Definite vs Indefinite Iteration', 'Architecture Choices'],
                whatYoullLearn: [
                    'Definite loops (`for`): when you know how many times to repeat in advance',
                    'Indefinite loops (`while`): when you repeat until a dynamic condition changes',
                    'Real-world software architectural rules of thumb',
                ],
                concept: 'Use a `for` loop when you have a known sequence or count (e.g. 10 users, 5 attempts, elements in a list). Use a `while` loop when you are waiting for a dynamic condition (e.g. until battery < 10%, while game is active, while user input is invalid).',
                whyItMatters: 'Choosing the right loop makes your code shorter, cleaner, and less prone to infinite loop bugs.',
                visualDiagram: {
                    type: 'table',
                    title: 'Comprehensive Comparison: while vs for',
                    data: {
                        headers: ['Feature', 'for Loop', 'while Loop'],
                        rows: [
                            ['Iteration Type', 'Definite (Known count / sequence)', 'Indefinite (Condition-based)'],
                            ['Variable Update', 'Handled automatically by Python', 'Must be updated manually (e.g. i += 1)'],
                            ['Infinite Loop Risk', 'Very low (iterates through finite sequence)', 'Moderate (if update step is omitted)'],
                            ['Best Used For', 'Iterating lists, fixed ranges, grids', 'Game loops, waiting for conditions, user retry'],
                        ],
                    },
                },
                syntax: '# for when count is known:\nfor i in range(5):\n    ...\n\n# while when waiting for condition:\nwhile is_running:\n    ...',
                exampleCode: 'print("--- for loop (fixed count) ---")\nfor i in range(3):\n    print("Known pass:", i)\n\nprint("--- while loop (condition based) ---")\npower = 30\nwhile power > 0:\n    print("Power remaining:", power)\n    power -= 10',
                expectedOutput: '--- for loop (fixed count) ---\nKnown pass: 0\nKnown pass: 1\nKnown pass: 2\n--- while loop (condition based) ---\nPower remaining: 30\nPower remaining: 20\nPower remaining: 10',
                interactiveStarterCode: 'print("for is great for numbers 1 to 5")\nfor i in range(1, 6):\n    print(i)',
                quickCheck: [
                    {
                        question: 'Which loop is best when iterating through a known range of 100 students?',
                        options: ['for loop with range', 'while True with manual counter', 'Infinite recursion'],
                        correctAnswer: 0,
                        explanation: 'A `for` loop with `range(100)` is the cleanest, most idiomatic choice for fixed counts.',
                    },
                ],
                miniChallenge: {
                    title: 'Print 1 to 3 with for',
                    instruction: 'Write a clean for loop using `range(1, 4)` to print 1, 2, 3.',
                    starterCode: '# Write for loop:\n',
                    expectedOutputSnippet: '1\n2\n3',
                    testCases: [{ expectedOutput: '1\n2\n3', description: 'Outputs 1 2 3' }],
                    hint: 'for i in range(1, 4):\n    print(i)',
                },
            },
            {
                id: 'p2-c6-l10',
                chapterId: 6,
                lessonNumber: 10,
                title: 'Nested for Loops',
                description: 'Run loops inside loops to iterate across 2D grids, tables, and coordinates.',
                durationMinutes: 9,
                xpReward: 10,
                topics: ['Nested Loops', 'Outer vs Inner Loop', '2D Grids'],
                whatYoullLearn: [
                    'How nested loops function: the inner loop completes ALL its iterations for every single pass of the outer loop',
                    'Tracing rows (i) and columns (j)',
                    'Calculating total operations: $M \\times N$',
                ],
                concept: 'A **nested loop** is a loop placed inside another loop. For every 1 turn of the outer loop, the inner loop runs completely from start to finish. If the outer loop runs 3 times and the inner loop runs 3 times, the inner body runs $3 \\times 3 = 9$ times total!',
                whyItMatters: 'Nested loops power 2D game grids (chess boards, pixel image manipulation, matrices).',
                visualDiagram: {
                    type: 'grid',
                    title: 'Nested Loop 3x3 Coordinate Matrix',
                    description: 'For each row i (outer), column j (inner) runs across (0, 1, 2).',
                    data: {
                        gridSize: { rows: 3, cols: 3 },
                    },
                },
                syntax: 'for i in range(outer_limit):\n    for j in range(inner_limit):\n        # Runs outer_limit * inner_limit times\n        print(i, j)',
                exampleCode: 'for row in range(2):\n    for col in range(3):\n        print("Row:", row, "Col:", col)',
                expectedOutput: 'Row: 0 Col: 0\nRow: 0 Col: 1\nRow: 0 Col: 2\nRow: 1 Col: 0\nRow: 1 Col: 1\nRow: 1 Col: 2',
                stepByStepExplanation: [
                    '1. Outer loop starts: `row = 0`.',
                    '2. Inner loop runs completely: `col = 0, 1, 2`.',
                    '3. Outer loop advances: `row = 1`.',
                    '4. Inner loop runs completely again: `col = 0, 1, 2`.',
                    '5. Total prints: $2 \\times 3 = 6$ lines.',
                ],
                interactiveStarterCode: 'for i in range(2):\n    for j in range(2):\n        print(f"({i},{j})")',
                quickCheck: [
                    {
                        question: 'If an outer loop runs 4 times and an inner loop runs 5 times, how many total times does the innermost statement execute?',
                        options: ['9', '20', '4', '5'],
                        correctAnswer: 1,
                        explanation: 'Total iterations = Outer × Inner = 4 × 5 = 20.',
                    },
                ],
                miniChallenge: {
                    title: '2x2 Nested Loop Coordinates',
                    instruction: 'Write nested for loops with `range(2)` for `i` and `j` that print `i, j`.',
                    starterCode: '# Write nested loops:\n',
                    expectedOutputSnippet: '0 0\n0 1\n1 0\n1 1',
                    testCases: [{ expectedOutput: '0 0\n0 1\n1 0\n1 1', description: 'Outputs 2x2 grid coordinates' }],
                    hint: 'for i in range(2):\n    for j in range(2):\n        print(i, j)',
                },
            },
            {
                id: 'p2-c6-l11',
                chapterId: 6,
                lessonNumber: 11,
                title: 'Nested while Loops',
                description: 'Understand how nested while loops manage inner loop re-initialization.',
                durationMinutes: 8,
                xpReward: 10,
                topics: ['Nested while', 'Inner Counter Re-initialization', '2D Iteration'],
                whatYoullLearn: [
                    'How nested while loops operate',
                    'Why the inner loop control variable MUST be re-initialized inside the outer loop',
                    'Common pitfalls with nested while loops',
                ],
                concept: 'In a nested `while` loop, you must re-initialize the inner loop variable inside the outer loop body. Otherwise, after the first outer pass, the inner variable remains at its maximum value and the inner loop will never run again!',
                whyItMatters: 'Reinforces how variable scope and initialization drive loop cycles.',
                visualDiagram: {
                    type: 'flowchart',
                    title: 'Inner Counter Reset in Nested while',
                    diagramText: `i = 0
while i < 2:
    j = 0  <-- CRITICAL: Reset j before inner loop begins!
    while j < 2:
        print(i, j)
        j += 1
    i += 1`,
                },
                syntax: 'i = 0\nwhile i < 2:\n    j = 0  # Re-initialize inner counter!\n    while j < 2:\n        print(i, j)\n        j += 1\n    i += 1',
                exampleCode: 'i = 1\nwhile i <= 2:\n    j = 1\n    while j <= 2:\n        print("i:", i, "j:", j)\n        j += 1\n    i += 1',
                expectedOutput: 'i: 1 j: 1\ni: 1 j: 2\ni: 2 j: 1\ni: 2 j: 2',
                interactiveStarterCode: 'r = 1\nwhile r <= 2:\n    c = 1\n    while c <= 2:\n        print(r, c)\n        c += 1\n    r += 1',
                quickCheck: [
                    {
                        question: 'What happens if you initialize `j = 0` BEFORE the outer while loop instead of INSIDE the outer loop?',
                        options: [
                            'The inner loop only runs on the first outer iteration, then fails to run again because j was never reset',
                            'It creates a syntax error',
                            'It runs faster',
                        ],
                        correctAnswer: 0,
                        explanation: '`j` must be reset to 0 inside the outer loop so the inner loop can execute on subsequent passes.',
                    },
                ],
                miniChallenge: {
                    title: 'Nested while Grid',
                    instruction: 'Write nested while loops where `i = 1` while `i <= 2`, and `j = 1` while `j <= 2`, printing `i, j`.',
                    starterCode: 'i = 1\n# Write nested while loops:\n',
                    expectedOutputSnippet: '1 1\n1 2\n2 1\n2 2',
                    testCases: [{ expectedOutput: '1 1\n1 2\n2 1\n2 2', description: 'Outputs 1 1, 1 2, 2 1, 2 2' }],
                    hint: 'while i <= 2:\n    j = 1\n    while j <= 2:\n        print(i, j)\n        j += 1\n    i += 1',
                },
            },
            {
                id: 'p2-c6-l12',
                chapterId: 6,
                lessonNumber: 12,
                title: 'Pattern Printing with Nested Loops',
                description: 'Build geometric visual patterns using outer loops for rows and inner loops for columns.',
                durationMinutes: 9,
                xpReward: 10,
                topics: ['Pattern Printing', 'Rows & Columns', 'Triangles & Grids'],
                whatYoullLearn: [
                    'The golden rule of patterns: Outer loop controls Rows, Inner loop controls Columns',
                    'Printing star triangles (*, **, ***, ****)',
                    'Using Python string repetition `print("*" * i)` as an elegant shortcut',
                ],
                concept: 'Pattern printing is a fundamental skill for mastering nested loops. In a right-angled star triangle, row 1 has 1 star, row 2 has 2 stars, row 3 has 3 stars, etc. The inner loop runs `i` times where `i` is the current row number.',
                whyItMatters: 'Pattern questions are classic benchmark exercises in university coding exams and campus placement rounds.',
                visualDiagram: {
                    type: 'step_trace',
                    title: 'Star Triangle Row Mapping',
                    data: {
                        steps: [
                            { step: 1, label: 'Row 1 (i=1)', value: '*', note: '1 star' },
                            { step: 2, label: 'Row 2 (i=2)', value: '**', note: '2 stars' },
                            { step: 3, label: 'Row 3 (i=3)', value: '***', note: '3 stars' },
                            { step: 4, label: 'Row 4 (i=4)', value: '****', note: '4 stars' },
                        ],
                    },
                },
                syntax: '# Using nested loops or string multiplication:\nfor i in range(1, rows + 1):\n    print("*" * i)',
                exampleCode: 'for i in range(1, 5):\n    print("*" * i)',
                expectedOutput: '*\n**\n***\n****',
                stepByStepExplanation: [
                    '1. `i = 1` -> prints "*" * 1 = "*".',
                    '2. `i = 2` -> prints "*" * 2 = "**".',
                    '3. `i = 3` -> prints "*" * 3 = "***".',
                    '4. `i = 4` -> prints "*" * 4 = "****".',
                ],
                interactiveStarterCode: 'for i in range(1, 4):\n    print("#" * i)',
                quickCheck: [
                    {
                        question: 'In pattern printing, what does the outer loop typically manage?',
                        options: ['The rows (number of lines)', 'The colors', 'The computer memory'],
                        correctAnswer: 0,
                        explanation: 'The outer loop controls the vertical row count.',
                    },
                ],
                miniChallenge: {
                    title: 'Print 3-Line Star Triangle',
                    instruction: 'Write a loop that prints a 3-line star triangle:\n*\n**\n***',
                    starterCode: '# Print star triangle:\n',
                    expectedOutputSnippet: '*\n**\n***',
                    testCases: [{ expectedOutput: '*\n**\n***', description: 'Outputs 3-line triangle' }],
                    hint: 'for i in range(1, 4):\n    print("*" * i)',
                },
            },
            {
                id: 'p2-c6-l13',
                chapterId: 6,
                lessonNumber: 13,
                title: 'Loop Counters',
                description: 'Count events, matches, and occurrences using integer counter variables.',
                durationMinutes: 7,
                xpReward: 10,
                topics: ['Counters', 'Event Counting', 'Incrementing (count += 1)'],
                whatYoullLearn: [
                    'What a counter variable is (starts at 0 and increments by 1 on matching events)',
                    'Counting matching items in loops (e.g. how many numbers are even)',
                    'Initializing before the loop and reading after the loop',
                ],
                concept: 'A **counter** is an integer variable initialized to `0` before a loop. Inside the loop, whenever a specific condition occurs, we increment the counter with `count += 1`. After the loop finishes, `count` holds the total occurrences.',
                whyItMatters: 'Used for tracking total views, votes, failed login attempts, and item quantities.',
                visualDiagram: {
                    type: 'step_trace',
                    title: 'Counter Progression (Counting evens in 1..4)',
                    data: {
                        steps: [
                            { step: 1, label: 'Start', value: 'count = 0', note: 'Initial state' },
                            { step: 2, label: 'i = 1 (Odd)', value: 'count = 0', note: 'No change' },
                            { step: 3, label: 'i = 2 (Even)', value: 'count = 1', note: 'Incremented (+1)' },
                            { step: 4, label: 'i = 3 (Odd)', value: 'count = 1', note: 'No change' },
                            { step: 5, label: 'i = 4 (Even)', value: 'count = 2', note: 'Incremented (+1)' },
                        ],
                    },
                },
                syntax: 'count = 0\nfor item in sequence:\n    if condition:\n        count += 1\nprint("Total:", count)',
                exampleCode: 'even_count = 0\nfor num in range(1, 11):\n    if num % 2 == 0:\n        even_count += 1\nprint("Total Even Numbers in 1..10:", even_count)',
                expectedOutput: 'Total Even Numbers in 1..10: 5',
                interactiveStarterCode: 'matches = 0\nfor x in [5, 12, 18, 3, 25]:\n    if x > 10:\n        matches += 1\nprint("Numbers > 10:", matches)',
                quickCheck: [
                    {
                        question: 'Where should a counter variable be initialized to 0?',
                        options: ['Before the loop starts', 'Inside the loop at the very top', 'After the loop'],
                        correctAnswer: 0,
                        explanation: 'If you initialize inside the loop, the counter resets to 0 on every single iteration!',
                    },
                ],
                miniChallenge: {
                    title: 'Count Multiples of 3',
                    instruction: 'Initialize `count = 0`. In a for loop over `range(1, 10)`, if `i % 3 == 0`, increment `count += 1`. Print `count`.',
                    starterCode: 'count = 0\n# Count multiples of 3:\n',
                    expectedOutputSnippet: '3',
                    testCases: [{ expectedOutput: '3', description: 'Outputs 3 (3, 6, 9)' }],
                    hint: 'for i in range(1, 10):\n    if i % 3 == 0:\n        count += 1\nprint(count)',
                },
            },
            {
                id: 'p2-c6-l14',
                chapterId: 6,
                lessonNumber: 14,
                title: 'Accumulators & Running Totals',
                description: 'Collect running sums, products, and aggregates across loop iterations.',
                durationMinutes: 8,
                xpReward: 10,
                topics: ['Accumulators', 'Running Sum', 'total += value'],
                whatYoullLearn: [
                    'What an accumulator variable is (accumulates values with `total += val`)',
                    'Difference between a Counter (adds 1) and an Accumulator (adds variable values)',
                    'Calculating the sum of numbers from 1 to N',
                ],
                concept: 'An **accumulator** is a variable that gathers a running result as a loop iterates. While a counter always adds 1 (`count += 1`), an accumulator adds varying amounts (`total += number`).',
                whyItMatters: 'Used for shopping cart subtotals, calculating GPAs, averages, and statistical totals.',
                visualDiagram: {
                    type: 'step_trace',
                    title: 'Accumulator Pipeline: Sum 1 to 5',
                    data: {
                        steps: [
                            { step: 1, label: 'Start', value: 'total = 0', note: 'Initial value' },
                            { step: 2, label: 'Add 1', value: 'total = 1', note: '0 + 1' },
                            { step: 3, label: 'Add 2', value: 'total = 3', note: '1 + 2' },
                            { step: 4, label: 'Add 3', value: 'total = 6', note: '3 + 3' },
                            { step: 5, label: 'Add 4', value: 'total = 10', note: '6 + 4' },
                            { step: 6, label: 'Add 5', value: 'total = 15', note: '10 + 5' },
                        ],
                    },
                },
                syntax: 'total = 0\nfor num in range(1, n + 1):\n    total += num\nprint("Sum:", total)',
                exampleCode: 'total_sum = 0\nfor i in range(1, 6):\n    total_sum += i\nprint("Sum 1..5 is:", total_sum)',
                expectedOutput: 'Sum 1..5 is: 15',
                stepByStepExplanation: [
                    '1. `total_sum` starts at 0.',
                    '2. Pass 1: total = 0 + 1 = 1.',
                    '3. Pass 2: total = 1 + 2 = 3.',
                    '4. Pass 3: total = 3 + 3 = 6.',
                    '5. Pass 4: total = 6 + 4 = 10.',
                    '6. Pass 5: total = 10 + 5 = 15.',
                ],
                interactiveStarterCode: 'bill = 0\nfor price in [10, 25, 15]:\n    bill += price\nprint("Shopping Total:", bill)',
                quickCheck: [
                    {
                        question: 'What is the main difference between a counter and an accumulator?',
                        options: [
                            'A counter increments by 1; an accumulator adds varying values together',
                            'A counter is for strings; an accumulator is for floats',
                            'They are identical',
                        ],
                        correctAnswer: 0,
                        explanation: 'Counters count occurrences (+1), while accumulators sum values (+x).',
                    },
                ],
                miniChallenge: {
                    title: 'Sum Numbers 1 to 4',
                    instruction: 'Initialize `total = 0`. In a loop over `range(1, 5)`, add `i` to `total`. Print `total`.',
                    starterCode: 'total = 0\n# Calculate sum:\n',
                    expectedOutputSnippet: '10',
                    testCases: [{ expectedOutput: '10', description: 'Outputs 10 (1+2+3+4)' }],
                    hint: 'for i in range(1, 5):\n    total += i\nprint(total)',
                },
            },
            {
                id: 'p2-c6-l15',
                chapterId: 6,
                lessonNumber: 15,
                title: 'Random Numbers Inside Loops',
                description: 'Combine the random module with iterative loops for simulations and batch generation.',
                durationMinutes: 7,
                xpReward: 10,
                topics: ['Random Simulations', 'Batch Generation', 'Probabilistic Loops'],
                whatYoullLearn: [
                    'Generating random values inside a loop body',
                    'Simulating 5 consecutive dice rolls',
                    'Accumulating and counting random outcomes',
                ],
                concept: 'Placing `random.randint()` or `random.choice()` inside a loop allows your program to simulate series of unpredictable events, such as rolling 5 dice or generating multiple OTP tokens.',
                whyItMatters: 'Powers Monte Carlo simulations in data science and gaming mechanics.',
                syntax: 'import random\nfor i in range(5):\n    val = random.randint(1, 6)\n    print(val)',
                exampleCode: 'import random\nprint("Rolling 3 dice:")\nfor i in range(3):\n    roll = random.randint(1, 6)\n    print("Roll", i + 1, ":", roll)',
                expectedOutput: 'Rolling 3 dice:\nRoll 1 : [1-6]\nRoll 2 : [1-6]\nRoll 3 : [1-6]',
                interactiveStarterCode: 'import random\n# Generate 4 random test scores\nfor student in range(1, 5):\n    score = random.randint(60, 100)\n    print(f"Student {student} Score: {score}")',
                quickCheck: [
                    {
                        question: 'If `random.randint(1, 6)` is placed inside a loop of 5 iterations, how many random numbers are generated?',
                        options: ['1', '5', '6', '30'],
                        correctAnswer: 1,
                        explanation: 'The function is called once per iteration, generating 5 separate numbers.',
                    },
                ],
                miniChallenge: {
                    title: 'Generate 3 Random Rolls',
                    instruction: 'Write a loop that runs 3 times and prints a random integer between 1 and 6 each time.',
                    starterCode: 'import random\n# Generate 3 rolls:\n',
                    expectedOutputSnippet: '',
                    testCases: [{ expectedOutput: '', description: 'Outputs 3 lines of 1-6', regexPattern: '^([1-6]\\n?){3}$' }],
                    hint: 'import random\nfor i in range(3):\n    print(random.randint(1, 6))',
                },
            },
            {
                id: 'p2-c6-l16',
                chapterId: 6,
                lessonNumber: 16,
                title: 'The Number Guessing Game Loop',
                description: 'Build a multi-attempt guessing game using while loop condition and break.',
                durationMinutes: 8,
                xpReward: 15,
                topics: ['Guessing Game Loop', 'Multi-attempt Flow', 'Attempt Tracking'],
                whatYoullLearn: [
                    'Structuring a full guessing loop',
                    'Tracking attempts with `attempts += 1`',
                    'Exiting gracefully upon correct guess with `break`',
                ],
                concept: 'A real guessing game allows the user multiple attempts. A `while` loop continues asking for guesses until the guess matches the secret, at which point the loop breaks and announces victory along with the total attempt count.',
                whyItMatters: 'Combines loops, conditions, counters, and user feedback into a cohesive interactive application.',
                visualDiagram: {
                    type: 'flowchart',
                    title: 'Full Guessing Game Architecture',
                    diagramText: `     +-------------------------+
     | secret = random.randint |
     | attempts = 0            |
     +-------------------------+
                  |
                  v
          /----------------\\
     +-->/   while True:    \\
     |   \\                  /
     |    \\----------------/
     |            |
     |            v
     |   [ Player Guess & attempts += 1 ]
     |            |
     |            v
     |    /----------------\\
     |   /  guess == secret?\\ --- YES ---> [ "Win! Attempts: X" ] ---> [ END ]
     |   \\                  /
     |    \\----------------/
     |            | NO
     |            v
     |   [ Hint: Higher/Lower ]
     +------------+`,
                },
                syntax: 'secret = 42\nattempts = 0\nwhile True:\n    attempts += 1\n    # if guess == secret -> break',
                exampleCode: 'secret = 7\nguesses = [3, 9, 7]\nattempts = 0\n\nfor g in guesses:\n    attempts += 1\n    if g == secret:\n        print("Correct! Attempts:", attempts)\n        break\n    elif g > secret:\n        print(g, "is Too High")\n    else:\n        print(g, "is Too Low")',
                expectedOutput: '3 is Too Low\n9 is Too High\nCorrect! Attempts: 3',
                interactiveStarterCode: 'secret = 12\nfor g in [5, 12]:\n    if g == secret:\n        print("Match found:", g)\n        break',
                quickCheck: [
                    {
                        question: 'Why do we increment `attempts += 1` inside each iteration of a guessing game?',
                        options: ['To track how many guesses the player used', 'To make the game harder', 'To change the secret number'],
                        correctAnswer: 0,
                        explanation: 'It measures the player\'s efficiency and score.',
                    },
                ],
                miniChallenge: {
                    title: 'Simulate Guess Match',
                    instruction: 'Given `secret = 25`. Loop through `[10, 20, 25]`. If the item equals `secret`, print "Found at attempt" followed by the attempt count.',
                    starterCode: 'secret = 25\nattempts = 0\n# Write loop:\n',
                    expectedOutputSnippet: 'Found at attempt 3',
                    testCases: [{ expectedOutput: 'Found at attempt 3', description: 'Outputs Found at attempt 3' }],
                    hint: 'for g in [10, 20, 25]:\n    attempts += 1\n    if g == secret:\n        print("Found at attempt", attempts)\n        break',
                },
            },
            {
                id: 'p2-c6-l17',
                chapterId: 6,
                lessonNumber: 17,
                title: 'Encapsulation: Organizing Logic Units',
                description: 'Learn the architectural concept of bundling related variables, conditions, and loops into self-contained units.',
                durationMinutes: 7,
                xpReward: 10,
                topics: ['Encapsulation Concept', 'Modular Structure', 'Logic Grouping'],
                whatYoullLearn: [
                    'What encapsulation means in fundamental software design (packaging related logic together)',
                    'How grouping inputs, calculations, and outputs simplifies debugging',
                    'Preparing for modular functions in later units',
                ],
                concept: 'In programming, **encapsulation** means bundling related data and logic into a single cohesive unit. Instead of scattering loose calculations across a script, we organize them into clear sections: 1) Input setup, 2) Process logic (loops/conditions), 3) Formatted Output.',
                whyItMatters: 'Clean encapsulation prevents side-effects and makes complex systems maintainable.',
                visualDiagram: {
                    type: 'flowchart',
                    title: 'Encapsulation Box Model',
                    diagramText: `Input Parameters (Data)
          |
          v
+-------------------------------+
|  ENCAPSULATED LOGIC BLOCK     |
|                               |
|  - Conditions                 |
|  - Loops & Iteration          |
|  - State Updates & Counters   |
+-------------------------------+
          |
          v
Clean Output Result`,
                },
                syntax: '# Encapsulated Unit:\n# 1. Inputs\n# 2. Logic\n# 3. Output',
                exampleCode: '# Encapsulated discount calculator unit\nprice = 100\nis_member = True\n\n# Logic block\nif is_member:\n    final = price * 0.8\nelse:\n    final = price\n\nprint("Final Price:", final)',
                expectedOutput: 'Final Price: 80.0',
                interactiveStarterCode: '# Self-contained tax calculator\nsubtotal = 50\ntax = subtotal * 0.1\nprint("Total with tax:", subtotal + tax)',
                quickCheck: [
                    {
                        question: 'What is the primary goal of encapsulation in programming?',
                        options: ['Bundling related data and operations together into clean, cohesive units', 'Making programs slower', 'Hiding code from the compiler'],
                        correctAnswer: 0,
                        explanation: 'Encapsulation groups related logic to improve readability and maintainability.',
                    },
                ],
                miniChallenge: {
                    title: 'Encapsulated Sum Logic',
                    instruction: 'Create an encapsulated block: `numbers = [2, 4, 6]`. Calculate `total` using a for loop, then print `total`.',
                    starterCode: 'numbers = [2, 4, 6]\n# Calculate and print total:\n',
                    expectedOutputSnippet: '12',
                    testCases: [{ expectedOutput: '12', description: 'Outputs 12' }],
                    hint: 'total = 0\nfor n in numbers:\n    total += n\nprint(total)',
                },
            },
            {
                id: 'p2-c6-l18',
                chapterId: 6,
                lessonNumber: 18,
                title: 'Generalization: Writing Flexible Code',
                description: 'Transform hard-coded single-use scripts into generalized algorithms that work for any input.',
                durationMinutes: 7,
                xpReward: 10,
                topics: ['Generalization', 'Variable Reusability', 'Parameterized Logic'],
                whatYoullLearn: [
                    'What generalization means (writing code that works for any N instead of just one hard-coded number)',
                    'Replacing hard-coded limits like `5` with flexible variable limits `N`',
                    'Designing robust algorithms',
                ],
                concept: '**Generalization** means designing logic so it solves a broad class of problems rather than a single hard-coded example. Instead of writing a loop that only sums 1 to 5, we write a generalized loop that sums 1 to `N` for any positive integer.',
                whyItMatters: 'Generalization allows software to scale to any user input size without rewriting code.',
                visualDiagram: {
                    type: 'table',
                    title: 'Hardcoded vs Generalized Logic',
                    data: {
                        headers: ['Aspect', 'Hardcoded (Rigid)', 'Generalized (Flexible)'],
                        rows: [
                            ['Range Limit', 'for i in range(1, 6):', 'for i in range(1, N + 1):'],
                            ['Adaptability', 'Only sums 1 to 5', 'Sums 1 to any N (10, 100, 1000)'],
                            ['Reusability', 'Zero (must rewrite code)', 'High (simply change variable N)'],
                        ],
                    },
                },
                syntax: 'N = 10  # Parameter\ntotal = 0\nfor i in range(1, N + 1):\n    total += i',
                exampleCode: 'N = 5\nsum_n = 0\nfor i in range(1, N + 1):\n    sum_n += i\nprint(f"Sum 1 to {N} is: {sum_n}")',
                expectedOutput: 'Sum 1 to 5 is: 15',
                interactiveStarterCode: 'limit = 4\nfor i in range(1, limit + 1):\n    print(i * 10)',
                quickCheck: [
                    {
                        question: 'Why is `for i in range(1, N + 1):` better than `for i in range(1, 6):`?',
                        options: [
                            'It is generalized to work for any value of N',
                            'It runs without using CPU',
                            'It is shorter to type',
                        ],
                        correctAnswer: 0,
                        explanation: 'Using variable parameter N allows the loop to adapt to any size.',
                    },
                ],
                miniChallenge: {
                    title: 'Generalized Sum 1 to N',
                    instruction: 'Given `N = 6`. Calculate the sum of numbers from 1 to `N` inclusive and print the total.',
                    starterCode: 'N = 6\n# Calculate sum 1..N:\n',
                    expectedOutputSnippet: '21',
                    testCases: [{ expectedOutput: '21', description: 'Outputs 21 (1+2+3+4+5+6)' }],
                    hint: 'total = 0\nfor i in range(1, N + 1):\n    total += i\nprint(total)',
                },
            },
            {
                id: 'p2-c6-l19',
                chapterId: 6,
                lessonNumber: 19,
                title: 'Loop Debugging & Off-by-One Errors',
                description: 'Identify and fix the most common loop bugs: off-by-one errors, infinite loops, and wrong indentation.',
                durationMinutes: 8,
                xpReward: 15,
                topics: ['Loop Debugging', 'Off-by-One Error', 'Indentation Fixes'],
                whatYoullLearn: [
                    'What an off-by-one error is (e.g. running 4 times instead of 5 because of `<` vs `<=`)',
                    'How to debug print statements placed inside vs outside a loop',
                    'The 4-step systematic loop debugging checklist',
                ],
                concept: 'An **off-by-one error** happens when a loop iterates one time too many or one time too few. This is usually caused by using `<` instead of `<=` or forgetting that `range(stop)` excludes `stop`.',
                whyItMatters: 'Off-by-one is considered one of the most classic bugs across all software engineering.',
                visualDiagram: {
                    type: 'table',
                    title: 'Common Loop Pitfalls & Fixes',
                    data: {
                        headers: ['Pitfall', 'Buggy Example', 'Correct Fix'],
                        rows: [
                            ['Off-by-one in range', 'range(1, 5) misses 5', 'range(1, 6) or range(1, N + 1)'],
                            ['Forgetting LCV update', 'while i < 5: (no i += 1)', 'Add i += 1 inside loop body'],
                            ['Accidental print indentation', 'Indenting final total inside loop', 'Unindent print to run after loop ends'],
                        ],
                    },
                },
                syntax: '# Checklist:\n# 1. Check start & stop bounds\n# 2. Check update statement\n# 3. Check print indentation (inside vs outside)',
                exampleCode: '# Corrected loop printing 1 to 5 inclusive:\nfor i in range(1, 6):\n    print(i)',
                expectedOutput: '1\n2\n3\n4\n5',
                interactiveStarterCode: '# Notice: print(total) is OUTSIDE the loop so it only prints once\ntotal = 0\nfor i in range(1, 4):\n    total += i\nprint("Final Total:", total)',
                quickCheck: [
                    {
                        question: 'What is an "off-by-one" error?',
                        options: [
                            'A loop that executes 1 time too few or 1 time too many due to a boundary error',
                            'A computer calculating 1 + 1 = 3',
                            'A typo in variable name',
                        ],
                        correctAnswer: 0,
                        explanation: 'An off-by-one error is a boundary condition mistake where a loop runs N-1 or N+1 times.',
                    },
                ],
                miniChallenge: {
                    title: 'Fix Off-by-One Loop Bug',
                    instruction: 'The code below is supposed to print numbers 1 to 5 inclusive, but stops at 4. Fix the range to include 5.',
                    starterCode: '# Fix the range to print 1 to 5 inclusive:\nfor i in range(1, 5):\n    print(i)',
                    expectedOutputSnippet: '1\n2\n3\n4\n5',
                    testCases: [{ expectedOutput: '1\n2\n3\n4\n5', description: 'Outputs 1 2 3 4 5' }],
                    hint: 'Change range(1, 5) to range(1, 6).',
                },
            },
        ],
        challenges: [
            {
                id: 'p2-c6-ch1',
                chapterId: 6,
                challengeNumber: 1,
                title: 'Print 1 to 10 with for',
                difficulty: 'Easy',
                xpReward: 20,
                description: 'Use a for loop and `range()` to print numbers 1 through 10 on separate lines.',
                instructions: ['Use range(1, 11).', 'Print each number.'],
                starterCode: '# Print 1 to 10:\n',
                solutionCode: 'for i in range(1, 11):\n    print(i)',
                solutionExplanation: 'range(1, 11) produces numbers 1 to 10.',
                hints: [
                    { level: 1, title: 'Concept', content: 'Use range(start, stop).' },
                    { level: 2, title: 'Approach', content: 'for i in range(1, 11):' },
                    { level: 3, title: 'Pseudocode', content: 'for i in range(1, 11): print(i)' },
                    { level: 4, title: 'Detailed Guidance', content: 'Stop value 11 is excluded, so it prints up to 10.' },
                ],
                testCases: [{ expectedOutput: '1\n2\n3\n4\n5\n6\n7\n8\n9\n10', description: 'Outputs 1 to 10' }],
                topicCategory: 'for_loops',
            },
            {
                id: 'p2-c6-ch2',
                chapterId: 6,
                challengeNumber: 2,
                title: 'Countdown 10 to 1 with for',
                difficulty: 'Easy',
                xpReward: 20,
                description: 'Use a for loop with negative step `range(10, 0, -1)` to print a countdown from 10 down to 1.',
                instructions: ['Use range(10, 0, -1).', 'Print numbers in descending order.'],
                starterCode: '# Print countdown 10 to 1:\n',
                solutionCode: 'for i in range(10, 0, -1):\n    print(i)',
                solutionExplanation: 'Iterates backwards from 10 to 1.',
                hints: [
                    { level: 1, title: 'Concept', content: 'Use step -1.' },
                    { level: 2, title: 'Approach', content: 'for i in range(10, 0, -1):' },
                    { level: 3, title: 'Pseudocode', content: 'for i in range(10, 0, -1): print(i)' },
                    { level: 4, title: 'Detailed Guidance', content: 'Prints 10 down to 1.' },
                ],
                testCases: [{ expectedOutput: '10\n9\n8\n7\n6\n5\n4\n3\n2\n1', description: 'Outputs 10 to 1' }],
                topicCategory: 'for_loops',
            },
            {
                id: 'p2-c6-ch3',
                chapterId: 6,
                challengeNumber: 3,
                title: 'Print Even Numbers 2 to 10',
                difficulty: 'Easy',
                xpReward: 20,
                description: 'Print all even numbers from 2 to 10 using `range(2, 11, 2)`.',
                instructions: ['Use step of 2.', 'Print 2, 4, 6, 8, 10.'],
                starterCode: '# Print even numbers:\n',
                solutionCode: 'for i in range(2, 11, 2):\n    print(i)',
                solutionExplanation: 'Starts at 2, steps by 2 up to 10.',
                hints: [
                    { level: 1, title: 'Concept', content: 'range(2, 11, 2)' },
                    { level: 2, title: 'Approach', content: 'Step by 2.' },
                    { level: 3, title: 'Pseudocode', content: 'for i in range(2, 11, 2): print(i)' },
                    { level: 4, title: 'Detailed Guidance', content: 'Outputs 2, 4, 6, 8, 10.' },
                ],
                testCases: [{ expectedOutput: '2\n4\n6\n8\n10', description: 'Outputs 2 4 6 8 10' }],
                topicCategory: 'for_loops',
            },
            {
                id: 'p2-c6-ch4',
                chapterId: 6,
                challengeNumber: 4,
                title: 'Print Odd Numbers 1 to 9',
                difficulty: 'Easy',
                xpReward: 20,
                description: 'Print all odd numbers from 1 to 9 using `range(1, 10, 2)`.',
                instructions: ['Start at 1, step by 2.', 'Print 1, 3, 5, 7, 9.'],
                starterCode: '# Print odd numbers:\n',
                solutionCode: 'for i in range(1, 10, 2):\n    print(i)',
                solutionExplanation: 'Generates odd numbers from 1 to 9.',
                hints: [
                    { level: 1, title: 'Concept', content: 'range(1, 10, 2)' },
                    { level: 2, title: 'Approach', content: 'for i in range(1, 10, 2):' },
                    { level: 3, title: 'Pseudocode', content: 'print(i)' },
                    { level: 4, title: 'Detailed Guidance', content: 'Outputs 1, 3, 5, 7, 9.' },
                ],
                testCases: [{ expectedOutput: '1\n3\n5\n7\n9', description: 'Outputs 1 3 5 7 9' }],
                topicCategory: 'for_loops',
            },
            {
                id: 'p2-c6-ch5',
                chapterId: 6,
                challengeNumber: 5,
                title: 'Multiplication Table for 5',
                difficulty: 'Easy',
                xpReward: 20,
                description: 'Print the 5 multiplication table from 5 × 1 to 5 × 5 in format "5 x i = result".',
                instructions: ['Loop from 1 to 5.', 'Print "5 x {i} = {5*i}".'],
                starterCode: '# Print 5 times table:\n',
                solutionCode: 'for i in range(1, 6):\n    print("5 x", i, "=", 5 * i)',
                solutionExplanation: 'Multiplies 5 by 1 through 5.',
                hints: [
                    { level: 1, title: 'Concept', content: 'Loop i from 1 to 5.' },
                    { level: 2, title: 'Approach', content: 'print("5 x", i, "=", 5 * i)' },
                    { level: 3, title: 'Pseudocode', content: 'for i in range(1, 6): print("5 x", i, "=", 5*i)' },
                    { level: 4, title: 'Detailed Guidance', content: '5 lines of output.' },
                ],
                testCases: [
                    {
                        expectedOutput: '5 x 1 = 5\n5 x 2 = 10\n5 x 3 = 15\n5 x 4 = 20\n5 x 5 = 25',
                        description: 'Outputs 5 times table up to 5',
                    },
                ],
                topicCategory: 'for_loops',
            },
            {
                id: 'p2-c6-ch6',
                chapterId: 6,
                challengeNumber: 6,
                title: 'Sum of First N Numbers',
                difficulty: 'Medium',
                xpReward: 35,
                description: 'Given `N = 10`, calculate the sum of integers from 1 to 10 using an accumulator loop. Print the total.',
                instructions: ['Initialize total = 0.', 'Add i for range(1, N + 1).', 'Print total.'],
                starterCode: 'N = 10\n# Calculate sum 1 to N:\n',
                solutionCode: 'N = 10\ntotal = 0\nfor i in range(1, N + 1):\n    total += i\nprint(total)',
                solutionExplanation: '1 + 2 + ... + 10 = 55.',
                hints: [
                    { level: 1, title: 'Concept', content: 'Use an accumulator.' },
                    { level: 2, title: 'Approach', content: 'total += i' },
                    { level: 3, title: 'Pseudocode', content: 'for i in range(1, N+1): total += i\\nprint(total)' },
                    { level: 4, title: 'Detailed Guidance', content: 'Sum is 55.' },
                ],
                testCases: [{ expectedOutput: '55', description: 'Outputs 55' }],
                topicCategory: 'accumulators',
            },
            {
                id: 'p2-c6-ch7',
                chapterId: 6,
                challengeNumber: 7,
                title: 'Factorial Calculator',
                difficulty: 'Medium',
                xpReward: 35,
                description: 'Given `n = 5`, calculate $5! = 1 \\times 2 \\times 3 \\times 4 \\times 5$. Print the factorial result.',
                instructions: ['Initialize fact = 1.', 'Multiply by i for i in range(1, n + 1).', 'Print fact.'],
                starterCode: 'n = 5\n# Calculate factorial:\n',
                solutionCode: 'n = 5\nfact = 1\nfor i in range(1, n + 1):\n    fact *= i\nprint(fact)',
                solutionExplanation: '5! = 120.',
                hints: [
                    { level: 1, title: 'Concept', content: 'Initialize product to 1 (not 0).' },
                    { level: 2, title: 'Approach', content: 'fact *= i' },
                    { level: 3, title: 'Pseudocode', content: 'fact = 1\\nfor i in range(1, n+1): fact *= i\\nprint(fact)' },
                    { level: 4, title: 'Detailed Guidance', content: '1 * 2 * 3 * 4 * 5 = 120.' },
                ],
                testCases: [{ expectedOutput: '120', description: 'Outputs 120' }],
                topicCategory: 'accumulators',
            },
            {
                id: 'p2-c6-ch8',
                chapterId: 6,
                challengeNumber: 8,
                title: 'Count Digits in a Number',
                difficulty: 'Medium',
                xpReward: 35,
                description: 'Given `number = 58249`, count how many digits it contains using integer division `// 10` in a while loop. Print the digit count.',
                instructions: ['Initialize count = 0.', 'While number > 0: divide by 10 and increment count.', 'Print count.'],
                starterCode: 'number = 58249\n# Count digits:\n',
                solutionCode: 'number = 58249\ncount = 0\nwhile number > 0:\n    count += 1\n    number //= 10\nprint(count)',
                solutionExplanation: '58249 has 5 digits.',
                hints: [
                    { level: 1, title: 'Concept', content: 'Each division by 10 strips the last digit.' },
                    { level: 2, title: 'Approach', content: 'while number > 0: count += 1; number //= 10' },
                    { level: 3, title: 'Pseudocode', content: 'while number > 0: count += 1; number //= 10\\nprint(count)' },
                    { level: 4, title: 'Detailed Guidance', content: '5 digits.' },
                ],
                testCases: [{ expectedOutput: '5', description: 'Outputs 5' }],
                topicCategory: 'while_loops',
            },
            {
                id: 'p2-c6-ch9',
                chapterId: 6,
                challengeNumber: 9,
                title: 'Reverse a Number with while',
                difficulty: 'Medium',
                xpReward: 35,
                description: 'Given `num = 1234`, construct its reverse `4321` using modulus `% 10` and integer division `// 10` in a while loop. Print the reversed number.',
                instructions: [
                    'Initialize rev = 0.',
                    'In while loop: rem = num % 10, rev = (rev * 10) + rem, num = num // 10.',
                    'Print rev.',
                ],
                starterCode: 'num = 1234\n# Reverse the number:\n',
                solutionCode: 'num = 1234\nrev = 0\nwhile num > 0:\n    rem = num % 10\n    rev = (rev * 10) + rem\n    num //= 10\nprint(rev)',
                solutionExplanation: 'Reverses 1234 to 4321.',
                hints: [
                    { level: 1, title: 'Concept', content: 'rev = (rev * 10) + (num % 10)' },
                    { level: 2, title: 'Approach', content: 'Strip last digit with //= 10.' },
                    { level: 3, title: 'Pseudocode', content: 'while num > 0: ...' },
                    { level: 4, title: 'Detailed Guidance', content: 'Outputs 4321.' },
                ],
                testCases: [{ expectedOutput: '4321', description: 'Outputs 4321' }],
                topicCategory: 'while_loops',
            },
            {
                id: 'p2-c6-ch10',
                chapterId: 6,
                challengeNumber: 10,
                title: 'Prime Number Checker',
                difficulty: 'Medium',
                xpReward: 35,
                description: 'A prime number is greater than 1 and has no divisors other than 1 and itself. For `num = 13`, check if it is prime. Print "Prime" or "Not Prime".',
                instructions: [
                    'Assume is_prime = True.',
                    'Loop i from 2 up to num - 1. If num % i == 0, is_prime = False and break.',
                    'Print "Prime" if is_prime else "Not Prime".',
                ],
                starterCode: 'num = 13\n# Check if prime:\n',
                solutionCode: 'num = 13\nis_prime = True\nif num <= 1:\n    is_prime = False\nelse:\n    for i in range(2, num):\n        if num % i == 0:\n            is_prime = False\n            break\nif is_prime:\n    print("Prime")\nelse:\n    print("Not Prime")',
                solutionExplanation: '13 has no divisors between 2 and 12, so it is Prime.',
                hints: [
                    { level: 1, title: 'Concept', content: 'Check if any i in 2..num-1 divides num.' },
                    { level: 2, title: 'Approach', content: 'if num % i == 0: is_prime = False; break' },
                    { level: 3, title: 'Pseudocode', content: 'for i in range(2, num): if num % i == 0: ...' },
                    { level: 4, title: 'Detailed Guidance', content: '13 is Prime.' },
                ],
                testCases: [{ expectedOutput: 'Prime', description: 'Outputs Prime for num=13' }],
                topicCategory: 'for_loops',
            },
            {
                id: 'p2-c6-ch11',
                chapterId: 6,
                challengeNumber: 11,
                title: 'Right-Angled Number Triangle Pattern',
                difficulty: 'Hard',
                xpReward: 50,
                description: 'Print the following number pattern using loops:\n1\n12\n123\n1234\n12345',
                instructions: ['Outer loop for rows 1 to 5.', 'Inner loop or string concatenation for numbers 1 to row.', 'Print each line.'],
                starterCode: '# Print number pattern:\n',
                solutionCode: 'for i in range(1, 6):\n    line = ""\n    for j in range(1, i + 1):\n        line += str(j)\n    print(line)',
                solutionExplanation: 'Constructs number ladder 1 to 12345.',
                hints: [
                    { level: 1, title: 'Concept', content: 'Outer loop i goes 1 to 5.' },
                    { level: 2, title: 'Approach', content: 'Inner loop j goes 1 to i.' },
                    { level: 3, title: 'Pseudocode', content: 'line += str(j)' },
                    { level: 4, title: 'Detailed Guidance', content: '5 lines of output.' },
                ],
                testCases: [{ expectedOutput: '1\n12\n123\n1234\n12345', description: 'Outputs 5-line number ladder' }],
                topicCategory: 'patterns',
            },
            {
                id: 'p2-c6-ch12',
                chapterId: 6,
                challengeNumber: 12,
                title: 'Multi-Attempt Password Gate',
                difficulty: 'Hard',
                xpReward: 50,
                description: 'Given `correct_pin = 4321` and `attempts_list = [1111, 2222, 4321]`. Loop through the list. If pin matches, print "Access Granted at attempt X" (where X is attempt number 1..3) and break.',
                instructions: ['Track attempt counter.', 'Check pin match and break.'],
                starterCode: 'correct_pin = 4321\nattempts_list = [1111, 2222, 4321]\n# Check password attempts:\n',
                solutionCode: 'correct_pin = 4321\nattempts_list = [1111, 2222, 4321]\nattempt_num = 0\nfor pin in attempts_list:\n    attempt_num += 1\n    if pin == correct_pin:\n        print("Access Granted at attempt", attempt_num)\n        break',
                solutionExplanation: 'Finds match at attempt 3.',
                hints: [
                    { level: 1, title: 'Concept', content: 'Increment attempt_num inside loop.' },
                    { level: 2, title: 'Approach', content: 'if pin == correct_pin: print(...) break' },
                    { level: 3, title: 'Pseudocode', content: 'print("Access Granted at attempt", attempt_num)' },
                    { level: 4, title: 'Detailed Guidance', content: 'Outputs attempt 3.' },
                ],
                testCases: [{ expectedOutput: 'Access Granted at attempt 3', description: 'Outputs Access Granted at attempt 3' }],
                topicCategory: 'while_loops',
            },
        ],
        quiz: {
            chapterId: 6,
            title: 'Chapter 6 Quiz: Iteration, Loops & Patterns',
            description: 'Test your understanding of while loops, for loops, range parameters, nested loops, counters, and accumulators.',
            passingScorePercent: 70,
            xpReward: 100,
            questions: [
                {
                    id: 'q6-1',
                    question: 'What is the output of `for i in range(1, 4): print(i)`?',
                    type: 'predict_output',
                    options: ['1, 2, 3, 4', '1, 2, 3', '0, 1, 2, 3', '4'],
                    correctAnswer: 1,
                    explanation: '`range(1, 4)` starts at 1 and stops before 4, generating 1, 2, 3.',
                    topic: 'for_loops',
                },
                {
                    id: 'q6-2',
                    question: 'What happens if a while loop condition never becomes False?',
                    type: 'conceptual',
                    options: ['The loop terminates immediately', 'An infinite loop occurs', 'Python raises a SyntaxError', 'The computer reboots'],
                    correctAnswer: 1,
                    explanation: 'If the condition stays True forever, the loop never stops (infinite loop).',
                    topic: 'while_loops',
                },
                {
                    id: 'q6-3',
                    question: 'What does `range(2, 10, 3)` generate?',
                    type: 'predict_output',
                    options: ['2, 5, 8', '2, 3, 4, 5, 6, 7, 8, 9', '2, 5, 8, 11', '3, 6, 9'],
                    correctAnswer: 0,
                    explanation: 'Starts at 2, adds 3 each step: 2, 5, 8 (next would be 11, which is >= 10).',
                    topic: 'range',
                },
                {
                    id: 'q6-4',
                    question: 'How many times does the print statement execute in:\nfor i in range(3):\n    for j in range(4):\n        print(i, j)',
                    type: 'predict_output',
                    options: ['7', '12', '3', '4'],
                    correctAnswer: 1,
                    explanation: 'Outer loop (3) × Inner loop (4) = 12 total executions.',
                    topic: 'nested_loops',
                },
                {
                    id: 'q6-5',
                    question: 'What keyword immediately skips to the next iteration of a loop?',
                    type: 'mcq',
                    options: ['break', 'continue', 'pass', 'skip'],
                    correctAnswer: 1,
                    explanation: '`continue` skips the rest of the current iteration and begins the next pass.',
                    topic: 'while_loops',
                },
                {
                    id: 'q6-6',
                    question: 'What is the output of this code?\ntotal = 0\nfor i in range(1, 4):\n    total += i\nprint(total)',
                    codeSnippet: 'total = 0\nfor i in range(1, 4):\n    total += i\nprint(total)',
                    type: 'predict_output',
                    options: ['6', '4', '3', '10'],
                    correctAnswer: 0,
                    explanation: 'total = 1 + 2 + 3 = 6.',
                    topic: 'accumulators',
                },
                {
                    id: 'q6-7',
                    question: 'What is an "off-by-one" error?',
                    type: 'conceptual',
                    options: [
                        'A loop iterating 1 time too few or 1 time too many due to a boundary mismatch',
                        'A mathematical calculation where 2 + 2 = 5',
                        'A typo in variable name',
                    ],
                    correctAnswer: 0,
                    explanation: 'Off-by-one errors happen when loop bounds (< vs <=) are slightly misconfigured.',
                    topic: 'debugging',
                },
                {
                    id: 'q6-8',
                    question: 'What numbers are generated by `range(5, 0, -2)`?',
                    type: 'predict_output',
                    options: ['5, 3, 1', '5, 4, 3, 2, 1', '5, 3', '5, 0'],
                    correctAnswer: 0,
                    explanation: '5, 5-2=3, 3-2=1 (next is -1, which is <= 0).',
                    topic: 'range',
                },
                {
                    id: 'q6-9',
                    question: 'In a nested while loop, where must the inner loop control variable be re-initialized?',
                    type: 'conceptual',
                    options: [
                        'Inside the outer loop before the inner loop begins',
                        'Outside both loops at the top of file',
                        'After both loops end',
                    ],
                    correctAnswer: 0,
                    explanation: 'It must be reset inside the outer loop so it can run again for each outer pass.',
                    topic: 'nested_loops',
                },
                {
                    id: 'q6-10',
                    question: 'What does `break` do inside a loop?',
                    type: 'conceptual',
                    options: [
                        'Immediately terminates the enclosing loop and jumps to the code below it',
                        'Pauses the program for 1 second',
                        'Restarts the computer',
                    ],
                    correctAnswer: 0,
                    explanation: '`break` exits the nearest enclosing loop immediately.',
                    topic: 'while_loops',
                },
                {
                    id: 'q6-11',
                    question: 'What is the difference between a counter and an accumulator?',
                    type: 'conceptual',
                    options: [
                        'Counters increment by a fixed step (usually 1); accumulators add variable amounts',
                        'Counters are for floats; accumulators are for strings',
                        'They are synonyms',
                    ],
                    correctAnswer: 0,
                    explanation: 'Counters count items; accumulators aggregate values.',
                    topic: 'accumulators',
                },
                {
                    id: 'q6-12',
                    question: 'What is the output of:\nx = 5\nwhile x > 0:\n    x -= 2\nprint(x)',
                    codeSnippet: 'x = 5\nwhile x > 0:\n    x -= 2\nprint(x)',
                    type: 'predict_output',
                    options: ['-1', '0', '1', '5'],
                    correctAnswer: 0,
                    explanation: 'x goes: 5 -> 3 -> 1 -> -1. Since -1 > 0 is False, the loop ends with x = -1.',
                    topic: 'while_loops',
                },
                {
                    id: 'q6-13',
                    question: 'What is generalization in programming?',
                    type: 'conceptual',
                    options: [
                        'Writing flexible code with variable parameters (like N) so it solves general problems',
                        'Copy-pasting code 100 times',
                        'Using only integers',
                    ],
                    correctAnswer: 0,
                    explanation: 'Generalization allows algorithms to handle any input size cleanly.',
                    topic: 'generalization',
                },
                {
                    id: 'q6-14',
                    question: 'What does encapsulation help achieve in program organization?',
                    type: 'conceptual',
                    options: [
                        'Bundling related state, loops, and conditions into self-contained logical units',
                        'Making code harder to read',
                        'Deleting comments',
                    ],
                    correctAnswer: 0,
                    explanation: 'Encapsulation organizes code into maintainable, self-contained components.',
                    topic: 'encapsulation',
                },
                {
                    id: 'q6-15',
                    question: 'What is the output of `print("*" * 3)` in Python?',
                    type: 'predict_output',
                    options: ['"***"', '"* 3"', 'SyntaxError', 'None'],
                    correctAnswer: 0,
                    explanation: 'String repetition duplicates "*" 3 times to produce "***".',
                    topic: 'patterns',
                },
            ],
        },
    },
];

// ══════════════════════════════════════════════════════════════════════
// PHASE 2 MINI PROJECTS (3 Projects)
// ══════════════════════════════════════════════════════════════════════
export const PHASE_2_PROJECTS: PythonProject[] = [
    {
        id: 'p2-project-dice-roller',
        phaseId: 2,
        title: 'Multi-Round Dice Simulator',
        badgeName: 'Random Explorer',
        xpReward: 150,
        difficulty: 'Easy',
        overview: 'Simulate rolling two dice across 3 consecutive rounds, calculate totals, detect doubles, and format a clean game scorecard.',
        problemStatement: 'Create a Python program that simulates rolling two 6-sided dice for 3 consecutive rounds using a for loop. In each round, generate `d1` and `d2`, calculate their `sum`, and if `d1 == d2`, display "Doubles!". At the end, display the grand total score.',
        requirements: [
            'Import the `random` module',
            'Initialize `grand_total = 0` before loop',
            'Use a `for round_num in range(1, 4):` loop for 3 rounds',
            'In each round, roll `d1 = random.randint(1, 6)` and `d2 = random.randint(1, 6)`',
            'Print each round formatted as: `Round X: Die1=A, Die2=B -> Total=C`',
            'Accumulate `grand_total += (d1 + d2)`',
            'Print `Grand Total: X` after the loop completes',
        ],
        sampleOutput: `Round 1: Die1=3, Die2=4 -> Total=7
Round 2: Die1=5, Die2=5 -> Total=10
Round 3: Die1=2, Die2=6 -> Total=8
Grand Total: 25`,
        starterCode: `# Project 1: Multi-Round Dice Simulator
import random

grand_total = 0

# Write your 3-round simulation loop below:
`,
        solutionCode: `import random

grand_total = 0
for round_num in range(1, 4):
    d1 = random.randint(1, 6)
    d2 = random.randint(1, 6)
    round_sum = d1 + d2
    grand_total += round_sum
    print(f"Round {round_num}: Die1={d1}, Die2={d2} -> Total={round_sum}")

print("Grand Total:", grand_total)`,
        hints: [
            { level: 1, title: 'Concept', content: 'Use a for loop running 3 times.' },
            { level: 2, title: 'Approach', content: 'Generate d1 and d2 with random.randint(1, 6) inside the loop.' },
            { level: 3, title: 'Pseudocode', content: 'for round_num in range(1, 4): d1=...; d2=...; grand_total += d1+d2' },
            { level: 4, title: 'Detailed Guidance', content: 'Print grand_total after the loop completes.' },
        ],
        testCases: [
            {
                expectedOutput: '',
                description: 'Generates 3 rounds and grand total output',
                regexPattern: 'Round 1:[\\s\\S]*Round 2:[\\s\\S]*Round 3:[\\s\\S]*Grand Total: \\d+',
            },
        ],
    },
    {
        id: 'p2-project-number-guessing',
        phaseId: 2,
        title: 'Number Guessing Game Engine',
        badgeName: 'Logic Builder',
        xpReward: 150,
        difficulty: 'Medium',
        overview: 'Build an interactive number guessing engine with directional Higher/Lower hints, attempt tracking, and victory feedback.',
        problemStatement: 'Build a number guessing simulation. Given a secret number `secret = 37` and simulated guesses `[20, 50, 37]`, loop through each guess, track `attempts`, and print "Too Low" (if guess < secret), "Too High" (if guess > secret), or "Correct! Found in X attempts 🎉" (and break).',
        requirements: [
            'Define `secret = 37`',
            'Given `guesses = [20, 50, 37]`',
            'Initialize `attempts = 0`',
            'In a loop, check each guess:',
            '- If `g < secret`: print "Too Low!"',
            '- If `g > secret`: print "Too High!"',
            '- If `g == secret`: print "Correct! Found in 3 attempts 🎉" and `break`',
        ],
        sampleOutput: `Guess: 20 -> Too Low!
Guess: 50 -> Too High!
Guess: 37 -> Correct! Found in 3 attempts 🎉`,
        starterCode: `# Project 2: Number Guessing Game Engine
secret = 37
guesses = [20, 50, 37]
attempts = 0

# Write guessing engine loop below:
`,
        solutionCode: `secret = 37
guesses = [20, 50, 37]
attempts = 0

for g in guesses:
    attempts += 1
    if g == secret:
        print(f"Guess: {g} -> Correct! Found in {attempts} attempts 🎉")
        break
    elif g > secret:
        print(f"Guess: {g} -> Too High!")
    else:
        print(f"Guess: {g} -> Too Low!")`,
        hints: [
            { level: 1, title: 'Concept', content: 'Iterate through the guesses list.' },
            { level: 2, title: 'Approach', content: 'Check if g == secret, elif g > secret, else.' },
            { level: 3, title: 'Pseudocode', content: 'attempts += 1\\nif g == secret: break' },
            { level: 4, title: 'Detailed Guidance', content: 'Break immediately upon matching the secret.' },
        ],
        testCases: [
            {
                expectedOutput: `Guess: 20 -> Too Low!
Guess: 50 -> Too High!
Guess: 37 -> Correct! Found in 3 attempts 🎉`,
                description: 'Matches exact guessing output and attempt count',
            },
        ],
    },
    {
        id: 'p2-project-rock-paper-scissors',
        phaseId: 2,
        title: 'Rock Paper Scissors Tournament',
        badgeName: 'Control Flow Master',
        xpReward: 200,
        difficulty: 'Medium',
        overview: 'Build a multi-round Rock-Paper-Scissors tournament engine with score tracking and victory declaration.',
        problemStatement: 'Simulate a 3-round tournament between Player and Computer. Given moves: `player_moves = ["Rock", "Paper", "Scissors"]` and `computer_moves = ["Scissors", "Paper", "Rock"]`. Evaluate each round, update `player_score` and `computer_score`, and declare the tournament winner at the end.',
        requirements: [
            'Initialize `player_score = 0` and `computer_score = 0`',
            'Given `player_moves = ["Rock", "Paper", "Scissors"]` and `computer_moves = ["Scissors", "Paper", "Rock"]`',
            'Loop through the 3 rounds (indices 0, 1, 2)',
            'Evaluate rules: Rock beats Scissors, Scissors beats Paper, Paper beats Rock, identical is Tie',
            'Increment matching scores (+1 to winner)',
            'Print round results and final winner declaration',
        ],
        sampleOutput: `Round 1: Player=Rock vs Computer=Scissors -> Player Wins!
Round 2: Player=Paper vs Computer=Paper -> It's a Tie!
Round 3: Player=Scissors vs Computer=Rock -> Computer Wins!
Final Score: Player 1 - Computer 1
Tournament Result: Draw!`,
        starterCode: `# Project 3: Rock Paper Scissors Tournament
player_moves = ["Rock", "Paper", "Scissors"]
computer_moves = ["Scissors", "Paper", "Rock"]
player_score = 0
computer_score = 0

# Write tournament simulation below:
`,
        solutionCode: `player_moves = ["Rock", "Paper", "Scissors"]
computer_moves = ["Scissors", "Paper", "Rock"]
player_score = 0
computer_score = 0

for i in range(3):
    p = player_moves[i]
    c = computer_moves[i]
    if p == c:
        res = "It's a Tie!"
    elif (p == "Rock" and c == "Scissors") or (p == "Scissors" and c == "Paper") or (p == "Paper" and c == "Rock"):
        res = "Player Wins!"
        player_score += 1
    else:
        res = "Computer Wins!"
        computer_score += 1
    print(f"Round {i + 1}: Player={p} vs Computer={c} -> {res}")

print(f"Final Score: Player {player_score} - Computer {computer_score}")
if player_score > computer_score:
    print("Tournament Result: Player Champions! 🏆")
elif computer_score > player_score:
    print("Tournament Result: Computer Wins! 🤖")
else:
    print("Tournament Result: Draw!")`,
        hints: [
            { level: 1, title: 'Concept', content: 'Use a for loop over range(3).' },
            { level: 2, title: 'Approach', content: 'Check Tie first with p == c, then check player winning moves.' },
            { level: 3, title: 'Pseudocode', content: 'if (p=="Rock" and c=="Scissors")... player_score += 1' },
            { level: 4, title: 'Detailed Guidance', content: 'Print final score and Draw/Win status.' },
        ],
        testCases: [
            {
                expectedOutput: `Round 1: Player=Rock vs Computer=Scissors -> Player Wins!
Round 2: Player=Paper vs Computer=Paper -> It's a Tie!
Round 3: Player=Scissors vs Computer=Rock -> Computer Wins!
Final Score: Player 1 - Computer 1
Tournament Result: Draw!`,
                description: 'Matches exact tournament rounds and score summary',
            },
        ],
    },
];

// ══════════════════════════════════════════════════════════════════════
// PHASE 2 FINAL ASSESSMENT (35 Questions across 5 Sections)
// ══════════════════════════════════════════════════════════════════════
export const PHASE_2_ASSESSMENT: PythonAssessment = {
    id: 'p2-final-assessment',
    phaseId: 2,
    title: 'Control Flow & Iteration Comprehensive Assessment',
    description: 'The definitive Unit II exam testing conditions, Boolean logic, random generation, while loops, for loops, range parameters, nested loops, and flowcharts.',
    durationMinutes: 50,
    passingScorePercent: 70,
    xpReward: 200,
    totalPoints: 100,
    sections: [
        { id: 'A', title: 'Section A — Concepts', description: '10 Questions testing core conditional rules, logical operators, and loop mechanics.', questionCount: 10 },
        { id: 'B', title: 'Section B — Output Prediction', description: '10 Questions predicting output of if-elif trees, range steps, and nested loops.', questionCount: 10 },
        { id: 'C', title: 'Section C — Debugging & Diagnostics', description: '5 Questions diagnosing off-by-one errors, infinite loops, and indentation bugs.', questionCount: 5 },
        { id: 'D', title: 'Section D — Flowchart & Logic Tracing', description: '5 Questions tracing visual flowcharts and state diagrams.', questionCount: 5 },
        { id: 'E', title: 'Section E — Live Coding Problems', description: '5 Coding problems (2 Easy, 2 Medium, 1 Hard) evaluated against test suites.', questionCount: 5 },
    ],
    questions: [
        // Section A — Concepts (10 Questions, 2 pts each = 20 pts)
        {
            id: 'ass2-a-1',
            section: 'A',
            sectionTitle: 'Concepts',
            title: 'Logical AND Truth Table',
            question: 'When does `A and B` evaluate to True in Python?',
            options: ['Only when BOTH A and B are True', 'When at least one is True', 'When neither is True', 'Always'],
            correctAnswer: 0,
            points: 2,
            topic: 'booleans',
            explanation: 'Logical and requires both conditions to be True.',
        },
        {
            id: 'ass2-a-2',
            section: 'A',
            sectionTitle: 'Concepts',
            title: 'randint Endpoints',
            question: 'Are both endpoints inclusive in `random.randint(1, 10)`?',
            options: ['Yes, both 1 and 10 can be generated', 'No, 10 is excluded', 'No, 1 is excluded', 'Neither is included'],
            correctAnswer: 0,
            points: 2,
            topic: 'random',
            explanation: '`randint(a, b)` includes both a and b.',
        },
        {
            id: 'ass2-a-3',
            section: 'A',
            sectionTitle: 'Concepts',
            title: 'while Loop Termination',
            question: 'What causes a while loop to terminate?',
            options: ['When its condition evaluates to False', 'When it reaches line 100', 'After 5 seconds automatically', 'When print is called'],
            correctAnswer: 0,
            points: 2,
            topic: 'while_loops',
            explanation: 'A while loop runs as long as its condition is True and stops when False.',
        },
        {
            id: 'ass2-a-4',
            section: 'A',
            sectionTitle: 'Concepts',
            title: 'range() Stop Bound',
            question: 'Is the `stop` value included in `range(start, stop)`?',
            options: ['No, the stop value is always excluded', 'Yes, always included', 'Only if stop is an even number'],
            correctAnswer: 0,
            points: 2,
            topic: 'range',
            explanation: '`range()` generates up to but not including the stop value.',
        },
        {
            id: 'ass2-a-5',
            section: 'A',
            sectionTitle: 'Concepts',
            title: 'Equality Operator',
            question: 'Which operator checks whether two variables store equal values?',
            options: ['=', '==', '===', 'equals'],
            correctAnswer: 1,
            points: 2,
            topic: 'conditions',
            explanation: '`==` is equality comparison; `=` is variable assignment.',
        },
        {
            id: 'ass2-a-6',
            section: 'A',
            sectionTitle: 'Concepts',
            title: 'break Statement Role',
            question: 'What does the `break` statement accomplish inside a loop?',
            options: ['Immediately terminates the enclosing loop', 'Skips to the next iteration', 'Restarts the loop from 0', 'Prints an error'],
            correctAnswer: 0,
            points: 2,
            topic: 'while_loops',
            explanation: '`break` exits the nearest enclosing loop immediately.',
        },
        {
            id: 'ass2-a-7',
            section: 'A',
            sectionTitle: 'Concepts',
            title: 'Modulus Even Check',
            question: 'What arithmetic expression checks if integer `n` is even?',
            options: ['n % 2 == 0', 'n // 2 == 0', 'n / 2 == 0', 'n == 2'],
            correctAnswer: 0,
            points: 2,
            topic: 'conditions',
            explanation: 'Even numbers leave a remainder of 0 when divided by 2.',
        },
        {
            id: 'ass2-a-8',
            section: 'A',
            sectionTitle: 'Concepts',
            title: 'Nested Loop Total Passes',
            question: 'If outer loop runs 3 times and inner loop runs 4 times, how many total passes does the inner body execute?',
            options: ['7', '12', '4', '3'],
            correctAnswer: 1,
            points: 2,
            topic: 'nested_loops',
            explanation: 'Outer × Inner = 3 × 4 = 12 total passes.',
        },
        {
            id: 'ass2-a-9',
            section: 'A',
            sectionTitle: 'Concepts',
            title: 'random.choice Target',
            question: 'What types of data can be passed to `random.choice()`?',
            options: ['Any sequence (like lists, tuples, or strings)', 'Only integers', 'Only files', 'Only booleans'],
            correctAnswer: 0,
            points: 2,
            topic: 'random',
            explanation: '`random.choice` accepts any indexable sequence.',
        },
        {
            id: 'ass2-a-10',
            section: 'A',
            sectionTitle: 'Concepts',
            title: 'Encapsulation Definition',
            question: 'What is encapsulation in program organization?',
            options: [
                'Packaging related data, conditions, and loops into self-contained logical units',
                'Translating code to binary',
                'Deleting unused files',
            ],
            correctAnswer: 0,
            points: 2,
            topic: 'encapsulation',
            explanation: 'Encapsulation organizes related logic into cohesive units.',
        },

        // Section B — Predict Output (10 Questions, 2 pts each = 20 pts)
        {
            id: 'ass2-b-1',
            section: 'B',
            sectionTitle: 'Predict Output',
            title: 'Compound Boolean Evaluation',
            question: 'What is printed by `print(not (5 > 2 and 10 < 20))`?',
            codeSnippet: 'print(not (5 > 2 and 10 < 20))',
            options: ['True', 'False', 'None', 'Error'],
            correctAnswer: 1,
            points: 2,
            topic: 'booleans',
            explanation: '5 > 2 is True; 10 < 20 is True. True and True is True. not True is False.',
        },
        {
            id: 'ass2-b-2',
            section: 'B',
            sectionTitle: 'Predict Output',
            title: 'Step Range Output',
            question: 'What is printed by this loop?\nfor i in range(1, 8, 3):\n    print(i)',
            codeSnippet: 'for i in range(1, 8, 3):\n    print(i)',
            options: ['1, 4, 7 on separate lines', '1, 2, 3, 4, 5, 6, 7', '3, 6', '1, 4, 7, 10'],
            correctAnswer: 0,
            points: 2,
            topic: 'range',
            explanation: 'Starts at 1, step by 3: 1, 4, 7 (next is 10, which is >= 8).',
        },
        {
            id: 'ass2-b-3',
            section: 'B',
            sectionTitle: 'Predict Output',
            title: 'while Loop Decrement Output',
            question: 'What is printed by this code?\nx = 4\nwhile x > 1:\n    print(x)\n    x -= 1',
            codeSnippet: 'x = 4\nwhile x > 1:\n    print(x)\n    x -= 1',
            options: ['4, 3, 2 on separate lines', '4, 3, 2, 1', '4, 3', '1, 2, 3, 4'],
            correctAnswer: 0,
            points: 2,
            topic: 'while_loops',
            explanation: 'Prints 4, 3, 2. When x becomes 1, 1 > 1 is False.',
        },
        {
            id: 'ass2-b-4',
            section: 'B',
            sectionTitle: 'Predict Output',
            title: 'Accumulator Loop Result',
            question: 'What is printed by this code?\ns = 0\nfor i in range(1, 5):\n    s += i\nprint(s)',
            codeSnippet: 's = 0\nfor i in range(1, 5):\n    s += i\nprint(s)',
            options: ['10', '15', '5', '4'],
            correctAnswer: 0,
            points: 2,
            topic: 'accumulators',
            explanation: '1 + 2 + 3 + 4 = 10.',
        },
        {
            id: 'ass2-b-5',
            section: 'B',
            sectionTitle: 'Predict Output',
            title: 'if-elif-else Execution Order',
            question: 'What is printed by this code?\nval = 75\nif val >= 90:\n    print("A")\nelif val >= 70:\n    print("B")\nelif val >= 50:\n    print("C")\nelse:\n    print("D")',
            codeSnippet: 'val = 75\nif val >= 90:\n    print("A")\nelif val >= 70:\n    print("B")\nelif val >= 50:\n    print("C")\nelse:\n    print("D")',
            options: ['B', 'C', 'B and C', 'D'],
            correctAnswer: 0,
            points: 2,
            topic: 'conditions',
            explanation: '75 >= 70 is True, so "B" prints and execution skips remaining elif blocks.',
        },
        {
            id: 'ass2-b-6',
            section: 'B',
            sectionTitle: 'Predict Output',
            title: 'Modulus Arithmetic Output',
            question: 'What is printed by `print(25 % 7)`?',
            codeSnippet: 'print(25 % 7)',
            options: ['4', '3', '3.5', '1'],
            correctAnswer: 0,
            points: 2,
            topic: 'conditions',
            explanation: '7 * 3 = 21. 25 - 21 = 4. Remainder is 4.',
        },
        {
            id: 'ass2-b-7',
            section: 'B',
            sectionTitle: 'Predict Output',
            title: 'Countdown Negative Step',
            question: 'What is the output of `for i in range(3, 0, -1): print(i)`?',
            codeSnippet: 'for i in range(3, 0, -1): print(i)',
            options: ['3, 2, 1 on separate lines', '3, 2, 1, 0', '0, 1, 2, 3', 'Error'],
            correctAnswer: 0,
            points: 2,
            topic: 'range',
            explanation: 'Counts down: 3, 2, 1 (0 is excluded).',
        },
        {
            id: 'ass2-b-8',
            section: 'B',
            sectionTitle: 'Predict Output',
            title: 'Nested Loop Iteration',
            question: 'What is printed by:\nfor i in range(2):\n    for j in range(2):\n        print(i + j)',
            codeSnippet: 'for i in range(2):\n    for j in range(2):\n        print(i + j)',
            options: ['0, 1, 1, 2 on separate lines', '0, 1, 2, 3', '0, 0, 1, 1', '4'],
            correctAnswer: 0,
            points: 2,
            topic: 'nested_loops',
            explanation: '(0+0=0), (0+1=1), (1+0=1), (1+1=2).',
        },
        {
            id: 'ass2-b-9',
            section: 'B',
            sectionTitle: 'Predict Output',
            title: 'break Statement in Loop',
            question: 'What is printed by:\nfor i in range(1, 10):\n    if i == 3:\n        break\n    print(i)',
            codeSnippet: 'for i in range(1, 10):\n    if i == 3:\n        break\n    print(i)',
            options: ['1, 2 on separate lines', '1, 2, 3', '3', '1 to 9'],
            correctAnswer: 0,
            points: 2,
            topic: 'for_loops',
            explanation: 'Prints 1, 2. When i == 3, break exits before printing 3.',
        },
        {
            id: 'ass2-b-10',
            section: 'B',
            sectionTitle: 'Predict Output',
            title: 'Counter Inside Condition',
            question: 'What is printed by this code?\nc = 0\nfor x in [2, 7, 4, 9, 6]:\n    if x % 2 == 0:\n        c += 1\nprint(c)',
            codeSnippet: 'c = 0\nfor x in [2, 7, 4, 9, 6]:\n    if x % 2 == 0:\n        c += 1\nprint(c)',
            options: ['3', '2', '5', '0'],
            correctAnswer: 0,
            points: 2,
            topic: 'counters',
            explanation: 'Evens are 2, 4, 6 (3 total even numbers).',
        },

        // Section C — Debugging (5 Questions, 3 pts each = 15 pts)
        {
            id: 'ass2-c-1',
            section: 'C',
            sectionTitle: 'Debugging',
            title: 'Fix Infinite Loop Bug',
            question: 'Why does this code run in an infinite loop?\n```python\ncount = 1\nwhile count <= 5:\n    print(count)\n```',
            options: [
                '`count` is never updated inside the loop, so `count <= 5` stays True forever',
                'while loops cannot count to 5',
                'print statement is broken',
                'count is an invalid name',
            ],
            correctAnswer: 0,
            points: 3,
            topic: 'debugging',
            explanation: 'Missing `count += 1` causes an infinite loop.',
        },
        {
            id: 'ass2-c-2',
            section: 'C',
            sectionTitle: 'Debugging',
            title: 'Fix Off-by-One Boundary',
            question: 'A student wants to print numbers 1 to 10 inclusive, but wrote `for i in range(1, 10): print(i)`. How should this be fixed?',
            options: ['Change range(1, 10) to range(1, 11)', 'Change range(1, 10) to range(10)', 'Add another print', 'Change to while i < 10'],
            correctAnswer: 0,
            points: 3,
            topic: 'debugging',
            explanation: '`range()` stop bound is exclusive, so range(1, 11) is required to include 10.',
        },
        {
            id: 'ass2-c-3',
            section: 'C',
            sectionTitle: 'Debugging',
            title: 'Fix Equality Typo',
            question: 'Why does `if x = 10:` cause a SyntaxError in Python?',
            options: [
                '`=` is the assignment operator; comparison requires `==` (`if x == 10:`)',
                '10 is not in quotes',
                'x cannot be compared',
                'if is misspelled',
            ],
            correctAnswer: 0,
            points: 3,
            topic: 'debugging',
            explanation: '`=` assigns values; `==` is required for conditional equality checks.',
        },
        {
            id: 'ass2-c-4',
            section: 'C',
            sectionTitle: 'Debugging',
            title: 'Fix Accumulator Scope Bug',
            question: 'What is wrong with this code?\n```python\nfor i in range(1, 4):\n    total = 0\n    total += i\nprint(total)\n```',
            options: [
                '`total = 0` is inside the loop, so it resets to 0 on every iteration and only prints the last number (3)',
                'range is wrong',
                'total cannot be 0',
                'print is broken',
            ],
            correctAnswer: 0,
            points: 3,
            topic: 'debugging',
            explanation: 'Accumulators must be initialized before the loop, not inside.',
        },
        {
            id: 'ass2-c-5',
            section: 'C',
            sectionTitle: 'Debugging',
            title: 'Fix Missing Colon',
            question: 'What syntax error exists in `if age >= 18 print("Adult")`?',
            options: ['Missing colon `:` after `age >= 18`', 'Missing semicolon', 'print cannot follow if', 'age must be in quotes'],
            correctAnswer: 0,
            points: 3,
            topic: 'debugging',
            explanation: 'Python requires a colon `:` after the if condition.',
        },

        // Section D — Flowchart & Logic Questions (5 Questions, 3 pts each = 15 pts)
        {
            id: 'ass2-d-1',
            section: 'D',
            sectionTitle: 'Flowcharts & Logic',
            title: 'Trace Flowchart for Odd Number',
            question: 'In a flowchart that checks `number % 2 == 0`: if number is 7, which path is taken and what is the result?',
            flowchartAscii: `Input number = 7
       |
       v
number % 2 == 0?
 /           \\
YES           NO
 |             |
Even          Odd`,
            options: ['Path NO -> Odd', 'Path YES -> Even', 'Both paths', 'None'],
            correctAnswer: 0,
            points: 3,
            topic: 'conditions',
            explanation: '7 % 2 is 1 (not 0), so it takes the NO path and outputs "Odd".',
        },
        {
            id: 'ass2-d-2',
            section: 'D',
            sectionTitle: 'Flowcharts & Logic',
            title: 'Trace while Loop Count',
            question: 'Trace the flowchart below. How many times does the "Execute" block run before ending when `count = 1` and condition is `count <= 3`?',
            flowchartAscii: `count = 1
   |
   v
count <= 3? ---> NO ---> [ END ]
   | YES
   v
[ Execute: print & count += 1 ]
   |
   +---> [Loop back to condition]`,
            options: ['3 times', '4 times', '2 times', 'Infinite'],
            correctAnswer: 0,
            points: 3,
            topic: 'while_loops',
            explanation: 'Runs for count = 1, 2, 3 (3 times total). When count reaches 4, it exits.',
        },
        {
            id: 'ass2-d-3',
            section: 'D',
            sectionTitle: 'Flowcharts & Logic',
            title: 'Decision Tree Multi-branch',
            question: 'In the grading tree below, if `marks = 85`, which grade box is reached?',
            flowchartAscii: `marks >= 90? ---> YES ---> [ A+ ]
    | NO
marks >= 80? ---> YES ---> [ A ]
    | NO
marks >= 70? ---> YES ---> [ B ]
    | NO
  [ C ]`,
            options: ['Grade A', 'Grade A+', 'Grade B', 'Grade C'],
            correctAnswer: 0,
            points: 3,
            topic: 'conditions',
            explanation: '85 >= 90 is False; 85 >= 80 is True -> reaches Grade A.',
        },
        {
            id: 'ass2-d-4',
            section: 'D',
            sectionTitle: 'Flowcharts & Logic',
            title: 'Nested Decision Path',
            question: 'In the nested security gate, if `is_admin = False` and `has_vip = True`, what is the final outcome?',
            flowchartAscii: `is_admin? ---> YES ---> [ Admin Access ]
   | NO
has_vip?  ---> YES ---> [ VIP Access ]
   | NO
[ Standard Guest ]`,
            options: ['VIP Access', 'Admin Access', 'Standard Guest', 'Blocked'],
            correctAnswer: 0,
            points: 3,
            topic: 'conditions',
            explanation: 'is_admin is False -> checks has_vip (True) -> VIP Access.',
        },
        {
            id: 'ass2-d-5',
            section: 'D',
            sectionTitle: 'Flowcharts & Logic',
            title: 'Loopbreak Condition Flow',
            question: 'In a loop running numbers `1, 2, 3, 4, 5`: if a check `if i == 3: break` exists before print, how many numbers are printed?',
            options: ['2 numbers (1 and 2)', '3 numbers (1, 2, 3)', '5 numbers', '0 numbers'],
            correctAnswer: 0,
            points: 3,
            topic: 'for_loops',
            explanation: 'Prints 1, prints 2. When i is 3, break executes before print, so only 2 numbers are printed.',
        },

        // Section E — Live Coding Problems (5 Problems, 6 pts each = 30 pts)
        {
            id: 'ass2-e-1',
            section: 'E',
            sectionTitle: 'Coding Problems',
            title: 'Problem 1 (Easy): Divisibility by 3 and 5',
            question: 'Given `num = 15`. If `num % 3 == 0 and num % 5 == 0`, print "Divisible by Both". Otherwise print "Not Divisible by Both".',
            difficulty: 'Easy',
            points: 6,
            topic: 'conditions',
            starterCode: 'num = 15\n# Check divisibility by 3 and 5:\n',
            solutionCode: 'num = 15\nif num % 3 == 0 and num % 5 == 0:\n    print("Divisible by Both")\nelse:\n    print("Not Divisible by Both")',
            testCases: [{ expectedOutput: 'Divisible by Both', description: 'Outputs Divisible by Both for 15' }],
        },
        {
            id: 'ass2-e-2',
            section: 'E',
            sectionTitle: 'Coding Problems',
            title: 'Problem 2 (Easy): Multiplication Table for 7',
            question: 'Print the 7 times table from 7 × 1 up to 7 × 4 in format "7 x i = result".',
            difficulty: 'Easy',
            points: 6,
            topic: 'for_loops',
            starterCode: '# Print 7 times table for 1..4:\n',
            solutionCode: 'for i in range(1, 5):\n    print("7 x", i, "=", 7 * i)',
            testCases: [
                {
                    expectedOutput: '7 x 1 = 7\n7 x 2 = 14\n7 x 3 = 21\n7 x 4 = 28',
                    description: 'Outputs 4 lines of 7 times table',
                },
            ],
        },
        {
            id: 'ass2-e-3',
            section: 'E',
            sectionTitle: 'Coding Problems',
            title: 'Problem 3 (Medium): Sum of Squares 1 to N',
            question: 'Given `N = 4`, calculate the sum of squares $1^2 + 2^2 + 3^2 + 4^2 = 1 + 4 + 9 + 16 = 30$. Print the total.',
            difficulty: 'Medium',
            points: 6,
            topic: 'accumulators',
            starterCode: 'N = 4\n# Calculate sum of squares:\n',
            solutionCode: 'N = 4\ntotal = 0\nfor i in range(1, N + 1):\n    total += i ** 2\nprint(total)',
            testCases: [{ expectedOutput: '30', description: 'Outputs 30 for N=4' }],
        },
        {
            id: 'ass2-e-4',
            section: 'E',
            sectionTitle: 'Coding Problems',
            title: 'Problem 4 (Medium): Count Evens in Range 1 to 20',
            question: 'Count how many even numbers exist in `range(1, 21)`. Print the total count.',
            difficulty: 'Medium',
            points: 6,
            topic: 'counters',
            starterCode: 'count = 0\n# Count even numbers in 1..20:\n',
            solutionCode: 'count = 0\nfor i in range(1, 21):\n    if i % 2 == 0:\n        count += 1\nprint(count)',
            testCases: [{ expectedOutput: '10', description: 'Outputs 10' }],
        },
        {
            id: 'ass2-e-5',
            section: 'E',
            sectionTitle: 'Coding Problems',
            title: 'Problem 5 (Hard): Right-Angled Star Triangle (4 Rows)',
            question: 'Print a 4-row right-angled star triangle:\n*\n**\n***\n****',
            difficulty: 'Hard',
            points: 6,
            topic: 'patterns',
            starterCode: '# Print 4-row star triangle:\n',
            solutionCode: 'for i in range(1, 5):\n    print("*" * i)',
            testCases: [{ expectedOutput: '*\n**\n***\n****', description: 'Outputs 4-row star triangle' }],
        },
    ],
};

// ══════════════════════════════════════════════════════════════════════
// UNIT II EXAM REVISION CHEAT-SHEETS & SUMMARY
// ══════════════════════════════════════════════════════════════════════
export const UNIT_2_EXAM_REVISION = {
    unitTitle: 'Unit II — Control Flow & Iteration Revision Hub',
    keyDefinitions: [
        { term: 'Conditional Statement', definition: 'A programming statement that controls execution flow based on whether a Boolean expression evaluates to True or False (if, if-else, if-elif-else).' },
        { term: 'Boolean Expression', definition: 'An expression that evaluates to one of two logical states: True or False.' },
        { term: 'Logical Operators', definition: 'Keywords (`and`, `or`, `not`) used to combine or negate Boolean expressions.' },
        { term: 'Modulus Operator (%)', definition: 'An arithmetic operator returning the remainder of integer division, widely used for even/odd testing (`n % 2 == 0`).' },
        { term: 'while Loop', definition: 'An indefinite loop that repeatedly executes its block as long as its controlling Boolean condition evaluates to True.' },
        { term: 'for Loop', definition: 'A definite loop that iterates over a sequence or range of values automatically.' },
        { term: 'range(start, stop, step)', definition: 'A built-in sequence generator generating integers from start up to stop (exclusive) by step increments.' },
        { term: 'Nested Loop', definition: 'A loop placed inside the body of another loop, commonly used for 2D grids, matrices, and pattern printing.' },
        { term: 'Accumulator', definition: 'A variable initialized before a loop that gathers a running sum or aggregate across iterations (`total += val`).' },
        { term: 'Encapsulation', definition: 'The software design practice of grouping related variables, conditions, and operations into self-contained logical units.' },
        { term: 'Generalization', definition: 'Designing logic with variable parameters (like N) so it solves general problems rather than a single hard-coded instance.' },
    ],
    syntaxCheatsheet: [
        { syntax: 'if cond:\n    ...', purpose: 'Executes block if condition is True' },
        { syntax: 'if cond:\n    ...\nelse:\n    ...', purpose: 'Provides alternative fallback branch if condition is False' },
        { syntax: 'if c1:\n    ...\nelif c2:\n    ...\nelse:\n    ...', purpose: 'Multi-way sequential decision tree; executes first matching branch' },
        { syntax: 'import random\nrandom.randint(a, b)', purpose: 'Generates inclusive random integer where a <= N <= b' },
        { syntax: 'random.choice(sequence)', purpose: 'Selects a single random item from a list or string' },
        { syntax: 'while condition:\n    ...', purpose: 'Repeats block while condition remains True' },
        { syntax: 'for i in range(stop):\n    ...', purpose: 'Iterates from 0 up to stop - 1' },
        { syntax: 'for i in range(start, stop, step):\n    ...', purpose: 'Iterates from start to stop - 1 with custom step increments' },
        { syntax: 'break', purpose: 'Immediately terminates the enclosing loop' },
        { syntax: 'continue', purpose: 'Skips remainder of current iteration and begins next pass' },
    ],
    commonPitfalls: [
        { pitfall: 'Using = instead of == in if condition', fix: 'Use == for comparison: `if x == 10:`' },
        { pitfall: 'Forgetting colon (:) after if, elif, else, while, for', fix: 'Always end header lines with a colon :' },
        { pitfall: 'Forgetting loop update in while loop', fix: 'Ensure LCV is incremented (e.g. `count += 1`) inside loop body' },
        { pitfall: 'Off-by-one error in range() stop bound', fix: 'Remember stop bound is excluded: `range(1, 11)` for numbers 1 to 10' },
        { pitfall: 'Initializing accumulator inside loop body', fix: 'Initialize `total = 0` BEFORE the loop begins' },
        { pitfall: 'Not re-initializing inner variable in nested while', fix: 'Reset `j = 0` inside the outer while loop' },
    ],
};

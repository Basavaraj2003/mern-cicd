import { IssueType } from '@/components/Report';
import { v4 as uuidv4 } from 'uuid';
import { saveAnalysisResult, AnalysisResult } from './mongoDbService';

// Example rules for JavaScript/TypeScript
const rules = [
  {
    id: 'no-var',
    check: (code: string) => {
      const matches = code.match(/var\s+\w+/g);
      if (matches) {
        return matches.map((match, index) => {
          const line = code.substring(0, code.indexOf(match)).split('\n').length;
          const column = code.split('\n')[line - 1].indexOf('var') + 1;
          return {
            id: uuidv4(),
            line,
            column,
            severity: 'warning' as 'warning',
            message: 'Use let or const instead of var',
            rule: 'no-var',
          };
        });
      }
      return [];
    },
  },
  {
    id: 'no-console',
    check: (code: string) => {
      const matches = code.match(/console\.\w+\(/g);
      if (matches) {
        return matches.map((match, index) => {
          const line = code.substring(0, code.indexOf(match)).split('\n').length;
          const column = code.split('\n')[line - 1].indexOf('console') + 1;
          return {
            id: uuidv4(),
            line,
            column,
            severity: 'info' as 'info',
            message: 'Avoid using console statements in production code',
            rule: 'no-console',
          };
        });
      }
      return [];
    },
  },
  {
    id: 'no-unused-vars',
    check: (code: string) => {
      // This is a simplified check and won't catch all cases
      const varDeclarations = code.match(/(?:let|const|var)\s+(\w+)(?:\s*=\s*[^;]+)?;/g);
      if (!varDeclarations) return [];
      
      const issues: IssueType[] = [];
      
      varDeclarations.forEach(declaration => {
        const varName = declaration.match(/(?:let|const|var)\s+(\w+)/)?.[1];
        if (varName) {
          // Check if the variable name appears elsewhere in the code (excluding its declaration)
          const declarationPos = code.indexOf(declaration);
          const restOfCode = code.substring(declarationPos + declaration.length);
          
          // Very simple check - this would need to be much more sophisticated in reality
          if (!new RegExp(`\\b${varName}\\b`).test(restOfCode)) {
            const line = code.substring(0, declarationPos).split('\n').length;
            const column = code.split('\n')[line - 1].indexOf(varName) + 1;
            
            issues.push({
              id: uuidv4(),
              line,
              column,
              severity: 'warning' as 'warning',
              message: `Unused variable: ${varName}`,
              rule: 'no-unused-vars',
            });
          }
        }
      });
      
      return issues;
    },
  },
  {
    id: 'missing-semicolon',
    check: (code: string) => {
      const lines = code.split('\n');
      const issues: IssueType[] = [];
      
      lines.forEach((line, index) => {
        // Check statements that should end with semicolons
        if (/\b(let|const|var|return|throw|break|continue|do|for|if|switch|try|while)\b/.test(line) &&
            !line.trim().endsWith(';') &&
            !line.trim().endsWith('{') &&
            !line.trim().endsWith('}') &&
            !line.trim().endsWith('*/') &&
            line.trim() !== '') {
          issues.push({
            id: uuidv4(),
            line: index + 1,
            column: line.length + 1,
            severity: 'info' as 'info',
            message: 'Missing semicolon',
            rule: 'missing-semicolon',
          });
        }
      });
      
      return issues;
    },
  },
  {
    id: 'no-empty-catch',
    check: (code: string) => {
      // Look for empty catch blocks
      const matches = code.match(/catch\s*\([^)]*\)\s*{\s*}/g);
      if (matches) {
        return matches.map((match) => {
          const matchPos = code.indexOf(match);
          const line = code.substring(0, matchPos).split('\n').length;
          const column = code.split('\n')[line - 1].indexOf('catch') + 1;
          
          return {
            id: uuidv4(),
            line,
            column,
            severity: 'error' as 'error',
            message: 'Empty catch block is a poor error handling practice',
            rule: 'no-empty-catch',
          };
        });
      }
      return [];
    },
  },
  {
    id: 'max-line-length',
    check: (code: string) => {
      const lines = code.split('\n');
      const maxLength = 100;
      const issues: IssueType[] = [];
      
      lines.forEach((line, index) => {
        if (line.length > maxLength) {
          issues.push({
            id: uuidv4(),
            line: index + 1,
            column: maxLength + 1,
            severity: 'info' as 'info',
            message: `Line exceeds maximum length of ${maxLength} characters`,
            rule: 'max-line-length',
          });
        }
      });
      
      return issues;
    },
  },
  {
    id: 'security-eval',
    check: (code: string) => {
      const matches = code.match(/eval\s*\(/g);
      if (matches) {
        return matches.map((match) => {
          const matchPos = code.indexOf(match);
          const line = code.substring(0, matchPos).split('\n').length;
          const column = code.split('\n')[line - 1].indexOf('eval') + 1;
          
          return {
            id: uuidv4(),
            line,
            column,
            severity: 'error' as 'error',
            message: 'Avoid using eval() as it creates security vulnerabilities',
            rule: 'security-eval',
          };
        });
      }
      return [];
    },
  },
];

export async function analyzeCode(code: string): Promise<{
  score: number;
  issues: IssueType[];
  savedId?: string;
}> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Run all rules against the code
  const allIssues: IssueType[] = [];
  
  rules.forEach(rule => {
    const ruleIssues = rule.check(code);
    allIssues.push(...ruleIssues);
  });
  
  // Calculate a score based on issues
  let score = 100;
  
  // Deduct points based on severity
  allIssues.forEach(issue => {
    if (issue.severity === 'error') score -= 10;
    else if (issue.severity === 'warning') score -= 5;
    else if (issue.severity === 'info') score -= 1;
  });
  
  // Ensure score is between 0 and 100
  score = Math.max(0, Math.min(100, score));
  
  // Save result to MongoDB if code is not empty
  let savedId: string | null = null;
  if (code.trim()) {
    try {
      savedId = await saveAnalysisResult({
        code,
        score,
        issues: allIssues,
        timestamp: new Date()
      });
    } catch (error) {
      console.error("Error saving to MongoDB, continuing with local analysis", error);
    }
  }

  return { score, issues: allIssues, savedId: savedId || undefined };
}

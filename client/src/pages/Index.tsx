
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import CodeEditor from '@/components/CodeEditor';
import Report, { IssueType } from '@/components/Report';
import History from '@/components/History';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { sampleCode } from '@/utils/sampleCode';
import { analyzeCode } from '@/services/analyzerService';
import { AnalysisResult } from '@/services/mongoDbService';
import { toast } from 'sonner';

const Index = () => {
  const [code, setCode] = useState(sampleCode);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [reportData, setReportData] = useState<{ score: number; issues: IssueType[] }>({
    score: 0,
    issues: [],
  });
  const [activeTab, setActiveTab] = useState('editor');

  const handleAnalyze = async () => {
    if (!code.trim()) {
      toast.error('Please enter some code to analyze.');
      return;
    }

    setIsAnalyzing(true);
    
    try {
      const result = await analyzeCode(code);
      setReportData(result);
      
      if (result.issues.length === 0) {
        toast.success('No issues found. Your code looks great!');
      } else {
        const errorCount = result.issues.filter(issue => issue.severity === 'error').length;
        if (errorCount > 0) {
          toast.error(`Found ${errorCount} critical issues that need attention.`);
        } else {
          toast.warning(`Found ${result.issues.length} issues to review.`);
        }
      }
    } catch (error) {
      console.error('Error analyzing code:', error);
      toast.error('An error occurred while analyzing your code.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSelectAnalysis = (analysis: AnalysisResult) => {
    setCode(analysis.code);
    setReportData({
      score: analysis.score,
      issues: analysis.issues
    });
    setActiveTab('editor');
    toast.info('Loaded analysis from history');
  };

  // Run initial analysis when component loads
  useEffect(() => {
    handleAnalyze();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Code Quality Analyzer</h2>
            <Button 
              onClick={handleAnalyze} 
              disabled={isAnalyzing}
              className="bg-analyzer-primary hover:bg-analyzer-secondary"
            >
              {isAnalyzing ? 'Analyzing...' : 'Run Analysis'}
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                  <TabsTrigger value="editor">Code Editor</TabsTrigger>
                  <TabsTrigger value="results">Analysis Results</TabsTrigger>
                </TabsList>
                
                <TabsContent value="editor" className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-700">Code Input</h3>
                  <CodeEditor 
                    code={code} 
                    onChange={setCode} 
                    hasError={reportData.issues.some(issue => issue.severity === 'error')}
                  />
                  
                  <div className="text-sm text-gray-500">
                    <p>Enter or paste your code above and click "Run Analysis" to check for issues.</p>
                  </div>
                </TabsContent>
                
                <TabsContent value="results" className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-700">Analysis Results</h3>
                  <Report 
                    isLoading={isAnalyzing}
                    score={reportData.score}
                    issues={reportData.issues}
                  />
                </TabsContent>
              </Tabs>
            </div>

            <div className="space-y-4">
              <History onSelectAnalysis={handleSelectAnalysis} />
            </div>
          </div>
          
          <div className="mt-8">
            <h3 className="text-lg font-medium text-gray-700 mb-4">Documentation</h3>
            
            <Tabs defaultValue="about">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="rules">Rules</TabsTrigger>
                <TabsTrigger value="usage">Usage</TabsTrigger>
              </TabsList>
              
              <TabsContent value="about" className="p-4 border rounded-lg mt-2 bg-white">
                <h4 className="font-medium mb-2">About this analyzer</h4>
                <p className="text-gray-600">
                  CodeAnalyzerPro is an automated tool for ensuring your code complies with company standards
                  and best practices. It helps identify issues early in the development process to maintain
                  high-quality code across your organization.
                </p>
              </TabsContent>
              
              <TabsContent value="rules" className="p-4 border rounded-lg mt-2 bg-white">
                <h4 className="font-medium mb-2">Current Rules</h4>
                <ul className="list-disc pl-5 text-gray-600 space-y-1">
                  <li>no-var: Avoid using var declarations</li>
                  <li>no-console: Avoid console statements in production code</li>
                  <li>no-unused-vars: Detect variables that are declared but never used</li>
                  <li>missing-semicolon: Enforce consistent use of semicolons</li>
                  <li>no-empty-catch: Avoid empty catch blocks</li>
                  <li>max-line-length: Limit maximum line length to improve readability</li>
                  <li>security-eval: Avoid using eval() due to security risks</li>
                </ul>
              </TabsContent>
              
              <TabsContent value="usage" className="p-4 border rounded-lg mt-2 bg-white">
                <h4 className="font-medium mb-2">How to use</h4>
                <ol className="list-decimal pl-5 text-gray-600 space-y-1">
                  <li>Enter or paste your code into the editor</li>
                  <li>Click the "Run Analysis" button to check for issues</li>
                  <li>Review the results in the Analysis Results panel</li>
                  <li>Fix the identified issues in your code</li>
                  <li>Run the analysis again to verify your fixes</li>
                  <li>View your analysis history in the sidebar</li>
                </ol>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <footer className="bg-white border-t py-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm">
            © 2025 CodeAnalyzerPro. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;

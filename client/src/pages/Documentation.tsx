
import React from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const Documentation = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Documentation</h1>
            <p className="mt-2 text-gray-600">Learn how to use all features of the Matrix Code Analyzer.</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Downloadable Reports</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                The Matrix Code Analyzer allows you to download your code analysis results
                as a plain text file for offline viewing or sharing with your team.
              </p>
              
              <h3 className="text-lg font-medium text-gray-800">How to Download Reports</h3>
              <ol className="list-decimal pl-5 space-y-2">
                <li>Run a code analysis on your code</li>
                <li>When the analysis is complete, click the "Download" button in the Analysis Report card</li>
                <li>The report will be downloaded as a text file named "code-analysis-report.txt"</li>
              </ol>
              
              <h3 className="text-lg font-medium text-gray-800">Report Contents</h3>
              <p>The downloaded report includes:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Overall code quality score</li>
                <li>Count of errors, warnings, and info notifications</li>
                <li>Detailed list of all issues found</li>
                <li>Line and column location for each issue</li>
                <li>Rule identifier for each issue</li>
              </ul>
              
              <h3 className="text-lg font-medium text-gray-800">Future Formats</h3>
              <p>
                We're working on additional download formats including PDF and CSV.
                These will be available in future updates.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Supported File Types</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Language</TableHead>
                    <TableHead>File Extensions</TableHead>
                    <TableHead>Support Level</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>JavaScript</TableCell>
                    <TableCell>.js, .jsx</TableCell>
                    <TableCell>Full</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>TypeScript</TableCell>
                    <TableCell>.ts, .tsx</TableCell>
                    <TableCell>Full</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>CSS/SCSS</TableCell>
                    <TableCell>.css, .scss</TableCell>
                    <TableCell>Basic</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>HTML</TableCell>
                    <TableCell>.html, .htm</TableCell>
                    <TableCell>Limited</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
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

export default Documentation;

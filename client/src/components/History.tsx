
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { History as HistoryIcon } from 'lucide-react';
import { getAnalysisHistory, AnalysisResult } from '@/services/mongoDbService';
import { format } from 'date-fns';

interface HistoryProps {
  onSelectAnalysis?: (analysis: AnalysisResult) => void;
}

const History: React.FC<HistoryProps> = ({ onSelectAnalysis }) => {
  const [history, setHistory] = useState<AnalysisResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    setIsLoading(true);
    try {
      const results = await getAnalysisHistory();
      setHistory(results);
    } catch (error) {
      console.error("Failed to load history", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectAnalysis = (analysis: AnalysisResult) => {
    if (onSelectAnalysis) {
      onSelectAnalysis(analysis);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Analysis History</CardTitle>
            <CardDescription>
              Recent code analyses
            </CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={loadHistory}
            disabled={isLoading}
          >
            <HistoryIcon className="h-4 w-4 mr-1" />
            {isLoading ? 'Loading...' : 'Refresh'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {history.length === 0 ? (
          <p className="text-center py-4 text-muted-foreground">
            {isLoading ? 'Loading history...' : 'No analysis history found'}
          </p>
        ) : (
          <div className="space-y-2">
            {history.map((item) => (
              <Card key={item.id} className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={() => handleSelectAnalysis(item)}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Score: <span className={item.score >= 80 ? "text-analyzer-success" : item.score >= 50 ? "text-analyzer-warning" : "text-analyzer-error"}>{item.score}%</span></p>
                      <p className="text-sm text-muted-foreground">
                        Issues: {item.issues.length} ({item.issues.filter(i => i.severity === 'error').length} errors)
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(item.timestamp), 'MMM dd, yyyy')}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(item.timestamp), 'hh:mm a')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default History;

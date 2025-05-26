
import { IssueType } from '@/components/Report';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

// Store for demo purposes (simulates a database)
// In a real app, this would be handled by your Node.js backend
let mockDatabase: AnalysisResult[] = [];

export interface AnalysisResult {
  id?: string;
  code: string;
  score: number;
  issues: IssueType[];
  timestamp: Date;
}

// API endpoint for your backend - ensure this points to your running backend server
const API_URL = 'http://localhost:3001/api';

/**
 * Save analysis result to the backend
 */
export async function saveAnalysisResult(analysis: AnalysisResult): Promise<string | null> {
  try {
    console.log("Attempting to save analysis to:", `${API_URL}/analyses`);
    const response = await fetch(`${API_URL}/analyses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(analysis)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }
    
    const data = await response.json();
    toast.success("Analysis saved");
    return data.id;
  } catch (error) {
    console.error("Error saving analysis:", error);
    
    // Fallback to mock implementation for development/demo
    console.warn("Falling back to mock database");
    const id = uuidv4();
    const newItem = { ...analysis, id, timestamp: new Date() };
    mockDatabase.push(newItem);
    
    toast.success("Analysis saved (mock)");
    return id;
  }
}

/**
 * Get analysis history from the backend
 */
export async function getAnalysisHistory(): Promise<AnalysisResult[]> {
  try {
    console.log("Attempting to fetch history from:", `${API_URL}/analyses`);
    const response = await fetch(`${API_URL}/analyses`);
    
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching analysis history:", error);
    
    // Fallback to mock implementation for development/demo
    console.warn("Falling back to mock database");
    return [...mockDatabase].sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }
}

/**
 * Get a single analysis by ID from the backend
 */
export async function getAnalysisById(id: string): Promise<AnalysisResult | null> {
  try {
    console.log("Attempting to fetch analysis by ID from:", `${API_URL}/analyses/${id}`);
    const response = await fetch(`${API_URL}/analyses/${id}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching analysis:", error);
    
    // Fallback to mock implementation for development/demo
    console.warn("Falling back to mock database");
    return mockDatabase.find(item => item.id === id) || null;
  }
}

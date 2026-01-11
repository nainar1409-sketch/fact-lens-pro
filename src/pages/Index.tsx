import { useState } from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { NewsInput } from "@/components/NewsInput";
import { ResultsDashboard } from "@/components/ResultsDashboard";
import { HowItWorks } from "@/components/HowItWorks";
import { Footer } from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AnalysisResult {
  truthScore: number;
  naiveBayes: number;
  logisticRegression: number;
  confidence: "high" | "medium" | "low";
  factors: Array<{
    text: string;
    type: "positive" | "negative" | "neutral";
    score?: number;
  }>;
  sources: Array<{
    name: string;
    url: string;
    credibility: number;
    date: string;
    author?: string;
    verdict: "supports" | "contradicts" | "neutral";
  }>;
  analyzedText: string;
  analysisTime: number;
}

const Index = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const { toast } = useToast();

  const handleAnalyze = async (content: string, method: string) => {
    setIsAnalyzing(true);
    setShowResults(false);
    
    const startTime = Date.now();

    try {
      const { data, error } = await supabase.functions.invoke('analyze-news', {
        body: { text: content },
      });

      if (error) {
        throw new Error(error.message || 'Failed to analyze news');
      }

      if (!data.success) {
        throw new Error(data.error || 'Analysis failed');
      }

      const analysisTime = ((Date.now() - startTime) / 1000).toFixed(1);

      const result: AnalysisResult = {
        ...data.analysis,
        analyzedText: content.length > 500 ? content.substring(0, 500) + '...' : content,
        analysisTime: parseFloat(analysisTime),
      };

      setAnalysisResult(result);
      setShowResults(true);
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Failed to analyze the news content",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        <Hero />
        
        <NewsInput onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />
        
        <AnimatePresence>
          {showResults && analysisResult && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
            >
              <ResultsDashboard result={analysisResult} />
            </motion.div>
          )}
        </AnimatePresence>
        
        <HowItWorks />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
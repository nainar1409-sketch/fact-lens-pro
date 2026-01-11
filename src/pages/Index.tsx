import { useState } from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { NewsInput } from "@/components/NewsInput";
import { ResultsDashboard } from "@/components/ResultsDashboard";
import { HowItWorks } from "@/components/HowItWorks";
import { Footer } from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";

// Mock analysis result for demonstration
const mockResult = {
  truthScore: 87,
  naiveBayes: 85,
  logisticRegression: 89,
  confidence: "high" as const,
  factors: [
    { text: "Source credibility score: 92/100", type: "positive" as const, score: 92 },
    { text: "Cross-verified with 8 independent sources", type: "positive" as const },
    { text: "Statement matches official government records", type: "positive" as const },
    { text: "Minor inconsistencies in date reporting", type: "negative" as const, score: 15 },
    { text: "Author has verified journalist credentials", type: "positive" as const, score: 88 },
    { text: "Publisher has 15-year track record", type: "positive" as const },
  ],
  sources: [
    { name: "Associated Press", url: "https://ap.com", credibility: 98, date: "Jan 10, 2026", author: "J. Smith", verdict: "supports" as const },
    { name: "Reuters", url: "https://reuters.com", credibility: 97, date: "Jan 10, 2026", verdict: "supports" as const },
    { name: "BBC News", url: "https://bbc.com", credibility: 95, date: "Jan 9, 2026", author: "M. Johnson", verdict: "supports" as const },
    { name: "Snopes", url: "https://snopes.com", credibility: 94, date: "Jan 10, 2026", verdict: "supports" as const },
    { name: "PolitiFact", url: "https://politifact.com", credibility: 93, date: "Jan 9, 2026", verdict: "neutral" as const },
  ],
  analyzedText: "The news article discusses recent developments in international climate policy, citing multiple official sources and verified data from government agencies. The claims made align with published reports from the United Nations and corroborated by independent fact-checking organizations.",
  analysisTime: 3.2,
};

const Index = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleAnalyze = async (content: string, method: string) => {
    setIsAnalyzing(true);
    
    // Simulate analysis time
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setIsAnalyzing(false);
    setShowResults(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        <Hero />
        
        <NewsInput onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />
        
        <AnimatePresence>
          {showResults && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
            >
              <ResultsDashboard result={mockResult} />
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

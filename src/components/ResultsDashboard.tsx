import { motion } from "framer-motion";
import { TruthGauge } from "./TruthGauge";
import { ModelBreakdown } from "./ModelBreakdown";
import { KeyFactors } from "./KeyFactors";
import { SourceVerification } from "./SourceVerification";
import { Clock, BarChart3, FileText } from "lucide-react";

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

interface ResultsDashboardProps {
  result: AnalysisResult;
}

export const ResultsDashboard = ({ result }: ResultsDashboardProps) => {
  const getConfidenceColor = () => {
    switch (result.confidence) {
      case "high":
        return "text-success";
      case "medium":
        return "text-warning";
      default:
        return "text-danger";
    }
  };

  return (
    <section className="py-20">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-6xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-12">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl md:text-4xl font-bold mb-4"
            >
              Analysis Complete
            </motion.h2>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center justify-center gap-6 text-sm text-muted-foreground"
            >
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {result.analysisTime}s analysis time
              </span>
              <span className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                <span className={getConfidenceColor()}>
                  {result.confidence.charAt(0).toUpperCase() + result.confidence.slice(1)} confidence
                </span>
              </span>
              <span className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                {result.sources.length} sources verified
              </span>
            </motion.div>
          </div>

          {/* Main grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left column - Gauge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-1 flex justify-center items-start"
            >
              <div className="bg-gradient-card rounded-xl border border-border p-8 w-full flex justify-center">
                <TruthGauge score={result.truthScore} />
              </div>
            </motion.div>

            {/* Right column - Model breakdown and factors */}
            <div className="lg:col-span-2 space-y-6">
              <ModelBreakdown
                naiveBayes={result.naiveBayes}
                logisticRegression={result.logisticRegression}
                ensemble={result.truthScore}
              />
              <KeyFactors factors={result.factors} />
            </div>
          </div>

          {/* Source verification - Full width */}
          <div className="mt-6">
            <SourceVerification sources={result.sources} />
          </div>

          {/* Analyzed text preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-6 bg-gradient-card rounded-xl border border-border p-6"
          >
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Analyzed Content
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed line-clamp-4">
              {result.analyzedText}
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

import { motion } from "framer-motion";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Factor {
  text: string;
  type: "positive" | "negative" | "neutral";
  score?: number;
}

interface KeyFactorsProps {
  factors: Factor[];
}

export const KeyFactors = ({ factors }: KeyFactorsProps) => {
  const getIcon = (type: Factor["type"]) => {
    switch (type) {
      case "positive":
        return CheckCircle;
      case "negative":
        return XCircle;
      default:
        return AlertCircle;
    }
  };

  const getStyles = (type: Factor["type"]) => {
    switch (type) {
      case "positive":
        return "text-success bg-success/10 border-success/20";
      case "negative":
        return "text-danger bg-danger/10 border-danger/20";
      default:
        return "text-warning bg-warning/10 border-warning/20";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-gradient-card rounded-xl border border-border p-6"
    >
      <h3 className="text-lg font-semibold mb-6">Key Factors</h3>

      <div className="space-y-3">
        {factors.map((factor, index) => {
          const Icon = getIcon(factor.type);
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.05 }}
              className={cn(
                "flex items-start gap-3 p-3 rounded-lg border",
                getStyles(factor.type)
              )}
            >
              <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{factor.text}</p>
                {factor.score !== undefined && (
                  <p className="text-xs mt-1 opacity-80">
                    Confidence: {factor.score}%
                  </p>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

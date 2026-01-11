import { motion } from "framer-motion";
import { Brain, LineChart, Layers } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModelBreakdownProps {
  naiveBayes: number;
  logisticRegression: number;
  ensemble: number;
}

export const ModelBreakdown = ({ naiveBayes, logisticRegression, ensemble }: ModelBreakdownProps) => {
  const models = [
    {
      name: "Naive Bayes",
      score: naiveBayes,
      icon: Brain,
      description: "Probabilistic classifier using TF-IDF features",
    },
    {
      name: "Logistic Regression",
      score: logisticRegression,
      icon: LineChart,
      description: "Linear model optimized for text classification",
    },
    {
      name: "Ensemble",
      score: ensemble,
      icon: Layers,
      description: "Combined prediction with weighted voting",
      isMain: true,
    },
  ];

  const getBarColor = (score: number, isMain?: boolean) => {
    if (isMain) {
      if (score >= 70) return "bg-gradient-truth";
      if (score >= 40) return "bg-gradient-to-r from-warning to-orange-400";
      return "bg-gradient-false";
    }
    return "bg-primary/80";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-gradient-card rounded-xl border border-border p-6"
    >
      <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
        <Layers className="w-5 h-5 text-primary" />
        Model Analysis
      </h3>

      <div className="space-y-6">
        {models.map((model, index) => (
          <motion.div
            key={model.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + index * 0.1 }}
            className={cn(
              "p-4 rounded-lg",
              model.isMain ? "bg-muted/50 border border-border" : ""
            )}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <model.icon className={cn(
                  "w-4 h-4",
                  model.isMain ? "text-primary" : "text-muted-foreground"
                )} />
                <span className={cn(
                  "font-medium",
                  model.isMain && "text-foreground"
                )}>
                  {model.name}
                </span>
                {model.isMain && (
                  <span className="text-xs px-2 py-0.5 bg-primary/20 text-primary rounded-full">
                    Final
                  </span>
                )}
              </div>
              <span className={cn(
                "text-xl font-bold",
                model.score >= 70 && "text-success",
                model.score >= 40 && model.score < 70 && "text-warning",
                model.score < 40 && "text-danger"
              )}>
                {model.score}%
              </span>
            </div>

            <p className="text-xs text-muted-foreground mb-3">
              {model.description}
            </p>

            {/* Progress bar */}
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${model.score}%` }}
                transition={{ delay: 0.6 + index * 0.1, duration: 0.8, ease: "easeOut" }}
                className={cn("h-full rounded-full", getBarColor(model.score, model.isMain))}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

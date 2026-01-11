import { motion } from "framer-motion";
import { ExternalLink, Shield, Calendar, User, Star } from "lucide-react";

interface Source {
  name: string;
  url: string;
  credibility: number;
  date: string;
  author?: string;
  verdict: "supports" | "contradicts" | "neutral";
}

interface SourceVerificationProps {
  sources: Source[];
}

export const SourceVerification = ({ sources }: SourceVerificationProps) => {
  const getVerdictStyles = (verdict: Source["verdict"]) => {
    switch (verdict) {
      case "supports":
        return "bg-success/20 text-success";
      case "contradicts":
        return "bg-danger/20 text-danger";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getVerdictLabel = (verdict: Source["verdict"]) => {
    switch (verdict) {
      case "supports":
        return "Supports";
      case "contradicts":
        return "Contradicts";
      default:
        return "Neutral";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="bg-gradient-card rounded-xl border border-border p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary" />
          Source Verification
        </h3>
        <span className="text-sm text-muted-foreground">
          {sources.length} sources checked
        </span>
      </div>

      <div className="space-y-4">
        {sources.map((source, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 + index * 0.05 }}
            className="p-4 bg-muted/30 rounded-lg border border-border hover:border-primary/30 transition-colors"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-medium truncate">{source.name}</h4>
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary/80 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {source.date}
                  </span>
                  {source.author && (
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {source.author}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    {source.credibility}% credibility
                  </span>
                </div>
              </div>

              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getVerdictStyles(source.verdict)}`}>
                {getVerdictLabel(source.verdict)}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

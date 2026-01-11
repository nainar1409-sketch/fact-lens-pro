import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface TruthGaugeProps {
  score: number;
  size?: "sm" | "md" | "lg";
}

export const TruthGauge = ({ score, size = "lg" }: TruthGaugeProps) => {
  const dimensions = {
    sm: { width: 120, strokeWidth: 8, fontSize: "text-2xl" },
    md: { width: 180, strokeWidth: 10, fontSize: "text-4xl" },
    lg: { width: 240, strokeWidth: 12, fontSize: "text-5xl" },
  };

  const { width, strokeWidth, fontSize } = dimensions[size];
  const radius = (width - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = ((100 - score) / 100) * circumference;

  const getScoreColor = () => {
    if (score >= 70) return "hsl(var(--success))";
    if (score >= 40) return "hsl(var(--warning))";
    return "hsl(var(--danger))";
  };

  const getScoreLabel = () => {
    if (score >= 70) return "Likely True";
    if (score >= 40) return "Uncertain";
    return "Likely False";
  };

  const getScoreGradient = () => {
    if (score >= 70) return "url(#truthGradient)";
    if (score >= 40) return "url(#warningGradient)";
    return "url(#falseGradient)";
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width, height: width }}>
        <svg
          width={width}
          height={width}
          viewBox={`0 0 ${width} ${width}`}
          className="transform -rotate-90"
        >
          <defs>
            <linearGradient id="truthGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(142, 76%, 45%)" />
              <stop offset="100%" stopColor="hsl(160, 84%, 39%)" />
            </linearGradient>
            <linearGradient id="warningGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(38, 92%, 50%)" />
              <stop offset="100%" stopColor="hsl(25, 95%, 53%)" />
            </linearGradient>
            <linearGradient id="falseGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(0, 84%, 60%)" />
              <stop offset="100%" stopColor="hsl(348, 83%, 47%)" />
            </linearGradient>
          </defs>

          {/* Background circle */}
          <circle
            cx={width / 2}
            cy={width / 2}
            r={radius}
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth={strokeWidth}
          />

          {/* Progress circle */}
          <motion.circle
            cx={width / 2}
            cy={width / 2}
            r={radius}
            fill="none"
            stroke={getScoreGradient()}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: progress }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.3 }}
            className={cn("font-bold", fontSize)}
            style={{ color: getScoreColor() }}
          >
            {score}%
          </motion.span>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-muted-foreground text-sm font-medium mt-1"
          >
            Truth Score
          </motion.span>
        </div>
      </div>

      {/* Label */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className={cn(
          "mt-4 px-4 py-2 rounded-full text-sm font-semibold",
          score >= 70 && "bg-success/20 text-success",
          score >= 40 && score < 70 && "bg-warning/20 text-warning",
          score < 40 && "bg-danger/20 text-danger"
        )}
      >
        {getScoreLabel()}
      </motion.div>
    </div>
  );
};

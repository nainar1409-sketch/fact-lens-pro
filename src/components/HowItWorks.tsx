import { motion } from "framer-motion";
import { Shield, Newspaper, BarChart3, Globe, Cpu, Lock } from "lucide-react";

const features = [
  {
    icon: Cpu,
    title: "Dual ML Models",
    description: "Multinomial Naive Bayes and Logistic Regression working in parallel for maximum accuracy.",
  },
  {
    icon: Globe,
    title: "50,000+ Sources",
    description: "Real-time verification against verified news outlets, fact-checkers, and official sources.",
  },
  {
    icon: BarChart3,
    title: "Transparent Scoring",
    description: "Clear percentage-based scores with detailed breakdowns of contributing factors.",
  },
  {
    icon: Newspaper,
    title: "Multi-Format Input",
    description: "Analyze text, URLs, or uploaded files including PDFs and images with OCR.",
  },
  {
    icon: Shield,
    title: "Source Credibility",
    description: "Every source is rated for credibility based on historical accuracy and reputation.",
  },
  {
    icon: Lock,
    title: "Privacy First",
    description: "No data retention policy. Your searches are analyzed and immediately discarded.",
  },
];

export const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-20 bg-muted/20">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Our multi-layer verification system combines machine learning with real-time source checking
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-gradient-card rounded-xl border border-border p-6 hover:border-primary/30 transition-colors group"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

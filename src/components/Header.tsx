import { Shield, Newspaper, Radio } from "lucide-react";
import { motion } from "framer-motion";

export const Header = () => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 glass"
    >
      <div className="container px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif font-bold text-lg leading-tight">TruthLens</span>
              <span className="text-xs text-muted-foreground">AI Fact Checker</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#analyze" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Analyze
            </a>
            <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              How It Works
            </a>
            <a href="#sources" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Sources
            </a>
          </nav>

          {/* Live indicator */}
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-success rounded-full animate-pulse-live" />
            <span className="text-sm text-muted-foreground hidden sm:inline">Live Monitoring</span>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

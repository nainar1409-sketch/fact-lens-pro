import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Link, Upload, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type InputMethod = "text" | "url" | "file";

interface NewsInputProps {
  onAnalyze: (content: string, method: InputMethod) => void;
  isAnalyzing: boolean;
}

const tabs = [
  { id: "text" as InputMethod, label: "Paste Text", icon: FileText },
  { id: "url" as InputMethod, label: "Enter URL", icon: Link },
  { id: "file" as InputMethod, label: "Upload File", icon: Upload },
];

export const NewsInput = ({ onAnalyze, isAnalyzing }: NewsInputProps) => {
  const [activeTab, setActiveTab] = useState<InputMethod>("text");
  const [textContent, setTextContent] = useState("");
  const [urlContent, setUrlContent] = useState("");
  const [fileName, setFileName] = useState("");

  const handleSubmit = () => {
    if (activeTab === "text" && textContent.trim()) {
      onAnalyze(textContent, "text");
    } else if (activeTab === "url" && urlContent.trim()) {
      onAnalyze(urlContent, "url");
    } else if (activeTab === "file" && fileName) {
      onAnalyze(fileName, "file");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
    }
  };

  const canSubmit = 
    (activeTab === "text" && textContent.trim().length > 0) ||
    (activeTab === "url" && urlContent.trim().length > 0) ||
    (activeTab === "file" && fileName.length > 0);

  return (
    <section id="analyze" className="py-20">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          {/* Section header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Analyze Any News
            </h2>
            <p className="text-muted-foreground text-lg">
              Choose your preferred input method below
            </p>
          </div>

          {/* Input card */}
          <div className="bg-gradient-card rounded-2xl border border-border p-1 shadow-elevated">
            {/* Tab buttons */}
            <div className="flex gap-1 mb-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-4 px-4 rounded-xl transition-all duration-300 font-medium",
                    activeTab === tab.id
                      ? "bg-primary text-primary-foreground shadow-glow"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  )}
                >
                  <tab.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Content area */}
            <div className="p-6 bg-card rounded-xl">
              <AnimatePresence mode="wait">
                {activeTab === "text" && (
                  <motion.div
                    key="text"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Textarea
                      placeholder="Paste the news article or claim you want to verify..."
                      className="min-h-[200px] bg-muted/50 border-border resize-none text-base"
                      value={textContent}
                      onChange={(e) => setTextContent(e.target.value)}
                      maxLength={10000}
                    />
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-muted-foreground">
                        {textContent.length.toLocaleString()} / 10,000 characters
                      </span>
                    </div>
                  </motion.div>
                )}

                {activeTab === "url" && (
                  <motion.div
                    key="url"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    <Input
                      type="url"
                      placeholder="https://example.com/news-article"
                      className="h-14 bg-muted/50 border-border text-base"
                      value={urlContent}
                      onChange={(e) => setUrlContent(e.target.value)}
                    />
                    <p className="text-sm text-muted-foreground">
                      We'll extract the article content and analyze it for authenticity
                    </p>
                  </motion.div>
                )}

                {activeTab === "file" && (
                  <motion.div
                    key="file"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <label className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-primary/50 transition-colors bg-muted/30">
                      <input
                        type="file"
                        className="hidden"
                        accept=".txt,.pdf,.doc,.docx,.png,.jpg,.jpeg"
                        onChange={handleFileChange}
                      />
                      <Upload className="w-10 h-10 text-muted-foreground mb-3" />
                      {fileName ? (
                        <span className="text-foreground font-medium">{fileName}</span>
                      ) : (
                        <>
                          <span className="text-muted-foreground">
                            Drop your file here or click to browse
                          </span>
                          <span className="text-xs text-muted-foreground mt-1">
                            Supports TXT, PDF, DOC, and images
                          </span>
                        </>
                      )}
                    </label>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit button */}
              <Button
                onClick={handleSubmit}
                disabled={!canSubmit || isAnalyzing}
                className="w-full mt-6 h-14 text-lg font-semibold bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Analyze Now
                  </>
                )}
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

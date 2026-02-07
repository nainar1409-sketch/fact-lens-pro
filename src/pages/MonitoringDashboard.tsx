import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Shield, AlertTriangle, CheckCircle, Clock, ExternalLink, RefreshCw, Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface MonitoredItem {
  id: string;
  headline: string;
  source_url: string;
  source_name: string;
  truth_score: number;
  category: string;
  summary: string;
  status: "verified" | "suspicious" | "flagged";
  created_at: string;
}

const MonitoringDashboard = () => {
  const [items, setItems] = useState<MonitoredItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<string>("all");
  const { toast } = useToast();

  const fetchItems = async () => {
    const { data, error } = await supabase
      .from("monitored_news")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      console.error("Error fetching monitored news:", error);
    } else {
      setItems((data as MonitoredItem[]) || []);
    }
    setLoading(false);
  };

  const triggerMonitoring = async () => {
    setRefreshing(true);
    try {
      const { data, error } = await supabase.functions.invoke("monitor-news");
      if (error) throw error;
      toast({ title: "Monitoring Updated", description: `Found ${data?.monitored || 0} new items.` });
      await fetchItems();
    } catch (err) {
      console.error("Monitor error:", err);
      toast({ title: "Error", description: "Failed to refresh monitoring.", variant: "destructive" });
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchItems();

    // Subscribe to realtime updates
    const channel = supabase
      .channel("monitored-news-changes")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "monitored_news" }, (payload) => {
        setItems((prev) => [payload.new as MonitoredItem, ...prev]);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const filteredItems = filter === "all" ? items : items.filter((i) => i.status === filter);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "verified": return <CheckCircle className="w-4 h-4 text-success" />;
      case "flagged": return <AlertTriangle className="w-4 h-4 text-danger" />;
      default: return <Shield className="w-4 h-4 text-warning" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return "text-success";
    if (score >= 40) return "text-warning";
    return "text-danger";
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "verified": return "default" as const;
      case "flagged": return "destructive" as const;
      default: return "secondary" as const;
    }
  };

  const stats = {
    total: items.length,
    verified: items.filter((i) => i.status === "verified").length,
    suspicious: items.filter((i) => i.status === "suspicious").length,
    flagged: items.filter((i) => i.status === "flagged").length,
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-20">
        <div className="container px-4">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Activity className="w-8 h-8 text-primary" />
              <h1 className="text-4xl md:text-5xl font-bold">Live Monitoring</h1>
              <span className="w-3 h-3 bg-success rounded-full animate-pulse-live" />
            </div>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Real-time monitoring of trending news with AI-powered credibility analysis.
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 max-w-4xl mx-auto">
            {[
              { label: "Total Monitored", value: stats.total, icon: Activity },
              { label: "Verified", value: stats.verified, icon: CheckCircle, color: "text-success" },
              { label: "Suspicious", value: stats.suspicious, icon: Shield, color: "text-warning" },
              { label: "Flagged", value: stats.flagged, icon: AlertTriangle, color: "text-danger" },
            ].map((stat, i) => (
              <div key={i} className="bg-gradient-card rounded-xl border border-border p-4 text-center">
                <stat.icon className={`w-5 h-5 mx-auto mb-2 ${stat.color || "text-primary"}`} />
                <div className={`text-2xl font-bold ${stat.color || ""}`}>{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </motion.div>

          {/* Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6 max-w-4xl mx-auto">
            <div className="flex gap-2">
              {["all", "flagged", "suspicious", "verified"].map((f) => (
                <Button key={f} variant={filter === f ? "default" : "outline"} size="sm" onClick={() => setFilter(f)}>
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </Button>
              ))}
            </div>
            <Button onClick={triggerMonitoring} disabled={refreshing} size="sm" variant="outline">
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
              {refreshing ? "Scanning..." : "Scan Now"}
            </Button>
          </div>

          {/* Items */}
          <div className="max-w-4xl mx-auto space-y-3">
            {loading ? (
              <div className="text-center py-20 text-muted-foreground">Loading monitored news...</div>
            ) : filteredItems.length === 0 ? (
              <div className="text-center py-20">
                <Shield className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                <p className="text-muted-foreground">No monitored news yet. Click "Scan Now" to start.</p>
              </div>
            ) : (
              <AnimatePresence>
                {filteredItems.map((item, i) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: i * 0.03 }}
                    className="bg-gradient-card rounded-xl border border-border p-5 hover:border-primary/30 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <div className="mt-1">{getStatusIcon(item.status)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <h3 className="font-semibold text-sm leading-snug">{item.headline}</h3>
                          <span className={`text-lg font-bold shrink-0 ${getScoreColor(item.truth_score)}`}>
                            {item.truth_score}%
                          </span>
                        </div>
                        {item.summary && (
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{item.summary}</p>
                        )}
                        <div className="flex flex-wrap items-center gap-2 mt-3">
                          <Badge variant={getStatusBadgeVariant(item.status)}>{item.status}</Badge>
                          <Badge variant="outline">{item.category}</Badge>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(item.created_at).toLocaleString()}
                          </span>
                          {item.source_url && (
                            <a
                              href={item.source_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-primary flex items-center gap-1 hover:underline"
                            >
                              {item.source_name || "Source"}
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MonitoringDashboard;

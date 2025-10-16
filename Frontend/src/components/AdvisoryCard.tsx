import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCw, Volume2, VolumeX, Download } from "lucide-react";
import { fetchAdvisory, type AdvisoryResponse, type FilterState } from "@/lib/api";

interface AdvisoryCardProps {
  advisory: AdvisoryResponse;
  onNewAdvisory: (advisory: AdvisoryResponse) => void;
  currentLanguage: "hi" | "en" | "or";
  filters: FilterState;
  isLoading?: boolean;
}

const translations = {
  hi: {
    title: "किसान सलाह सहायक",
    subtitle: "आपकी खेती के लिए विशेषज्ञ मार्गदर्शन",
    getNew: "नई सलाह प्राप्त करें",
    listen: "ऑडियो में सुनें",
    stop: "ऑडियो बंद करें",
    download: "सलाह डाउनलोड करें",
    loading: "नई सलाह लोड हो रही है..."
  },
  en: {
    title: "Farmer Advisory Assistant",
    subtitle: "Expert guidance for your farming",
    getNew: "Get New Advice",
    listen: "Listen in Audio",
    stop: "Stop Audio",
    download: "Download Advisory",
    loading: "Loading new advice..."
  },
  or: {
    title: "କୃଷକ ପରାମର୍ଶ ସହାୟକ",
    subtitle: "ଆପଣଙ୍କ ଚାଷ ପାଇଁ ବିଶେଷଜ୍ଞ ମାର୍ଗଦର୍ଶନ",
    getNew: "ନୂତନ ପରାମର୍ଶ ପାଆନ୍ତୁ",
    listen: "ଅଡିଓରେ ଶୁଣନ୍ତୁ",
    stop: "ଅଡିଓ ବନ୍ଦ କରନ୍ତୁ",
    download: "ପରାମର୍ଶ ଡାଉନଲୋଡ୍ କରନ୍ତୁ",
    loading: "ନୂତନ ପରାମର୍ଶ ଲୋଡ ହେଉଛି..."
  }
};

export default function AdvisoryCard({
  advisory,
  onNewAdvisory,
  currentLanguage,
  filters,
  isLoading: propIsLoading = false
}: AdvisoryCardProps) {
  const [localIsLoading, setLocalIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Use the isLoading prop from parent if provided, otherwise use local state
  const isLoading = propIsLoading || localIsLoading;
  const t = translations[currentLanguage];

  // New advice from backend with current filters (including language)
  const handleGetNewAdvice = async () => {
    setLocalIsLoading(true);
    try {
      const newAdvisory = await fetchAdvisory(filters);
      onNewAdvisory(newAdvisory);
    } catch (error) {
      console.error("Failed to fetch new advisory:", error);
    } finally {
      setLocalIsLoading(false);
    }
  };

  // TTS toggle
  const handleAudioToggle = () => {
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(advisory.recommendation || "");
    utterance.lang =
      currentLanguage === "hi" ? "hi-IN" :
      currentLanguage === "or" ? "or-IN" : "en-IN";
    utterance.rate = 0.9;
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);
    setIsPlaying(true);
    window.speechSynthesis.speak(utterance);
  };

  // Download all LLM-generated text as a .txt
  const handleDownload = () => {
    // Build a printable text from advisory & LLM JSON blocks (soil/market/yield)
    const lines: string[] = [];

    if (advisory.recommendation) {
      lines.push("==== Advisory ====");
      lines.push(advisory.recommendation.trim());
      lines.push("");
    }

    // soil_data and market_data are LLM-generated (values localized)
    if (advisory.soil_data) {
      lines.push("==== Soil Data ====");
      lines.push(JSON.stringify(advisory.soil_data, null, 2));
      lines.push("");
    }

    if (advisory.market_data) {
      lines.push("==== Market Data ====");
      lines.push(JSON.stringify(advisory.market_data, null, 2));
      lines.push("");
    }

    // yield_data contains LLM localized fields too
    if (advisory.yield_data) {
      lines.push("==== Yield Data ====");
      lines.push(JSON.stringify(advisory.yield_data, null, 2));
      lines.push("");
    }

    const content = lines.join("\n");
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "AI_Farmer_Advisory.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="bg-card border-primary/20 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
        <CardTitle className="flex items-center gap-3 text-primary">
          <div className="p-2 bg-primary/10 rounded-full">
            <span className="text-xl">🌾</span>
          </div>
          <div>
            <h3 className="text-lg font-bold">{t.title}</h3>
            <p className="text-sm text-muted-foreground font-normal">{t.subtitle}</p>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* Main advisory text */}
        <div className="prose prose-sm max-w-none">
          <div className="text-foreground leading-relaxed whitespace-pre-wrap">
            {advisory.recommendation}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          <Button onClick={handleGetNewAdvice} disabled={isLoading} className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            {isLoading ? t.loading : t.getNew}
          </Button>

          <Button onClick={handleAudioToggle} variant="secondary" className="flex items-center gap-2">
            {isPlaying ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            {isPlaying ? t.stop : t.listen}
          </Button>

          <Button onClick={handleDownload} variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            {t.download}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
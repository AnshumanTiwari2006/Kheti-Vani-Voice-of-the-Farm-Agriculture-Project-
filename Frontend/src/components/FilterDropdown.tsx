// components/FilterDropdown.tsx
import { useState, useMemo } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Info } from "lucide-react";
import GuideModal from "@/components/GuideModal";

interface FilterDropdownProps {
  label: string;
  placeholder: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  guidanceLabel: string;
  currentLanguage?: "hi" | "en" | "or"; // optional, default 'en'
}

/**
 * FilterDropdown
 * - Renders a Select control with an extra "Guidance" item.
 * - When user selects "Guidance" it opens a GuideModal with localized help text.
 */
export default function FilterDropdown({
  label,
  placeholder,
  options,
  value,
  onChange,
  guidanceLabel,
  currentLanguage = "en"
}: FilterDropdownProps) {
  const [showGuide, setShowGuide] = useState(false);

  // Localized guidance content per filter label + language
  const guidanceText = useMemo(() => {
    const lang = currentLanguage || "en";
    const labelText = label || "Filter";

    const map: Record<string, string> = {
      en: `${labelText}: Choose the option that best matches your farm.
- Crop Type: Select the crop you plan to grow.
- Soil Type: e.g., Loam/Clay/Sandy; affects water & nutrients.
- Season: Kharif/Rabi/Zaid depending on regional timing.
- Irrigation: Source & availability determine schedule.
- Fertilizer: Choose organic/chemical/mixed per budget & soil.
- Pest/Disease: If known issues exist, select them to tailor advice.
- Budget: Helps right-size inputs and practices.`,
      hi: `${labelText}: अपने खेत के अनुसार सही विकल्प चुनें।
- फसल प्रकार: जो फसल आप उगाना चाहते हैं।
- मिट्टी का प्रकार: दोमट/चिकनी/रेतीली—पानी व पोषक तत्वों पर असर।
- मौसम: खरीफ़/रबी/जायद—क्षेत्र के समयानुसार।
- सिंचाई: स्रोत व उपलब्धता के अनुसार शेड्यूल तय।
- उर्वरक: जैविक/रासायनिक/मिश्रित—बजट व मिट्टी के अनुसार।
- कीट/रोग: ज्ञात समस्याएँ हों तो चुनें ताकि सलाह सटीक हो।
- बजट: खर्च के अनुसार इनपुट व प्रथाएँ तय करने में मदद।`,
      or: `${labelText}: ଆପଣଙ୍କ ଖେତକୁ ମେଳ ହେବା ଭଳି ବିକଳ୍ପ ଚୟନ କରନ୍ତୁ।
- ଫସଲ ପ୍ରକାର: ଯେଉଁ ଫସଲ ଚାଷ କରିବାକୁ ଚାହୁଁଛନ୍ତି।
- ମାଟି ପ୍ରକାର: ଦୋମଟ/ଦଳିଆ/ବାଲୁକାମୟ—ଜଳ ଓ ପୋଷକରେ ପ୍ରଭାବ।
- ଋତୁ: ଖରିଫ/ରବି/ଜାଏଦ—ଅଞ୍ଚଳିକ ସମୟାନୁସାରେ।
- ସିଚାଇ: ସ୍ରୋତ ଓ ଉପଲବ୍ଧତା ଅନୁଯାୟୀ ତାଲିକା।
- ସର: ଜୈବିକ/ରାସାୟନିକ/ମିଶ୍ରିତ—ବଜେଟ୍ ଓ ମାଟି ଅନୁସାରେ।
- କୀଟ/ରୋଗ: ଜଣା ସମସ୍ୟା ଥିଲେ ଚୟନ କରନ୍ତୁ ଯେପରି ଉଚିତ ପରାମର୍ଶ ମିଳେ।
- ବଜେଟ୍: ଖର୍ଚ୍ଚ ଅନୁଯାୟୀ ଇନପୁଟ୍ ଓ ପ୍ରକ୍ରିୟା ନିର୍ଦ୍ଧାରଣ।`
    };

    return map[lang] ?? map.en;
  }, [label, currentLanguage]);

  // Handler for select value change
  const handleValueChange = (newValue: string) => {
    // Special value 'guide' opens modal without changing the selected filter value
    if (newValue === "guide") {
      setShowGuide(true);
      return;
    }
    // Normal option — propagate up
    onChange(newValue);
  };

  const modalTitle =
    currentLanguage === "hi" ? "मार्गदर्शन" :
    currentLanguage === "or" ? "ଗାଇଡ୍" :
    "Guidance";

  return (
    <>
      <div className="min-w-[160px] sm:min-w-[180px]">
        <label className="block text-sm font-medium text-foreground mb-2">{label}</label>

        <Select value={value} onValueChange={handleValueChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>

          <SelectContent>
            {/* Guidance item appears first */}
            <SelectItem value="guide" className="text-primary hover:bg-muted/50">
              <div className="flex items-center gap-1">
                <Info className="h-4 w-4" />
                <span>{guidanceLabel}</span>
              </div>
            </SelectItem>

            {/* Render actual filter options */}
            {options.map((opt) => (
              <SelectItem key={opt} value={opt} className="hover:bg-muted/50">
                {opt}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Guidance modal */}
      <GuideModal
        isOpen={showGuide}
        onClose={() => setShowGuide(false)}
        title={modalTitle}
        description={guidanceText}
      />
    </>
  );
}



















































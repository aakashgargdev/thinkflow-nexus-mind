
import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Brain } from "lucide-react";

const InsightsTab: React.FC = () => (
  <div className="space-y-4 sm:space-y-6">
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          <Brain className="h-4 w-4 sm:h-5 sm:w-5" />
          AI-Generated Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-3 sm:p-4 bg-muted/50 rounded-lg">
            <h3 className="font-semibold mb-2 text-sm sm:text-base">Knowledge Patterns</h3>
            <p className="text-muted-foreground text-xs sm:text-sm">You frequently connect AI research with design principles. Consider exploring AI-driven design tools.</p>
          </div>
          <div className="p-3 sm:p-4 bg-muted/50 rounded-lg">
            <h3 className="font-semibold mb-2 text-sm sm:text-base">Content Gaps</h3>
            <p className="text-muted-foreground text-xs sm:text-sm">Your notes lack implementation examples. Adding code snippets could enhance understanding.</p>
          </div>
          <div className="p-3 sm:p-4 bg-muted/50 rounded-lg">
            <h3 className="font-semibold mb-2 text-sm sm:text-base">Trending Topics</h3>
            <p className="text-muted-foreground text-xs sm:text-sm">LLM applications and RAG systems appear most frequently in your recent notes.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);

export default InsightsTab;

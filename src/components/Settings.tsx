
import * as React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ThemeSettings } from "./ThemeSettings";

export default function Settings() {
  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <h4 className="font-medium">Privacy</h4>
          <div className="space-y-2 text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked className="rounded" />
              Allow AI to analyze my notes for insights
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="rounded" />
              Share anonymous usage data
            </label>
          </div>
        </div>
        <Separator />
        <ThemeSettings />
      </CardContent>
    </Card>
  );
}

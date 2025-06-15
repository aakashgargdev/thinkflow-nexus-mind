
import * as React from "react";
import { useTheme } from "next-themes";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export function ThemeSettings() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="space-y-3">
      <h4 className="font-medium">Theme</h4>
      <RadioGroup value={theme} onValueChange={setTheme} className="space-y-1">
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="light" id="light" />
          <Label htmlFor="light">Light</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="dark" id="dark" />
          <Label htmlFor="dark">Dark</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="system" id="system" />
          <Label htmlFor="system">System</Label>
        </div>
      </RadioGroup>
    </div>
  );
}


import * as React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";

export default function Notifications() {
  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Notifications
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <h4 className="font-medium">Notification Preferences</h4>
          <div className="space-y-2 text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked className="rounded" />
              Email notifications for AI insights
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked className="rounded" />
              Weekly knowledge summary
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="rounded" />
              Daily reminders to add notes
            </label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

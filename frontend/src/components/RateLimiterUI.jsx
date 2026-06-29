import React from 'react';
import { Button } from "@/components/ui/button";
import { ShieldAlert, RefreshCw, Home } from "lucide-react";

const RateLimiterUI = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 animate-in fade-in duration-500">
      <div className="max-w-md w-full border rounded-xl bg-card text-card-foreground shadow-lg p-8 text-center space-y-6">
        <div className="flex justify-center">
          <div className="h-20 w-20 bg-destructive/10 rounded-full flex items-center justify-center">
            <ShieldAlert className="h-10 w-10 text-destructive" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Too Many Requests</h1>
          <p className="text-muted-foreground">
            You've hit the rate limit for this action. Please wait a moment before trying again to keep the service running smoothly.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RateLimiterUI;
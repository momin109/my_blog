"use client";

// import { AdminLayout } from "./layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, Users, Eye, FileText, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminDashboard() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-foreground">
          Dashboard
        </h1>
        <p className="text-muted-foreground mt-1">
          Welcome back, Eleanor. Here's what's happening today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="shadow-sm border-border/60">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Views
            </CardTitle>
            <Eye className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45.2K</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <span className="text-emerald-600 font-medium flex items-center">
                +12%
              </span>{" "}
              from last month
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-border/60">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Readers
            </CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,240</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <span className="text-emerald-600 font-medium flex items-center">
                +4%
              </span>{" "}
              from last hour
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-border/60">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Stories Published
            </CardTitle>
            <FileText className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">84</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <span className="text-emerald-600 font-medium flex items-center">
                +3
              </span>{" "}
              this week
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-border/60">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg. Read Time
            </CardTitle>
            <Clock className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4m 12s</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <span className="text-emerald-600 font-medium flex items-center">
                +1.2%
              </span>{" "}
              from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="shadow-sm border-border/60">
          <CardHeader>
            <CardTitle className="font-serif">Recent Stories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {[
                {
                  title: "The Art of Slow Living",
                  views: "2.4k",
                  status: "Published",
                },
                {
                  title: "Minimalist Architecture",
                  views: "1.8k",
                  status: "Published",
                },
                {
                  title: "Sustainable Coffee Culture",
                  views: "950",
                  status: "Published",
                },
                {
                  title: "Draft: Winter Collection",
                  views: "-",
                  status: "Draft",
                },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">{item.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.status}
                    </p>
                  </div>
                  <div className="text-sm font-medium text-muted-foreground">
                    {item.views} views
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-6 border-t border-border">
              <Button variant="outline" size="sm" className="w-full">
                View All Stories
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border/60">
          <CardHeader>
            <CardTitle className="font-serif">Newsletter Growth</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center bg-secondary/20 rounded-lg border border-dashed border-border m-6 mt-0">
            <p className="text-muted-foreground text-sm">Chart Placeholder</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

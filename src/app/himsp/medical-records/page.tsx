// app/himsp/all-records/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageLayout } from "@/components/layout/PageLayout";
import { Search, FileText, Calendar, UserIcon, Filter, Building, BarChart3 } from "lucide-react";
import { backendCore } from "@/declarations/backendCore";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigation } from "@/hooks/useNavigation";
import { MedicalRecord } from "@/declarations/backendCore/backendCore.did";
import { clinics } from "@/lib/clinics";

export default function HimspAllRecords() {
  const { user } = useAuth();
  const { navigationItems, activeItemId, handleNavigationClick } = useNavigation({ 
    currentPage: "all-records" 
  });
  
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  
  const getClinicName = (clinicId: string) => {
    const clinic = clinics.find((c) => c.id === clinicId);
    return clinic ? clinic.name : clinicId;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch all records (HIMSP has system-wide access)
        const recordsResult = await backendCore.getAllMedicalRecords();
        setRecords(recordsResult);

      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredRecords = records.filter((record) => {
    const matchesSearch =
      record.record_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.patient_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.clinic_id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && record.is_active) ||
      (statusFilter === "inactive" && !record.is_active);

    return matchesSearch && matchesStatus
  });

  const formatDate = (timestamp: bigint) => {
    return new Date(Number(timestamp) / 1000000).toLocaleDateString();
  };

  const getSystemStats = () => {
    const totalRecords = records.length;
    const activeRecords = records.filter((r) => r.is_active).length;
    const inactiveRecords = records.filter((r) => !r.is_active).length;

    return { totalRecords, activeRecords, inactiveRecords };
  };

  const stats = getSystemStats();

  if (!user) return null;

  if (loading) {
    return (
      <PageLayout
        navigationItems={navigationItems}
        activeItemId={activeItemId}
        onNavigationClick={handleNavigationClick}
      >
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-600">Loading system records...</div>
        </div>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout
        navigationItems={navigationItems}
        activeItemId={activeItemId}
        onNavigationClick={handleNavigationClick}
      >
        <div className="flex justify-center items-center h-64">
          <div className="text-red-600">Error: {error}</div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      navigationItems={navigationItems}
      activeItemId={activeItemId}
      onNavigationClick={handleNavigationClick}
    >
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">All Records Dashboard</h1>
          <Button onClick={() => handleNavigationClick("analytics")}>
            <BarChart3 className="h-4 w-4 mr-2" />
            View Analytics
          </Button>
        </div>

        {/* System Overview Cards */}
        <div className="grid grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Records</p>
                  <p className="text-2xl font-bold">{stats.totalRecords}</p>
                </div>
                <FileText className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Records</p>
                  <p className="text-2xl font-bold text-green-600">{stats.activeRecords}</p>
                </div>
                <Badge variant="default" className="h-8 w-8 rounded-full p-0 flex items-center justify-center">
                  ✓
                </Badge>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Inactive Records</p>
                  <p className="text-2xl font-bold text-gray-600">{stats.inactiveRecords}</p>
                </div>
                <Badge variant="secondary" className="h-8 w-8 rounded-full p-0 flex items-center justify-center">
                  ✗
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search records, patients, or clinics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <Select value={statusFilter} onValueChange={(value: "all" | "active" | "inactive") => setStatusFilter(value)}>
            <SelectTrigger className="w-40">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active Only</SelectItem>
              <SelectItem value="inactive">Inactive Only</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Records Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Medical Records ({filteredRecords.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredRecords.map((record) => (
                <div
                  key={record.record_id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-4">
                      <span className="font-medium">Record #{record.record_id}</span>
                      <Badge variant={record.is_active ? "default" : "secondary"}>
                        {record.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <UserIcon className="h-4 w-4" />
                        Patient: {record.patient_id}
                      </div>
                      <div className="flex items-center gap-1">
                        <Building className="h-4 w-4" />
                        {getClinicName(record.clinic_id)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Updated: {formatDate(record.last_updated)}
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground font-mono">
                      Hash: {record.current_snapshot_hash.substring(0, 24)}...
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleNavigationClick(`record/${record.record_id}`)}
                  >
                    View Details
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {filteredRecords.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No Records Found</h3>
              <p className="text-muted-foreground">No records match your current filter criteria.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </PageLayout>
  );
}
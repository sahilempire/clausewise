import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { DocumentCard } from "@/components/document/DocumentCard";
import { ListFilter } from "lucide-react";
import { GeneratedContract } from "@/components/contract/ContractForm";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Document } from "@/types/document";

type DocumentTabsProps = {
  documents: Document[];
  contracts: GeneratedContract[];
  onDelete: (id: string) => void;
  filterOptions: {
    status: {
      pending: boolean;
      processing: boolean;
      completed: boolean;
      error: boolean;
    };
    risk: {
      low: boolean;
      medium: boolean;
      high: boolean;
    };
  };
  onFilterChange: (type: 'status' | 'risk', key: string, checked: boolean) => void;
};

const DocumentTabs: React.FC<DocumentTabsProps> = ({ 
  documents, 
  contracts, 
  onDelete, 
  filterOptions,
  onFilterChange
}) => {
  return (
    <div className="w-full animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
          Recent Documents
        </h2>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1 bg-background/50 backdrop-blur-sm border-primary/20 hover:border-primary/40">
                <ListFilter className="h-4 w-4" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-background/95 backdrop-blur-sm border-primary/20">
              <div className="p-2">
                <p className="text-xs font-medium text-muted-foreground mb-2">Status</p>
                <DropdownMenuCheckboxItem
                  checked={filterOptions.status.pending}
                  onCheckedChange={(checked) => onFilterChange('status', 'pending', checked)}
                  className="hover:bg-primary/10"
                >
                  Pending
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={filterOptions.status.processing}
                  onCheckedChange={(checked) => onFilterChange('status', 'processing', checked)}
                  className="hover:bg-primary/10"
                >
                  Processing
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={filterOptions.status.completed}
                  onCheckedChange={(checked) => onFilterChange('status', 'completed', checked)}
                  className="hover:bg-primary/10"
                >
                  Completed
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={filterOptions.status.error}
                  onCheckedChange={(checked) => onFilterChange('status', 'error', checked)}
                  className="hover:bg-primary/10"
                >
                  Error
                </DropdownMenuCheckboxItem>
              </div>
              
              <div className="p-2 border-t border-primary/10">
                <p className="text-xs font-medium text-muted-foreground mb-2">Risk Level</p>
                <DropdownMenuCheckboxItem
                  checked={filterOptions.risk.low}
                  onCheckedChange={(checked) => onFilterChange('risk', 'low', checked)}
                  className="hover:bg-primary/10"
                >
                  Low
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={filterOptions.risk.medium}
                  onCheckedChange={(checked) => onFilterChange('risk', 'medium', checked)}
                  className="hover:bg-primary/10"
                >
                  Medium
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={filterOptions.risk.high}
                  onCheckedChange={(checked) => onFilterChange('risk', 'high', checked)}
                  className="hover:bg-primary/10"
                >
                  High
                </DropdownMenuCheckboxItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-background/50 backdrop-blur-sm border-primary/20">
          <TabsTrigger value="all">All Documents</TabsTrigger>
          <TabsTrigger value="contracts">Contracts</TabsTrigger>
          <TabsTrigger value="analyses">Analyses</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {documents.map((doc) => (
              <DocumentCard
                key={doc.id}
                document={doc}
                onDelete={onDelete}
              />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="contracts" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {contracts.map((contract) => (
              <DocumentCard
                key={contract.id}
                document={{
                  id: contract.id,
                  title: contract.title,
                  date: contract.date,
                  status: "completed",
                }}
                onDelete={onDelete}
              />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="analyses" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {documents
              .filter((doc) => doc.status === "completed" && doc.riskScore !== undefined)
              .map((doc) => (
                <DocumentCard
                  key={doc.id}
                  document={doc}
                  onDelete={onDelete}
                />
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DocumentTabs;

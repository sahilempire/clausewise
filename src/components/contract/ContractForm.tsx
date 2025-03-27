import React, { useState } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FileText, Send, Download, Copy, Check, RefreshCw, ChevronDown, ChevronUp, Menu, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Progress } from "@/components/ui/progress";
import { useExpandedPreview } from "@/hooks/use-expanded-preview";
import { motion, AnimatePresence } from "framer-motion";
import { contractTemplates, generateContract, ContractTemplate } from "@/services/geminiService";
import { contractStorageService } from "@/services/contractStorageService";
import { documentService } from '@/services/documentService';

type ContractFormProps = {
  onGenerate: (contract: string) => void;
  popularAgreements?: { label: string; value: string; }[];
};

export type ContractFormData = {
  contractType: string;
  judiciary: string;
  party1: {
    name: string;
    address: string;
    showAddress: boolean;
  };
  party2: {
    name: string;
    address: string;
    showAddress: boolean;
  };
  description: string;
  keyTerms: string;
  intensity: 'simple' | 'moderate' | 'watertight';
};

export type GeneratedContract = {
  title: string;
  content: string;
  riskScore: number;
  date: string;
  id: string;
  riskAnalysis: {
    title: string;
    description: string;
    riskLevel: 'low' | 'medium' | 'high';
  }[];
};

// Reorganized contract types with popular ones at the top
const contractTypes = [
  // Most popular agreements first
  "Non-Disclosure Agreement (NDA)",
  "Employment Agreement",
  "Service Agreement",
  "Consulting Agreement",
  "Sales Contract",
  "Lease Agreement",
  "Term Sheet",
  "SAFE Note Agreement",
  "Convertible Note Agreement",
  "Equity Vesting Agreement",
  "Partnership Agreement",
  // Less common agreements
  "Distribution Agreement",
  "Licensing Agreement",
  "Software License Agreement",
  "Freelancer Contract",
  "Intellectual Property Assignment",
  "Co-Founder Agreement",
  "Stock Option Agreement",
  "Investment Agreement",
  "Terms of Service",
  "Privacy Policy",
  "Data Processing Agreement",
  "SAAS Agreement"
];

// Add judiciary options
const judiciaryOptions = [
  { value: "common_law", label: "Common Law (US, UK, Canada, Australia)" },
  { value: "civil_law", label: "Civil Law (France, Germany, Japan)" },
  { value: "islamic_law", label: "Islamic Law (Sharia)" },
  { value: "customary_law", label: "Customary Law" },
  { value: "mixed_systems", label: "Mixed Systems (India, South Africa)" },
  { value: "international", label: "International Law" },
  { value: "eu_law", label: "European Union Law" },
  { value: "chinese_law", label: "Chinese Law" },
  { value: "russian_law", label: "Russian Law" },
  { value: "brazilian_law", label: "Brazilian Law" },
  { value: "indian_law", label: "Indian Law" },
  { value: "japanese_law", label: "Japanese Law" },
  { value: "german_law", label: "German Law" },
  { value: "french_law", label: "French Law" },
  { value: "british_law", label: "British Law" },
  { value: "american_law", label: "American Law" },
  { value: "canadian_law", label: "Canadian Law" },
  { value: "australian_law", label: "Australian Law" },
  { value: "singapore_law", label: "Singapore Law" },
  { value: "hong_kong_law", label: "Hong Kong Law" }
];

const ContractForm: React.FC<ContractFormProps> = ({ onGenerate }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<ContractFormData>({
    contractType: '',
    judiciary: '',
    party1: {
      name: '',
      address: '',
      showAddress: false
    },
    party2: {
      name: '',
      address: '',
      showAddress: false
    },
    description: '',
    keyTerms: '',
    intensity: 'moderate'
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [contract, setContract] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [formCollapsed, setFormCollapsed] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev, 
        [parent]: {
          ...(prev[parent as keyof typeof prev] as Record<string, string | boolean>),
          [child]: value 
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, contractType: value }));
  };

  const handleCheckboxChange = (parent: string, child: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...(prev[parent as keyof typeof prev] as Record<string, string | boolean>),
        [child]: checked
      }
    }));
  };

  const handleIntensityChange = (value: number) => {
    const intensityMap: Record<number, 'simple' | 'moderate' | 'watertight'> = {
      0: 'simple',
      50: 'moderate',
      100: 'watertight'
    };
    setFormData(prev => ({ ...prev, intensity: intensityMap[value] }));
  };

  const handleGenerate = async () => {
    if (!formData.contractType || !formData.judiciary || !formData.party1.name || !formData.party2.name || !formData.description) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      const template = contractTemplates.find(t => t.title === formData.contractType);
      if (!template) throw new Error('Invalid contract type');

      // Format the contract data to match the expected type
      const contractData: Record<string, string> = {
        contractType: formData.contractType,
        judiciary: formData.judiciary,
        party1Name: formData.party1.name,
        party1Address: formData.party1.showAddress ? formData.party1.address : '',
        party2Name: formData.party2.name,
        party2Address: formData.party2.showAddress ? formData.party2.address : '',
        description: formData.description,
        keyTerms: formData.keyTerms,
        intensity: formData.intensity,
        ...template.requiredFields.reduce((acc, field) => ({
          ...acc,
          [field.toLowerCase().replace(/\s+/g, '_')]: formData[field.toLowerCase().replace(/\s+/g, '_')] || ''
        }), {})
      };

      const generatedContract = await generateContract(template, contractData);
      setContract(generatedContract);
      
      // Save the contract to Supabase storage
      const savedContract = await contractStorageService.saveContract(
        generatedContract,
        formData.contractType
      );

      if (savedContract) {
        toast({
          title: "Success",
          description: "Contract generated and saved successfully"
        });
      } else {
        toast({
          title: "Warning",
          description: "Contract generated but failed to save",
          variant: "destructive"
        });
      }

      onGenerate(generatedContract);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate contract. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyText = () => {
    if (contract) {
      navigator.clipboard.writeText(contract);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Copied",
        description: "Contract text copied to clipboard"
      });
    }
  };

  const handleDownloadPDF = () => {
    if (!contract) return;
    documentService.generatePDF(contract, contractTemplates.find(t => t.title === formData.contractType)?.title);
  };

  const handleDownloadWord = async () => {
    if (!contract) return;
    await documentService.generateWord(contract, contractTemplates.find(t => t.title === formData.contractType)?.title);
  };

  const toggleFormCollapse = () => {
    setFormCollapsed(!formCollapsed);
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`w-full max-w-6xl grid grid-cols-1 gap-6 relative ${isExpanded ? 'lg:grid-cols-5' : 'md:grid-cols-2'}`}>
      {/* Form side */}
      <AnimatePresence>
        {(!formCollapsed || !contract) && (
          <motion.div 
            className={`space-y-4 ${isExpanded ? 'lg:col-span-2' : 'md:col-span-1'}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div>
              <Label>Contract Type</Label>
              <Select value={formData.contractType} onValueChange={handleSelectChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select contract type" />
                </SelectTrigger>
                <SelectContent>
                  {contractTemplates.map((template) => (
                    <SelectItem key={template.title} value={template.title}>
                      {template.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Jurisdiction</Label>
              <Select value={formData.judiciary} onValueChange={(value) => setFormData(prev => ({ ...prev, judiciary: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select jurisdiction" />
                </SelectTrigger>
                <SelectContent>
                  {judiciaryOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>First Party Name</Label>
              <Input
                name="party1.name"
                placeholder="Enter name of first party"
                value={formData.party1.name}
                onChange={handleChange}
              />
              
              <div className="flex items-center space-x-2 mt-1.5">
                <Checkbox 
                  id="party1AddressCheckbox" 
                  checked={formData.party1.showAddress}
                  onCheckedChange={(checked) => handleCheckboxChange('party1', 'showAddress', checked as boolean)}
                />
                <label 
                  htmlFor="party1AddressCheckbox" 
                  className="text-sm text-muted-foreground cursor-pointer"
                >
                  Add address details
                </label>
              </div>
              
              <AnimatePresence>
                {formData.party1.showAddress && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-2">
                      <Label>First Party Address</Label>
                      <Input
                        name="party1.address"
                        placeholder="Enter address"
                        value={formData.party1.address}
                        onChange={handleChange}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="space-y-2">
              <Label>Second Party Name</Label>
              <Input
                name="party2.name"
                placeholder="Enter name of second party"
                value={formData.party2.name}
                onChange={handleChange}
              />
              
              <div className="flex items-center space-x-2 mt-1.5">
                <Checkbox 
                  id="party2AddressCheckbox" 
                  checked={formData.party2.showAddress}
                  onCheckedChange={(checked) => handleCheckboxChange('party2', 'showAddress', checked as boolean)}
                />
                <label 
                  htmlFor="party2AddressCheckbox" 
                  className="text-sm text-muted-foreground cursor-pointer"
                >
                  Add address details
                </label>
              </div>
              
              <AnimatePresence>
                {formData.party2.showAddress && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-2">
                      <Label>Second Party Address</Label>
                      <Input
                        name="party2.address"
                        placeholder="Enter address"
                        value={formData.party2.address}
                        onChange={handleChange}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div>
              <Label>Contract Description</Label>
              <Textarea
                name="description"
                placeholder="Briefly describe what this contract should cover..."
                value={formData.description}
                onChange={handleChange}
                className="min-h-[100px]"
              />
            </div>

            <div>
              <Label>Key Terms (Optional)</Label>
              <Textarea
                name="keyTerms"
                placeholder="List any specific terms you want to include..."
                value={formData.keyTerms}
                onChange={handleChange}
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>Contract Intensity: {formData.intensity.charAt(0).toUpperCase() + formData.intensity.slice(1)}</Label>
              <Slider
                defaultValue={[50]}
                min={0}
                max={100}
                step={50}
                onValueChange={(value) => handleIntensityChange(value[0])}
                className="mt-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground pt-1">
                <span>Simple</span>
                <span>Moderate</span>
                <span>Watertight</span>
              </div>
            </div>

            <Button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate Contract"
              )}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Preview side */}
      <motion.div 
        className={`space-y-4 ${isExpanded && !formCollapsed ? 'lg:col-span-3' : formCollapsed ? 'col-span-1' : 'md:col-span-1'}`}
        layout
        transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
      >
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Contract Preview</h3>
          <div className="flex space-x-2">
            {contract && formCollapsed && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={toggleFormCollapse}
                className="text-xs flex items-center"
              >
                <Menu className="h-4 w-4 mr-1" /> Edit
              </Button>
            )}
            
            {contract && !formCollapsed && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={toggleFormCollapse}
                className="text-xs hidden sm:flex items-center"
              >
                <X className="h-4 w-4 mr-1" /> Hide form
              </Button>
            )}
            
            {contract && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={toggleExpanded}
                className="text-xs"
              >
                {isExpanded ? "Reduce preview" : "Expand preview"}
              </Button>
            )}
          </div>
        </div>
        
        <motion.div 
          className="relative overflow-auto h-[500px] border border-bento-gray-200 rounded-lg p-4 dark:bg-bento-gray-800/80 dark:border-bento-gray-700 text-sm backdrop-blur-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {contract ? (
            <motion.div 
              id="contract-preview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="text-lg font-bold mb-4">{contractTemplates.find(t => t.title === formData.contractType)?.title}</h2>
              <div className="whitespace-pre-line">{contract}</div>
            </motion.div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <motion.div 
                className="text-center text-bento-gray-600 dark:text-bento-gray-200"
                initial={{ scale: 0.95, opacity: 0.5 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ 
                  duration: 0.5,
                  repeat: Infinity,
                  repeatType: "reverse",
                  repeatDelay: 2
                }}
              >
                <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p className="text-base">Fill in the required information to see the contract preview</p>
              </motion.div>
            </div>
          )}
        </motion.div>
        
        {contract && (
          <motion.div 
            className="flex flex-wrap gap-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <Button 
              variant="outline"
              onClick={handleDownloadPDF}
              className="flex-1 border border-bento-gray-200 dark:border-bento-gray-700 hover-scale"
            >
              <Download className="h-4 w-4 mr-1" /> PDF
            </Button>
            <Button 
              variant="outline"
              onClick={handleDownloadWord}
              className="flex-1 border border-bento-gray-200 dark:border-bento-gray-700 hover-scale"
            >
              <Download className="h-4 w-4 mr-1" /> Word
            </Button>
            <Button 
              variant="outline"
              onClick={handleCopyText}
              className="border border-bento-gray-200 dark:border-bento-gray-700 hover-scale"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default ContractForm;

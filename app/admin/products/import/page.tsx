'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import * as XLSX from 'xlsx';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { AdminSidebar } from '@/components/AdminSidebar';
import {
  useValidateBulkImportMutation,
  useExecuteBulkImportMutation,
} from '@/hooks/useAdmin';
import {
  FileSpreadsheet,
  UploadCloud,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw,
  FolderOpen,
  ArrowRight,
  Download,
  Filter,
  Package,
  Layers,
  Award,
  Tag,
  Eye,
  FileCheck,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  X,
  FileText,
  Image as ImageIcon,
} from 'lucide-react';

export default function AdminBulkImportPage() {
  const router = useRouter();

  // Mutations
  const validateMutation = useValidateBulkImportMutation();
  const executeMutation = useExecuteBulkImportMutation();

  // Form & File States
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [rawParsedRows, setRawParsedRows] = useState<any[]>([]);
  const [loadedImages, setLoadedImages] = useState<Record<string, string>>({});
  const [imageFileNames, setImageFileNames] = useState<string[]>([]);
  const [updateExisting, setUpdateExisting] = useState<boolean>(false);

  // Workflow Step State: 'upload' | 'preview' | 'importing' | 'completed'
  const [step, setStep] = useState<'upload' | 'preview' | 'importing' | 'completed'>('upload');

  // Preview & Validation Data
  const [validationResult, setValidationResult] = useState<any>(null);
  const [filterTab, setFilterTab] = useState<'all' | 'valid' | 'invalid'>('all');

  // Execution Progress & Final Report
  const [importProgress, setImportProgress] = useState<number>(0);
  const [finalReport, setFinalReport] = useState<any>(null);

  // File Input Refs
  const excelInputRef = useRef<HTMLInputElement>(null);
  const imageFolderInputRef = useRef<HTMLInputElement>(null);

  // Handle Excel File Drop/Select
  const handleExcelUpload = (e: React.ChangeEvent<HTMLInputElement> | React.DragEvent<HTMLDivElement>) => {
    let file: File | null = null;
    if ('files' in e.target && e.target.files && e.target.files[0]) {
      file = e.target.files[0];
    } else if ('dataTransfer' in e && e.dataTransfer.files && e.dataTransfer.files[0]) {
      e.preventDefault();
      file = e.dataTransfer.files[0];
    }

    if (!file) return;

    setExcelFile(file);

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);
        setRawParsedRows(data);
      } catch (err: any) {
        alert('Failed to parse Excel file: ' + err.message);
      }
    };
    reader.readAsBinaryString(file);
  };

  // Handle Image Files Selection
  const handleImagesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files);
    const names: string[] = [];
    const imageMap: Record<string, string> = {};

    files.forEach((file) => {
      names.push(file.name);
      const reader = new FileReader();
      reader.onload = (evt) => {
        if (evt.target?.result) {
          imageMap[file.name] = evt.target.result as string;
          setLoadedImages((prev) => ({ ...prev, [file.name]: evt.target?.result as string }));
        }
      };
      reader.readAsDataURL(file);
    });

    setImageFileNames(names);
  };

  // Trigger Validation API
  const handleStartValidation = async () => {
    if (rawParsedRows.length === 0) {
      alert('Please upload a valid Excel spreadsheet file containing product rows.');
      return;
    }

    try {
      const result = await validateMutation.mutateAsync({
        products: rawParsedRows,
        updateExisting,
      });

      setValidationResult(result);
      setStep('preview');
    } catch (err: any) {
      alert(err?.response?.data?.message || err.message || 'Validation request failed.');
    }
  };

  // Trigger Final Bulk Import Execution
  const handleExecuteImport = async () => {
    if (!validationResult || validationResult.summary.valid === 0) {
      alert('No valid products available to import.');
      return;
    }

    setStep('importing');
    setImportProgress(5);

    // Smoothly increment progress bar up to 95% while awaiting response
    const interval = setInterval(() => {
      setImportProgress((prev) => {
        if (prev < 30) return prev + 5;
        if (prev < 70) return prev + 3;
        if (prev < 95) return prev + 1;
        return 95;
      });
    }, 400);

    try {
      // Filter valid rows only (or all rows if update mode)
      const rowsToImport = validationResult.rows.filter((r: any) => r.is_valid || (updateExisting && r.is_update));

      const response = await executeMutation.mutateAsync({
        products: rowsToImport,
        updateExisting,
        imagesMap: loadedImages,
      });

      clearInterval(interval);
      setImportProgress(100);
      setFinalReport(response.report);
      setStep('completed');
    } catch (err: any) {
      clearInterval(interval);
      alert(err?.response?.data?.message || err.message || 'Bulk import execution failed.');
      setStep('preview');
    }
  };

  // Download Failed Rows CSV
  const handleDownloadFailedRows = () => {
    if (!finalReport || !finalReport.failed_rows || finalReport.failed_rows.length === 0) return;

    const ws = XLSX.utils.json_to_sheet(finalReport.failed_rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Failed Rows');
    XLSX.writeFile(wb, 'failed_import_rows.xlsx');
  };

  // Filtered rows for preview table
  const displayedRows = React.useMemo(() => {
    if (!validationResult || !validationResult.rows) return [];
    if (filterTab === 'valid') return validationResult.rows.filter((r: any) => r.is_valid);
    if (filterTab === 'invalid') return validationResult.rows.filter((r: any) => !r.is_valid);
    return validationResult.rows;
  }, [validationResult, filterTab]);

  return (
    <div className="min-h-screen bg-background pb-16 pt-6">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl space-y-6">
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: 'Admin', href: '/admin' },
            { label: 'Products', href: '/admin/products' },
            { label: 'Bulk Product Import' },
          ]}
        />

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Admin Sidebar */}
          <AdminSidebar />

          {/* Main Module Content */}
          <div className="flex-1 bg-card border border-border/40 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 min-w-0 w-full">
            {/* Module Title Header */}
            <div className="pb-4 border-b border-border/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-extrabold text-foreground flex items-center gap-2">
                  <FileSpreadsheet className="w-6 h-6 text-emerald-500" />
                  <span>Marketplace Bulk Product Import</span>
                </h1>
                <p className="text-xs text-foreground/60 font-medium mt-1">
                  Upload Excel catalog (`products.xlsx`) & product images to perform batch validation, preview, and database import.
                </p>
              </div>

              {step !== 'upload' && (
                <button
                  onClick={() => {
                    setStep('upload');
                    setValidationResult(null);
                    setFinalReport(null);
                  }}
                  className="px-4 py-2 bg-muted text-foreground/70 hover:text-foreground font-bold text-xs rounded-2xl transition-all inline-flex items-center gap-1.5 self-start sm:self-auto"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Start New Import</span>
                </button>
              )}
            </div>

            {/* Step Indicator Tracker */}
            <div className="grid grid-cols-4 gap-2 text-center text-xs font-bold">
              <div className={`p-3 rounded-2xl border transition-all ${step === 'upload' ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-600' : 'bg-muted/30 border-border/30 text-foreground/50'}`}>
                1. Upload Files
              </div>
              <div className={`p-3 rounded-2xl border transition-all ${step === 'preview' ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-600' : 'bg-muted/30 border-border/30 text-foreground/50'}`}>
                2. Validate & Preview
              </div>
              <div className={`p-3 rounded-2xl border transition-all ${step === 'importing' ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-600' : 'bg-muted/30 border-border/30 text-foreground/50'}`}>
                3. Database Import
              </div>
              <div className={`p-3 rounded-2xl border transition-all ${step === 'completed' ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-600' : 'bg-muted/30 border-border/30 text-foreground/50'}`}>
                4. Import Report
              </div>
            </div>

            {/* ───────────────────────────────────────────────────────────── */}
            {/* STEP 1: UPLOAD FILES FORM */}
            {/* ───────────────────────────────────────────────────────────── */}
            {step === 'upload' && (
              <div className="space-y-6 pt-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Dropzone 1: Excel File (.xlsx) */}
                  <div className="space-y-2">
                    <label className="text-xs font-extrabold uppercase tracking-wider text-foreground/80 flex items-center gap-1.5">
                      <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
                      <span>1. Upload Product Catalog (.xlsx / .csv)</span>
                    </label>

                    <div
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={handleExcelUpload}
                      onClick={() => excelInputRef.current?.click()}
                      className="border-2 border-dashed border-emerald-500/30 hover:border-emerald-500 bg-emerald-500/5 hover:bg-emerald-500/10 transition-all rounded-3xl p-8 text-center cursor-pointer space-y-3"
                    >
                      <input
                        ref={excelInputRef}
                        type="file"
                        accept=".xlsx,.xls,.csv"
                        onChange={handleExcelUpload}
                        className="hidden"
                      />

                      <div className="w-12 h-12 bg-emerald-500/20 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto">
                        <UploadCloud className="w-6 h-6" />
                      </div>

                      {excelFile ? (
                        <div className="space-y-1">
                          <p className="text-sm font-black text-emerald-600 truncate">{excelFile.name}</p>
                          <p className="text-xs text-foreground/60">
                            {(excelFile.size / 1024).toFixed(1)} KB • {rawParsedRows.length} product rows detected
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <p className="text-sm font-extrabold text-foreground">Click or Drag & Drop `products.xlsx`</p>
                          <p className="text-xs text-foreground/50">Supports Excel spreadsheets and CSV catalog files</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Dropzone 2: Product Images Selection */}
                  <div className="space-y-2">
                    <label className="text-xs font-extrabold uppercase tracking-wider text-foreground/80 flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-purple-500" />
                      <span>2. Upload Product Images Folder</span>
                    </label>

                    <div
                      onClick={() => imageFolderInputRef.current?.click()}
                      className="border-2 border-dashed border-purple-500/30 hover:border-purple-500 bg-purple-500/5 hover:bg-purple-500/10 transition-all rounded-3xl p-8 text-center cursor-pointer space-y-3"
                    >
                      <input
                        ref={imageFolderInputRef}
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImagesUpload}
                        className="hidden"
                      />

                      <div className="w-12 h-12 bg-purple-500/20 text-purple-600 rounded-2xl flex items-center justify-center mx-auto">
                        <FolderOpen className="w-6 h-6" />
                      </div>

                      {imageFileNames.length > 0 ? (
                        <div className="space-y-1">
                          <p className="text-sm font-black text-purple-600">{imageFileNames.length} Image Files Loaded</p>
                          <p className="text-xs text-foreground/60">Ready to match with Excel Image Filename column</p>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <p className="text-sm font-extrabold text-foreground">Select Product Images Batch</p>
                          <p className="text-xs text-foreground/50">Choose all product `.png` / `.jpg` images from your folder</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Import Configuration Settings */}
                <div className="p-5 bg-muted/20 border border-border/40 rounded-2xl space-y-3">
                  <h4 className="text-xs font-black uppercase tracking-wider text-foreground">Import Behavior Settings</h4>
                  <label className="flex items-center gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={updateExisting}
                      onChange={(e) => setUpdateExisting(e.target.checked)}
                      className="w-4 h-4 accent-emerald-600 rounded"
                    />
                    <span className="text-xs font-bold text-foreground">
                      Update existing products if SKU matches (Overwrites price, stock, descriptions)
                    </span>
                  </label>
                </div>

                {/* Validation CTA */}
                <button
                  onClick={handleStartValidation}
                  disabled={rawParsedRows.length === 0 || validateMutation.isPending}
                  className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-extrabold text-sm rounded-2xl transition-all shadow-md flex items-center justify-center gap-2"
                >
                  {validateMutation.isPending ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Validating Excel Catalog Data...</span>
                    </>
                  ) : (
                    <>
                      <FileCheck className="w-5 h-5" />
                      <span>Validate Spreadsheet & Proceed to Preview ({rawParsedRows.length} Rows)</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            )}

            {/* ───────────────────────────────────────────────────────────── */}
            {/* STEP 2: PREVIEW & VALIDATION SCREEN */}
            {/* ───────────────────────────────────────────────────────────── */}
            {step === 'preview' && validationResult && (
              <div className="space-y-6">
                {/* Summary Metrics Banner */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  <div className="p-4 bg-muted/20 border border-border/40 rounded-2xl text-center">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-foreground/60">Total Rows</span>
                    <p className="text-2xl font-black text-foreground">{validationResult.summary.total}</p>
                  </div>

                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-center">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Valid Rows</span>
                    <p className="text-2xl font-black text-emerald-600">{validationResult.summary.valid}</p>
                  </div>

                  <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-center">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600">Invalid Rows</span>
                    <p className="text-2xl font-black text-rose-600">{validationResult.summary.invalid}</p>
                  </div>

                  <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-center">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600">Duplicate SKUs</span>
                    <p className="text-2xl font-black text-amber-600">{validationResult.summary.duplicate_skus}</p>
                  </div>

                  <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-2xl text-center">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600">Missing Images</span>
                    <p className="text-2xl font-black text-purple-600">{validationResult.summary.missing_images}</p>
                  </div>
                </div>

                {/* Filter Tabs */}
                <div className="flex items-center justify-between gap-4 border-b border-border/40 pb-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setFilterTab('all')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${filterTab === 'all' ? 'bg-foreground text-background' : 'bg-muted/40 text-foreground/70'}`}
                    >
                      All ({validationResult.rows.length})
                    </button>
                    <button
                      onClick={() => setFilterTab('valid')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${filterTab === 'valid' ? 'bg-emerald-500 text-white' : 'bg-emerald-500/10 text-emerald-600'}`}
                    >
                      Valid Only ({validationResult.summary.valid})
                    </button>
                    <button
                      onClick={() => setFilterTab('invalid')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${filterTab === 'invalid' ? 'bg-rose-500 text-white' : 'bg-rose-500/10 text-rose-600'}`}
                    >
                      Errors Only ({validationResult.summary.invalid})
                    </button>
                  </div>

                  <span className="text-xs text-foreground/50 font-medium">
                    Showing {displayedRows.length} items
                  </span>
                </div>

                {/* Data Preview Table */}
                <div className="border border-border/40 rounded-2xl overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-muted/30 border-b border-border/40 text-[11px] font-extrabold uppercase tracking-wider text-foreground/60">
                        <th className="p-3 text-center">Row</th>
                        <th className="p-3">Image</th>
                        <th className="p-3">Product Name</th>
                        <th className="p-3">Category & Subcategory</th>
                        <th className="p-3">Brand</th>
                        <th className="p-3 text-right">Price</th>
                        <th className="p-3 text-right">Offer Price</th>
                        <th className="p-3 text-center">Status</th>
                        <th className="p-3 text-center">Validation Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/30 text-xs">
                      {displayedRows.map((row: any) => {
                        const localImg = loadedImages[row.image_filename] || row.image_url;

                        return (
                          <tr key={row.row_number} className="hover:bg-muted/10 transition-colors">
                            <td className="p-3 text-center font-bold text-foreground/50">#{row.row_number}</td>

                            <td className="p-3">
                              <div className="w-10 h-10 bg-muted/40 rounded-xl overflow-hidden border border-border/40 flex items-center justify-center shrink-0">
                                {localImg ? (
                                  <img src={localImg} alt={row.name} className="w-full h-full object-cover" />
                                ) : (
                                  <ImageIcon className="w-5 h-5 text-foreground/30" />
                                )}
                              </div>
                            </td>

                            <td className="p-3 max-w-[220px]">
                              <span className="font-extrabold text-foreground block truncate">{row.name}</span>
                              <span className="text-[10px] text-foreground/50 font-mono">SKU: {row.sku}</span>
                            </td>

                            <td className="p-3">
                              <span className="font-bold text-foreground block">{row.category}</span>
                              {row.subcategory && (
                                <span className="text-[11px] text-foreground/60">{row.subcategory}</span>
                              )}
                            </td>

                            <td className="p-3 font-semibold text-foreground/80">{row.brand || '—'}</td>

                            <td className="p-3 text-right font-bold text-foreground">₹{row.price}</td>

                            <td className="p-3 text-right font-extrabold text-emerald-600">₹{row.offer_price}</td>

                            <td className="p-3 text-center">
                              <span className="px-2 py-0.5 bg-blue-500/10 text-blue-600 rounded-md font-bold text-[10px] uppercase">
                                {row.status}
                              </span>
                            </td>

                            <td className="p-3 text-center">
                              {row.is_valid ? (
                                <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-600 rounded-xl font-bold text-xs inline-flex items-center gap-1">
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  <span>{row.is_update ? 'Update' : 'Valid'}</span>
                                </span>
                              ) : (
                                <div className="group relative inline-block">
                                  <span className="px-2.5 py-1 bg-rose-500/10 text-rose-600 rounded-xl font-bold text-xs inline-flex items-center gap-1 cursor-help">
                                    <XCircle className="w-3.5 h-3.5" />
                                    <span>Invalid ({row.errors.length})</span>
                                  </span>

                                  {/* Error Tooltip */}
                                  <div className="absolute right-0 bottom-full mb-2 hidden group-hover:block w-64 p-3 bg-card border border-rose-500/30 rounded-2xl shadow-xl z-50 text-left text-[11px] text-rose-500 space-y-1">
                                    <p className="font-bold text-foreground">Validation Errors:</p>
                                    <ul className="list-disc pl-4 space-y-0.5">
                                      {row.errors.map((err: string, i: number) => (
                                        <li key={i}>{err}</li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Import Trigger CTA */}
                <div className="flex items-center justify-between gap-4 pt-2">
                  <button
                    onClick={() => setStep('upload')}
                    className="px-5 py-3 bg-muted text-foreground/80 hover:text-foreground font-extrabold text-xs rounded-2xl transition-all"
                  >
                    Back to File Upload
                  </button>

                  <button
                    onClick={handleExecuteImport}
                    disabled={validationResult.summary.valid === 0}
                    className="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-extrabold text-sm rounded-2xl transition-all shadow-md inline-flex items-center gap-2"
                  >
                    <FileCheck className="w-5 h-5" />
                    <span>Confirm & Import Products ({validationResult.summary.valid} Valid Rows)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ───────────────────────────────────────────────────────────── */}
            {/* STEP 3: DATABASE IMPORT IN PROGRESS */}
            {/* ───────────────────────────────────────────────────────────── */}
            {step === 'importing' && (
              <div className="py-12 text-center space-y-6 max-w-md mx-auto">
                <div className="w-16 h-16 bg-emerald-500/20 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto animate-pulse">
                  <RefreshCw className="w-8 h-8 animate-spin" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-extrabold text-foreground">Importing Products into Marketplace Database</h3>
                  <p className="text-xs text-foreground/60 font-medium">
                    Processing database transactions, creating categories, brands, specifications, and saving images...
                  </p>
                </div>

                {/* Reassurance Banner */}
                <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-left text-xs font-semibold text-amber-600 space-y-1">
                  <p className="font-extrabold flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>Please do not close or refresh this tab</span>
                  </p>
                  <p className="text-[11px] text-amber-700/80 font-normal">
                    Batch importing products with image resolution and database transactions can take 1 to 3 minutes depending on catalog size.
                  </p>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="w-full bg-muted rounded-full h-3 overflow-hidden border border-border/30">
                    <div
                      className="bg-emerald-500 h-full transition-all duration-300 rounded-full"
                      style={{ width: `${importProgress}%` }}
                    />
                  </div>
                  <span className="text-xs font-black text-emerald-600">{importProgress}% Completed</span>
                </div>
              </div>
            )}

            {/* ───────────────────────────────────────────────────────────── */}
            {/* STEP 4: FINAL IMPORT REPORT */}
            {/* ───────────────────────────────────────────────────────────── */}
            {step === 'completed' && finalReport && (
              <div className="space-y-6">
                {/* Success Header Banner */}
                <div className="p-6 bg-emerald-500/10 border border-emerald-500/30 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-500 text-white rounded-2xl flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-foreground">Bulk Product Import Completed</h3>
                      <p className="text-xs text-foreground/70 font-medium">
                        Successfully imported {finalReport.imported_successfully} of {finalReport.total_processed} products into marketplace catalog.
                      </p>
                    </div>
                  </div>

                  <Link
                    href="/admin/products"
                    className="px-5 py-2.5 bg-emerald-600 text-white font-extrabold text-xs rounded-2xl hover:bg-emerald-700 transition-all shrink-0 inline-flex items-center gap-1.5 shadow-sm"
                  >
                    <span>View Admin Products</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

                {/* Metric Summary Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
                  <div className="p-4 bg-muted/20 border border-border/40 rounded-2xl text-center">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-foreground/50">Total Processed</span>
                    <p className="text-2xl font-black text-foreground">{finalReport.total_processed}</p>
                  </div>

                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-center">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Imported</span>
                    <p className="text-2xl font-black text-emerald-600">{finalReport.imported_successfully}</p>
                  </div>

                  <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-center">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600">Skipped</span>
                    <p className="text-2xl font-black text-rose-600">{finalReport.skipped}</p>
                  </div>

                  <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-center">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600">Duplicate SKU</span>
                    <p className="text-2xl font-black text-amber-600">{finalReport.duplicate_sku}</p>
                  </div>

                  <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-2xl text-center">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600">Missing Images</span>
                    <p className="text-2xl font-black text-purple-600">{finalReport.missing_images}</p>
                  </div>

                  <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl text-center">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">Errors</span>
                    <p className="text-2xl font-black text-blue-600">{finalReport.errors}</p>
                  </div>
                </div>

                {/* Skipped / Failed Rows Log Table */}
                {finalReport.failed_rows && finalReport.failed_rows.length > 0 ? (
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-black uppercase tracking-wider text-rose-500 flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4" />
                        <span>Skipped Product Log ({finalReport.failed_rows.length} Items)</span>
                      </h4>

                      <button
                        onClick={handleDownloadFailedRows}
                        className="px-3.5 py-1.5 bg-rose-500/10 text-rose-600 font-bold text-xs rounded-xl hover:bg-rose-500/20 transition-all inline-flex items-center gap-1.5"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download Failed Rows (.xlsx)</span>
                      </button>
                    </div>

                    <div className="border border-border/40 rounded-2xl overflow-hidden">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-muted/30 border-b border-border/40 text-[11px] font-extrabold uppercase tracking-wider text-foreground/60">
                            <th className="p-3">Row #</th>
                            <th className="p-3">Product Name</th>
                            <th className="p-3">SKU</th>
                            <th className="p-3">Error Reason</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/30 text-xs text-foreground/80">
                          {finalReport.failed_rows.map((fail: any, i: number) => (
                            <tr key={i} className="hover:bg-muted/10">
                              <td className="p-3 font-bold text-foreground/50">#{fail.row_number}</td>
                              <td className="p-3 font-bold">{fail.product_name}</td>
                              <td className="p-3 font-mono text-[11px]">{fail.sku}</td>
                              <td className="p-3 text-rose-500 font-medium">{fail.error}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl text-center text-xs font-bold text-emerald-600 flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Perfect Import! 100% of product rows were processed without errors.</span>
                  </div>
                )}

                {/* Final Actions */}
                <div className="flex items-center justify-between gap-4 pt-4 border-t border-border/40">
                  <button
                    onClick={() => {
                      setStep('upload');
                      setExcelFile(null);
                      setRawParsedRows([]);
                      setValidationResult(null);
                      setFinalReport(null);
                    }}
                    className="px-5 py-3 bg-muted text-foreground/80 hover:text-foreground font-extrabold text-xs rounded-2xl transition-all"
                  >
                    Import Another Batch
                  </button>

                  <Link
                    href="/admin/products"
                    className="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm rounded-2xl transition-all shadow-md inline-flex items-center gap-2"
                  >
                    <span>Go to Admin Products Catalog</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

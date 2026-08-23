'use client';

import React, { useState } from 'react';
import { Upload, FileCheck, CheckCircle2, Trash2, RefreshCw, AlertCircle, ArrowLeft, ArrowRight, Eye } from 'lucide-react';
import { mediaService } from '../../../services/mediaService';
import { useToast } from '../../../components/Toast';

export interface Step4Data {
  panCardDoc?: string;
  idProofDoc?: string;
  addressProofDoc?: string;
  bankProofDoc?: string;
}

interface Step4Props {
  data: Step4Data;
  onChange: (data: Partial<Step4Data>) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const Step4Documents: React.FC<Step4Props> = ({
  data,
  onChange,
  onNext,
  onPrev,
}) => {
  const { error: toastError, success: toastSuccess } = useToast();
  const [uploadingState, setUploadingState] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const documentTypes = [
    {
      key: 'panCardDoc' as keyof Step4Data,
      title: 'PAN Card Copy *',
      description: 'Upload clear scan/photo of PAN Card (PDF, JPG, PNG under 5MB)',
    },
    {
      key: 'idProofDoc' as keyof Step4Data,
      title: 'GST Certificate / Identity Proof *',
      description: 'Upload GST Certificate, Aadhaar, Voter ID, or Passport',
    },
    {
      key: 'addressProofDoc' as keyof Step4Data,
      title: 'Business Address Proof *',
      description: 'Electricity bill, Shop Act license, or Rental agreement',
    },
    {
      key: 'bankProofDoc' as keyof Step4Data,
      title: 'Cancelled Cheque / Bank Statement *',
      description: 'Upload cancelled cheque copy or recent bank passbook page',
    },
  ];

  const handleFileUpload = async (key: keyof Step4Data, file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      toastError('File size must be under 5MB.', 'Upload Failed');
      return;
    }

    setUploadingState((prev) => ({ ...prev, [key]: true }));

    try {
      const url = await mediaService.uploadFile(file, 'documents');
      onChange({ [key]: url });
      toastSuccess(`Document uploaded successfully!`);
      setErrors((prev) => ({ ...prev, [key]: '' }));
    } catch (err: any) {
      toastError(err.message || 'Failed to upload document file.', 'Upload Error');
    } finally {
      setUploadingState((prev) => ({ ...prev, [key]: false }));
    }
  };

  const handleRemove = (key: keyof Step4Data) => {
    onChange({ [key]: '' });
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!data.panCardDoc) errs.panCardDoc = 'PAN Card copy is required.';
    if (!data.idProofDoc) errs.idProofDoc = 'GST or Identity proof is required.';
    if (!data.addressProofDoc) errs.addressProofDoc = 'Address proof document is required.';
    if (!data.bankProofDoc) errs.bankProofDoc = 'Cancelled cheque or bank proof is required.';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onNext();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off">
      <div className="space-y-1">
        <h3 className="text-lg font-black text-foreground">Documents</h3>
        <p className="text-xs text-muted-custom font-medium">
          Upload required verification documents for seller store KYC approval
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {documentTypes.map((doc) => {
          const docUrl = data[doc.key];
          const isUploading = !!uploadingState[doc.key];
          const hasError = !!errors[doc.key];

          return (
            <div
              key={doc.key}
              className={`p-5 bg-card border rounded-2xl space-y-3 relative transition-all ${
                hasError
                  ? 'border-rose-500/50 bg-rose-500/5'
                  : docUrl
                  ? 'border-emerald-500/40 bg-emerald-500/5'
                  : 'border-border-custom/80'
              }`}
            >
              <div className="flex items-center justify-between">
                <h4 className="font-black text-xs text-foreground flex items-center gap-1.5">
                  <FileCheck size={16} className={docUrl ? 'text-emerald-500' : 'text-primary'} />
                  <span>{doc.title}</span>
                </h4>
                {docUrl && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                    <CheckCircle2 size={12} />
                    <span>Uploaded</span>
                  </span>
                )}
              </div>

              <p className="text-[11px] font-medium text-muted-custom leading-relaxed">
                {doc.description}
              </p>

              {docUrl ? (
                <div className="p-3 bg-background-secondary rounded-xl border border-border-custom flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 truncate text-xs font-semibold text-foreground">
                    <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                    <span className="truncate">{docUrl.split('/').pop()}</span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <a
                      href={docUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 bg-card hover:bg-muted text-muted-custom hover:text-foreground rounded-lg transition-colors"
                      title="Preview Document"
                    >
                      <Eye size={15} />
                    </a>
                    <button
                      type="button"
                      onClick={() => handleRemove(doc.key)}
                      className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 rounded-lg transition-colors"
                      title="Remove Document"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ) : (
                <label className="border-2 border-dashed border-border-custom/80 hover:border-primary/60 rounded-xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer bg-background-secondary/40 hover:bg-background-secondary transition-all">
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFileUpload(doc.key, e.target.files[0]);
                      }
                    }}
                    className="hidden"
                    disabled={isUploading}
                  />
                  {isUploading ? (
                    <div className="flex items-center gap-2 text-xs font-bold text-primary animate-pulse">
                      <RefreshCw size={16} className="animate-spin" />
                      <span>Uploading document...</span>
                    </div>
                  ) : (
                    <>
                      <Upload size={22} className="text-muted-custom group-hover:text-primary" />
                      <span className="text-xs font-extrabold text-primary">Click or Drag & Drop to Upload</span>
                    </>
                  )}
                </label>
              )}

              {hasError && <p className="text-[11px] font-bold text-rose-500">{errors[doc.key]}</p>}
            </div>
          );
        })}
      </div>

      {/* Footer bar */}
      <div className="flex items-center justify-between pt-4 border-t border-border-custom">
        <button
          type="button"
          onClick={onPrev}
          className="px-6 py-2.5 bg-background-secondary border border-border-custom hover:bg-card text-foreground font-bold text-xs rounded-xl transition-all flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          <span>Back</span>
        </button>

        <button
          type="submit"
          className="px-8 py-3 bg-primary hover:bg-primary-hover text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-2"
        >
          <span>Review Application</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </form>
  );
};

"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { Award, Printer, ShieldCheck, QrCode, X, Eye, ExternalLink } from "lucide-react";

interface CertificateViewerClientProps {
  certificates: any[];
}

export function CertificateViewerClient({ certificates }: CertificateViewerClientProps) {
  const [selectedCert, setSelectedCert] = useState<any | null>(null);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Table */}
      <div className="rounded-2xl bg-wbre-surfaceDark/80 border border-wbre-primaryGold/20 overflow-hidden shadow-premium-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-wbre-surfaceDarker text-slate-400 uppercase tracking-wider font-semibold border-b border-white/10">
              <tr>
                <th className="py-3.5 px-4">Certificate Serial</th>
                <th className="py-3.5 px-4">Record ID</th>
                <th className="py-3.5 px-4">Recipient</th>
                <th className="py-3.5 px-4">Achievement Title</th>
                <th className="py-3.5 px-4">Issue Date</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Preview / Print</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {certificates.map((cert) => (
                <tr key={cert.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-wbre-lightGold">
                    {cert.certificateNumber}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-300">
                    {cert.record?.recordId || "N/A"}
                  </td>
                  <td className="py-3.5 px-4 font-medium text-white">
                    {cert.recipientName}
                  </td>
                  <td className="py-3.5 px-4 text-slate-300 max-w-xs truncate">
                    {cert.recordTitle}
                  </td>
                  <td className="py-3.5 px-4 text-slate-400">
                    {formatDate(cert.issueDate)}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-950/60 text-emerald-300 border border-emerald-500/40">
                      {cert.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-2">
                    <button
                      onClick={() => setSelectedCert(cert)}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded bg-gold-gradient text-wbre-deepNavy font-bold uppercase text-[11px] hover:bg-gold-gradient-hover shadow-gold-subtle"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View & Print</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Printable Certificate Modal Dialog */}
      {selectedCert && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="bg-wbre-surfaceDarker border-2 border-wbre-primaryGold/50 rounded-3xl p-6 sm:p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto space-y-6 relative animate-in fade-in zoom-in-95">
            {/* Top Toolbar */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10 print:hidden">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider font-bold text-wbre-lightGold">
                <Award className="w-4 h-4" />
                <span>Certificate Document Preview</span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handlePrint}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gold-gradient text-wbre-deepNavy font-bold uppercase text-xs tracking-wider hover:bg-gold-gradient-hover shadow-gold-subtle"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Document</span>
                </button>
                <button
                  onClick={() => setSelectedCert(null)}
                  className="p-2 rounded-lg bg-white/10 text-slate-300 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* THE PRINTABLE CERTIFICATE TEMPLATE */}
            <div className="bg-[#FAF8F2] text-[#07192F] p-8 sm:p-12 rounded-xl certificate-frame shadow-2xl relative overflow-hidden font-serif select-none">
              {/* Subtle Guilloche / Background Watermark */}
              <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />

              {/* Certificate Inner Border */}
              <div className="border border-[#CAA24C] p-6 sm:p-10 relative z-10 flex flex-col items-center text-center space-y-6">
                {/* Official WBRE Seal Emblem */}
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 mx-auto flex items-center justify-center">
                  <Image
                    src="/WBRE.png"
                    alt="Official WBRE Emblem"
                    fill
                    className="object-contain drop-shadow-md"
                  />
                </div>

                {/* Institutional Header */}
                <div className="space-y-1">
                  <h2 className="text-sm sm:text-base font-sans uppercase tracking-[0.3em] font-bold text-[#CAA24C]">
                    WORLD BOOK OF RECORD EXCELLENCE
                  </h2>
                  <h1 className="text-3xl sm:text-5xl font-bold uppercase tracking-tight text-[#07192F] font-serif">
                    CERTIFICATE OF EXCELLENCE
                  </h1>
                  <p className="text-xs uppercase tracking-[0.25em] text-[#617084] font-sans font-semibold pt-1">
                    RECOGNIZING DISTINCTION • WHERE EXCELLENCE BECOMES HISTORY
                  </p>
                </div>

                {/* Body Text */}
                <div className="space-y-4 max-w-2xl pt-2">
                  <p className="text-xs sm:text-sm uppercase tracking-widest text-[#617084] font-sans">
                    THIS OFFICIAL DOCUMENT CERTIFIES THAT
                  </p>

                  <div className="text-2xl sm:text-4xl font-bold text-[#07192F] border-b-2 border-[#CAA24C] pb-2 font-serif">
                    {selectedCert.recipientName}
                  </div>

                  <p className="text-xs sm:text-sm uppercase tracking-widest text-[#617084] font-sans">
                    HAS SUCCESSFULLY ESTABLISHED AND RATIFIED THE OFFICIAL WORLD RECORD FOR
                  </p>

                  <div className="text-lg sm:text-2xl font-bold text-[#07192F] italic">
                    "{selectedCert.recordTitle}"
                  </div>

                  <div className="p-4 rounded-lg bg-[#EFE9DB] border border-[#CAA24C]/40 text-sm font-sans font-bold text-[#07192F]">
                    RATIFIED ACHIEVEMENT: {selectedCert.achievementResult}
                  </div>
                </div>

                {/* Metadata Row */}
                <div className="grid grid-cols-3 gap-4 w-full pt-4 border-t border-[#CAA24C]/30 text-xs font-sans text-left">
                  <div>
                    <span className="text-[10px] text-[#617084] uppercase block">Jurisdiction:</span>
                    <span className="font-semibold">{selectedCert.location}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#617084] uppercase block">Achievement Date:</span>
                    <span className="font-semibold">{formatDate(selectedCert.achievementDate)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#617084] uppercase block">Issue Date:</span>
                    <span className="font-semibold">{formatDate(selectedCert.issueDate)}</span>
                  </div>
                </div>

                {/* Signatories & QR Code Verification */}
                <div className="w-full pt-6 border-t border-[#CAA24C]/30 flex flex-col sm:flex-row items-center justify-between gap-6">
                  {/* Left Signature */}
                  <div className="text-center sm:text-left space-y-1">
                    <div className="w-40 border-b border-[#07192F] mb-1 italic font-serif text-sm">
                      Dr. E. Sterling
                    </div>
                    <span className="text-[10px] font-sans font-bold uppercase tracking-wider block text-[#07192F]">
                      Chief Adjudications Officer
                    </span>
                    <span className="text-[9px] font-sans text-[#617084]">
                      WBRE International Board
                    </span>
                  </div>

                  {/* Center: Certificate Number & Seal */}
                  <div className="text-center font-sans space-y-1">
                    <span className="font-mono text-xs font-bold text-[#07192F] bg-[#EFE9DB] px-3 py-1 rounded border border-[#CAA24C]">
                      {selectedCert.certificateNumber}
                    </span>
                    <span className="text-[9px] text-[#617084] block">
                      OFFICIAL RATIFIED SEAL
                    </span>
                  </div>

                  {/* Right: QR Verification Code */}
                  <div className="flex flex-col items-center text-center font-sans">
                    {selectedCert.qrCodeDataUrl ? (
                      <div className="p-1 bg-white border border-[#CAA24C] rounded shadow-sm">
                        <img
                          src={selectedCert.qrCodeDataUrl}
                          alt="QR Code"
                          className="w-20 h-20"
                        />
                      </div>
                    ) : (
                      <div className="w-20 h-20 border border-[#CAA24C] flex items-center justify-center">
                        <QrCode className="w-10 h-10 text-[#CAA24C]" />
                      </div>
                    )}
                    <span className="text-[9px] text-[#617084] mt-1 font-mono">
                      SCAN TO VERIFY
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

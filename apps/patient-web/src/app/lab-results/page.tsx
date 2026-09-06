'use client';

import React, { useState } from 'react';
import {
  Download,
  AlertCircle,
  CheckCircle2,
  Clock,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface LabPanel {
  id: string;
  testName: string;
  category: string;
  orderDate: string;
  resultDate: string;
  labFacility: string;
  referringClinician: string;
  status: 'released' | 'processing' | 'ordered';
  overallStatus: 'normal' | 'abnormal' | 'pending';
  parameters: {
    name: string;
    value: string;
    unit: string;
    referenceRange: string;
    flag: 'normal' | 'high' | 'low';
    trend: string;
  }[];
}

const LAB_PANELS: LabPanel[] = [
  {
    id: 'lab-2026-8812',
    testName: 'Comprehensive Metabolic Panel (CMP) & HbA1c',
    category: 'Endocrinology & Biochemistry',
    orderDate: '22 Aug 2026',
    resultDate: '24 Aug 2026',
    labFacility: 'Synlab Nigeria (Victoria Island)',
    referringClinician: 'Dr. Chidiebere Okafor (MDCN #34591)',
    status: 'released',
    overallStatus: 'normal',
    parameters: [
      { name: 'Glycated Haemoglobin (HbA1c)', value: '6.2', unit: '%', referenceRange: '4.0 - 5.6', flag: 'high', trend: 'Improved (was 6.5%)' },
      { name: 'Fasting Plasma Glucose', value: '5.4', unit: 'mmol/L', referenceRange: '3.9 - 5.8', flag: 'normal', trend: 'Stable' },
      { name: 'Serum Creatinine', value: '78', unit: 'μmol/L', referenceRange: '53 - 97', flag: 'normal', trend: 'Stable' },
      { name: 'eGFR (CKD-EPI)', value: '>90', unit: 'mL/min/1.73m²', referenceRange: '>90', flag: 'normal', trend: 'Normal renal function' },
      { name: 'Sodium (Na+)', value: '139', unit: 'mmol/L', referenceRange: '135 - 145', flag: 'normal', trend: 'Normal' },
      { name: 'Potassium (K+)', value: '4.3', unit: 'mmol/L', referenceRange: '3.5 - 5.1', flag: 'normal', trend: 'Normal' },
    ],
  },
  {
    id: 'lab-2026-7940',
    testName: 'Lipid Profile & Cardiovascular Biomarkers',
    category: 'Cardiology',
    orderDate: '10 Feb 2026',
    resultDate: '12 Feb 2026',
    labFacility: 'Clinix Healthcare (Lagos)',
    referringClinician: 'Dr. Elizabeth Adeyemi (GMC #7654321)',
    status: 'released',
    overallStatus: 'abnormal',
    parameters: [
      { name: 'Total Cholesterol', value: '5.8', unit: 'mmol/L', referenceRange: '<5.0', flag: 'high', trend: 'Elevated' },
      { name: 'HDL Cholesterol (Protective)', value: '1.4', unit: 'mmol/L', referenceRange: '>1.2', flag: 'normal', trend: 'Optimal' },
      { name: 'LDL Cholesterol (Direct)', value: '3.6', unit: 'mmol/L', referenceRange: '<3.0', flag: 'high', trend: 'Elevated - Dietary focus' },
      { name: 'Triglycerides', value: '1.7', unit: 'mmol/L', referenceRange: '<1.7', flag: 'normal', trend: 'Normal' },
      { name: 'High-Sensitivity CRP (hs-CRP)', value: '1.2', unit: 'mg/L', referenceRange: '<2.0', flag: 'normal', trend: 'Low vascular inflammation' },
    ],
  },
  {
    id: 'lab-2026-9045',
    testName: 'Full Blood Count (FBC) with Automated Differential',
    category: 'Hematology',
    orderDate: '01 Sep 2026',
    resultDate: 'Pending',
    labFacility: 'The Doctors Laboratory (London UK / Dispatch)',
    referringClinician: 'Dr. Alistair Williams (GMC #6123456)',
    status: 'processing',
    overallStatus: 'pending',
    parameters: [],
  },
];

export default function LabResultsPage() {
  const [expandedPanel, setExpandedPanel] = useState<string>('lab-2026-8812');
  const [filterCategory, setFilterCategory] = useState<string>('All');

  const categories = ['All', 'Endocrinology & Biochemistry', 'Cardiology', 'Hematology'];

  const filteredPanels = LAB_PANELS.filter(
    (p) => filterCategory === 'All' || p.category === filterCategory
  );

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 6px 0', letterSpacing: '-0.02em' }}>
            Diagnostic & Laboratory Reports
          </h1>
          <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-muted)' }}>
            Pathology and investigation results verified by accredited diagnostic partner laboratories.
          </p>
        </div>

        <button
          onClick={() => alert('Generating cumulative diagnostic dossier PDF...')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '9px 18px',
            background: 'var(--docaas-teal)',
            color: '#ffffff',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          <Download size={15} />
          <span>Download All Reports (PDF)</span>
        </button>
      </div>

      {/* Category Filter Pills */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setFilterCategory(c)}
            className={`filter-pill ${filterCategory === c ? 'active' : ''}`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Lab Panels List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        {filteredPanels.map((panel) => {
          const isExpanded = expandedPanel === panel.id;
          return (
            <div
              key={panel.id}
              style={{
                background: '#ffffff',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid var(--border-light)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              {/* Panel Header */}
              <div
                onClick={() => setExpandedPanel(isExpanded ? '' : panel.id)}
                style={{
                  padding: '20px 24px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                  background: isExpanded ? '#f8fafc' : '#ffffff',
                  borderBottom: isExpanded ? '1px solid var(--border-light)' : 'none',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>{panel.category}</span>
                    <span>•</span>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Ordered: {panel.orderDate}</span>
                    {panel.status === 'released' && (
                      panel.overallStatus === 'normal' ? (
                        <span className="badge-status success"><CheckCircle2 size={12} /> Normal</span>
                      ) : (
                        <span className="badge-status warning"><AlertCircle size={12} /> Values Require Review</span>
                      )
                    )}
                    {panel.status === 'processing' && (
                      <span className="badge-status info"><Clock size={12} /> In Laboratory Analysis</span>
                    )}
                  </div>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 4px 0', color: 'var(--text-main)' }}>
                    {panel.testName}
                  </h3>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    Facility: <strong>{panel.labFacility}</strong> • Requisition by: {panel.referringClinician}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {isExpanded ? <ChevronUp size={20} color="var(--text-muted)" /> : <ChevronDown size={20} color="var(--text-muted)" />}
                </div>
              </div>

              {/* Panel Details & Parameters Table */}
              {isExpanded && (
                <div style={{ padding: '24px' }}>
                  {panel.status === 'processing' ? (
                    <div style={{ textAlign: 'center', padding: '30px 20px', background: '#f8fafc', borderRadius: 'var(--radius-lg)' }}>
                      <Clock size={32} color="#2563eb" style={{ margin: '0 auto 10px auto' }} />
                      <h4 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 4px 0', color: 'var(--text-main)' }}>
                        Specimen Under Active Analysis
                      </h4>
                      <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)' }}>
                        Results expected within 24 hours. Your referring clinician will receive an automatic push notification upon release.
                      </p>
                    </div>
                  ) : (
                    <div>
                      {/* Diagnostic Table */}
                      <div style={{ overflowX: 'auto', marginBottom: '20px' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
                          <thead>
                            <tr style={{ borderBottom: '2px solid var(--border-light)', color: 'var(--text-muted)', fontSize: '12px', textTransform: 'uppercase' }}>
                              <th style={{ padding: '10px 12px' }}>Biomarker / Assay</th>
                              <th style={{ padding: '10px 12px' }}>Result</th>
                              <th style={{ padding: '10px 12px' }}>Reference Range</th>
                              <th style={{ padding: '10px 12px' }}>Status Flag</th>
                              <th style={{ padding: '10px 12px' }}>Historical Trend</th>
                            </tr>
                          </thead>
                          <tbody>
                            {panel.parameters.map((param, idx) => (
                              <tr key={idx} style={{ borderBottom: '1px solid var(--border-light)', background: param.flag === 'high' ? '#fefce8' : 'transparent' }}>
                                <td style={{ padding: '12px', fontWeight: 600, color: 'var(--text-main)' }}>{param.name}</td>
                                <td style={{ padding: '12px', fontWeight: 700, color: param.flag === 'high' ? '#b45309' : 'var(--text-main)' }}>
                                  {param.value} {param.unit}
                                </td>
                                <td style={{ padding: '12px', color: 'var(--text-muted)' }}>{param.referenceRange} {param.unit}</td>
                                <td style={{ padding: '12px' }}>
                                  {param.flag === 'normal' && <span className="badge-status success">Normal</span>}
                                  {param.flag === 'high' && <span className="badge-status warning">High</span>}
                                  {param.flag === 'low' && <span className="badge-status danger">Low</span>}
                                </td>
                                <td style={{ padding: '12px', color: 'var(--text-muted)', fontSize: '12px' }}>{param.trend}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Footer Actions */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid var(--border-light)' }}>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                          Verified on {panel.resultDate} by Laboratory Consultant Pathologist
                        </div>
                        <button
                          onClick={() => alert(`Downloading verified lab report ${panel.id}...`)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '8px 16px',
                            background: '#ffffff',
                            border: '1px solid var(--border-light)',
                            borderRadius: 'var(--radius-md)',
                            fontSize: '12px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            color: 'var(--docaas-teal)',
                          }}
                        >
                          <Download size={14} />
                          <span>Download Signed PDF</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

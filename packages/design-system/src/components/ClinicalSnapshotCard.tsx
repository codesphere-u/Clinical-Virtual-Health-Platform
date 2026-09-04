import React from 'react';
import { Card } from './Card';
import { Badge } from './Badge';
import { AlertCircle, ShieldAlert, User } from 'lucide-react';

export interface ClinicalSnapshotProps {
  mrn: string;
  fullName: string;
  ageYears: number;
  gender: string;
  bloodGroup?: string;
  genotype?: string;
  allergies?: Array<{ substance: string; severity: string }>;
  safeguardingFlag?: boolean;
  photoUrl?: string;
  verificationStatus?: 'verified' | 'pending' | 'unverified';
}

export const ClinicalSnapshotCard: React.FC<ClinicalSnapshotProps> = ({
  mrn,
  fullName,
  ageYears,
  gender,
  bloodGroup = 'Unknown',
  genotype = 'Unknown',
  allergies = [],
  safeguardingFlag = false,
  photoUrl,
  verificationStatus = 'verified',
}) => {
  const hasSevereAllergies = allergies.some(
    (a) => a.severity.toLowerCase() === 'severe' || a.severity.toLowerCase() === 'life_threatening'
  );

  return (
    <Card variant="elevated" padding="md" className="border-l-4 border-l-[#0D746F]">
      <div className="flex items-start justify-between gap-4">
        {/* Left: Photo & Identification */}
        <div className="flex items-center gap-3.5">
          <div className="relative h-12 w-12 rounded-full overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 shrink-0">
            {photoUrl ? (
              <img src={photoUrl} alt={fullName} className="h-full w-full object-cover" />
            ) : (
              <User className="h-6 w-6 text-slate-400" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-slate-900 text-base leading-snug">{fullName}</h3>
              {verificationStatus === 'verified' && (
                <Badge variant="verified" size="sm" dot>
                  Verified
                </Badge>
              )}
            </div>
            <p className="text-xs text-slate-500 font-mono mt-0.5">
              MRN: <span className="font-medium text-slate-700">{mrn}</span> • {ageYears}y /{' '}
              {gender.charAt(0).toUpperCase() + gender.slice(1)}
            </p>
          </div>
        </div>

        {/* Right: Key Clinical Markers */}
        <div className="flex items-center gap-2">
          <div className="text-right pr-2 border-r border-slate-200">
            <span className="text-[10px] uppercase font-semibold text-slate-400 block tracking-wider">
              Blood / Geno
            </span>
            <span className="text-xs font-bold font-mono text-slate-800">
              {bloodGroup} • {genotype}
            </span>
          </div>

          {safeguardingFlag && (
            <Badge variant="warning" size="sm" className="gap-1">
              <ShieldAlert className="h-3.5 w-3.5 text-amber-600" />
              Safeguarding Flag
            </Badge>
          )}
        </div>
      </div>

      {/* Allergies Highlight Strip */}
      {allergies.length > 0 ? (
        <div
          className={`mt-3.5 px-3 py-2 rounded-lg text-xs flex items-center gap-2 border ${
            hasSevereAllergies
              ? 'bg-rose-50 border-rose-200 text-rose-800'
              : 'bg-amber-50 border-amber-200 text-amber-800'
          }`}
        >
          <AlertCircle className="h-4 w-4 shrink-0 text-current" />
          <span className="font-semibold">Allergies:</span>
          <span className="truncate">
            {allergies.map((a) => `${a.substance} (${a.severity})`).join(', ')}
          </span>
        </div>
      ) : (
        <div className="mt-3.5 px-3 py-1.5 rounded-lg text-xs bg-slate-50 border border-slate-100 text-slate-500 flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          <span>No known active drug allergies recorded</span>
        </div>
      )}
    </Card>
  );
};

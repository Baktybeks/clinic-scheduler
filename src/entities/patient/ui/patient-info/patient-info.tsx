import { formatPhone } from "@/shared/lib/phone-utils";

interface PatientInfoProps {
  name: string;
  phone: string;
  email?: string;
  compact?: boolean;
}

export function PatientInfo({
  name,
  phone,
  email,
  compact = false,
}: PatientInfoProps) {
  if (compact) {
    return (
      <div className="text-sm">
        <div className="font-medium">{name}</div>
        <div className="text-gray-500">{formatPhone(phone)}</div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div>
        <label className="text-sm font-medium text-gray-500">Пациент</label>
        <div className="text-base">{name}</div>
      </div>
      <div>
        <label className="text-sm font-medium text-gray-500">Телефон</label>
        <div className="text-base">{formatPhone(phone)}</div>
      </div>
      {email && (
        <div>
          <label className="text-sm font-medium text-gray-500">Email</label>
          <div className="text-base">{email}</div>
        </div>
      )}
    </div>
  );
}

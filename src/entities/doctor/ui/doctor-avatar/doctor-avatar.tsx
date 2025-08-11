interface DoctorAvatarProps {
  avatar: string;
  name: string;
  size?: "sm" | "md" | "lg";
}

export function DoctorAvatar({ avatar, name, size = "md" }: DoctorAvatarProps) {
  const sizeClasses = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-3xl",
  };

  return (
    <div
      className={`${sizeClasses[size]} flex items-center justify-center`}
      title={name}
    >
      {avatar}
    </div>
  );
}

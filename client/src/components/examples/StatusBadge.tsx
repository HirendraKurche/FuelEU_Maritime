import StatusBadge from '../StatusBadge';

export default function StatusBadgeExample() {
  return (
    <div className="flex gap-4 p-6">
      <StatusBadge isCompliant={true} />
      <StatusBadge isCompliant={false} />
    </div>
  );
}

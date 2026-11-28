export function DashboardChecklistProgress({
  completedCount,
  totalSteps,
}: {
  completedCount: number;
  totalSteps: number;
}) {
  return (
    <div className="mx-5 mt-2">
      <p className="mb-1 text-xs text-base-content/60">
        {completedCount} of {totalSteps} complete
      </p>
      <progress
        className="progress progress-primary block h-1.5 w-full"
        value={completedCount}
        max={totalSteps}
        aria-label={`Onboarding progress: ${completedCount} of ${totalSteps} steps complete`}
      />
    </div>
  );
}

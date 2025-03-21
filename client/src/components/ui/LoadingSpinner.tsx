export default function LoadingSpinner() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-boxdark">
      <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
    </div>
  );
}
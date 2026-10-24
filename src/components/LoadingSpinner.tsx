import Hanko from "@/components/yotei/Hanko";

export default function LoadingSpinner() {
  return (
    <div role="status" className="mt-24 flex justify-center">
      <Hanko className="size-12 animate-bounce text-3xl" />
      <span className="sr-only">Loading</span>
    </div>
  );
}

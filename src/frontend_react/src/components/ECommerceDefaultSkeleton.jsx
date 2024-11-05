import { Skeleton } from "./ui/skeleton";
import { Card, CardContent } from "./ui/card";

const ECommerceDefaultSkeleton = () => {
  return (
    <Card className="w-full h-auto p-4 rounded-md dark:border dark:border-default-200">
      <div className="h-[191px] w-full mb-4 rounded-md">
        <Skeleton className="w-full h-[191px]" />
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <Skeleton className="w-1/4 h-2" /> {/* Adjusted width for consistency */}
          <Skeleton className="w-1/4 h-2" /> {/* Adjusted width for consistency */}
        </div>

        <Skeleton className="w-5/6 h-4 mb-2" />

        <Skeleton className="w-full h-2 mb-1.5" />
        <Skeleton className="w-full h-2 mb-4" />

        <div className="mb-4 flex space-x-4">
          <Skeleton className="w-1/6 h-3" /> {/* Adjusted width for icons */}
          <Skeleton className="w-1/6 h-3" /> {/* Adjusted width for icons */}
        </div>
        <div className="flex space-x-6">
          <Skeleton className="w-full h-10" />
        </div>
      </div>
    </Card>
  );
};

export default ECommerceDefaultSkeleton;

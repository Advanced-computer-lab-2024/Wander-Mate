import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Progress } from "./ui/progress";
const ListItem = ({ item, index }) => {
  const { name, email, score, image, revenue, color } = item;

  return (
    <>
      <div className="flex flex-col sm:flex-row flex-wrap gap-7 sm:gap-4 w-full p-2 px-4  hover:bg-default-50 rounded-lg">
        <div className="flex-none flex flex-wrap items-center gap-3">
          <div className="relative inline-block">
            <Avatar className="h-16 w-16">
              <AvatarImage src={image} />
              <AvatarFallback>
                {(item.user.FullName || item.user.Username)
                  ?.substring(0, 2)
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <Badge className="w-[18px] h-[18px] bg-warning/90 text-[10px] font-semibold p-0  items-center justify-center   absolute left-[calc(100%-14px)] top-[calc(100%-16px)] bg-yellow-400">
              {index}
            </Badge>
          </div>
          <div>
            <div className="text-sm font-medium text-default-800 mb-1 whitespace-nowrap">
              {item.user.FullName || item.user.Username}
            </div>
            <div className="text-xs text-default-600 whitespace-nowrap">
              {item.user.Email}
            </div>
          </div>
        </div>

        <div className="flex-1 flex items-center sm:justify-center">
          <div>
            <Badge variant="soft">${revenue}</Badge>
          </div>
        </div>

        <div className="flex-none">
          <div className="w-full sm:w-[170px]">
            <div className="flex  justify-between items-center gap-2 mb-1">
              <span className="text-xs font-medium text-default-800">
                Score
              </span>
              <span className="text-xs font-medium text-default-800">
                {score}%
              </span>
            </div>
            <Progress value={score} size="sm" color={color} />
          </div>
        </div>
      </div>
    </>
  );
};

export default ListItem;

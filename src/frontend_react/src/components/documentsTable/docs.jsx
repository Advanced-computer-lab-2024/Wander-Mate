import {
  ChevronDown,
  ChevronRight,
  ChevronUp,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Timer,
} from "lucide-react";
export const labels = [
  {
    value: "bug",
    label: "Bug",
  },
  {
    value: "feature",
    label: "Feature",
  },
  {
    value: "documentation",
    label: "Documentation",
  },
];

export const statuses = [
  //   {
  //     value: "backlog",
  //     label: "Backlog",
  //     icon: HelpCircle,
  //   },
  //   {
  //     value: "todo",
  //     label: "Todo",
  //     icon: CheckCircle2,
  //   },
  {
    value: "Pending",
    label: "Pending",
    icon: Timer,
  },
  {
    value: "Resolved",
    label: "Resolved",
    icon: CheckCircle2,
  },
  //   {
  //     value: "canceled",
  //     label: "Canceled",
  //     icon: XCircle,
  //   },
];

export const priorities = [
  {
    label: "Seller",
    value: "Seller",
    // icon: ChevronDown,
  },
  {
    label: "Advertiser",
    value: "Advertiser",
    // icon: ChevronRight,
  },
  {
    label: "TourGuide",
    value: "TourGuide",
    // icon: ChevronUp,
  },
];
export const DocsStatuses = [
  //   {
  //     value: "backlog",
  //     label: "Backlog",
  //     icon: HelpCircle,
  //   },
  //   {
  //     value: "todo",
  //     label: "Todo",
  //     icon: CheckCircle2,
  //   },
  {
    value: "Accepted",
    label: "Accepted",
    icon: Timer,
  },
  {
    value: "Rejected",
    label: "Rejected",
    icon: CheckCircle2,
  },
  //   {
  //     value: "canceled",
  //     label: "Canceled",
  //     icon: XCircle,
  //   },
];

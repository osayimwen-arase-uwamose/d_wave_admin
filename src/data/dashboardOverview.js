import {
  CalendarDays,
  Users,
  Mic,
  Mail,
  HardHat,
} from "lucide-react";

const DASHBOARD_OVERVIEW_STATS = [
  {
    id: "active-events",
    title: "ACTIVE EVENTS",
    description: "Events currently available in the system",
    icon: CalendarDays,
    valueKey: "activeEvents",
    footerLabel: "EVENTS IN SYSTEM",
    footerType: "neutral",
  },
  {
    id: "subscribers",
    title: "SUBSCRIBERS",
    description: "Newsletter subscriber statistics",
    icon: Users,
    valueKey: "subscribers",
    footerLabel: "NO SUBSCRIBERS YET",
    footerType: "unavailable",
  },
  {
    id: "inquiries",
    title: "UNREAD INQUIRIES",
    description: "Contact messages requiring attention",
    icon: Mail,
    valueKey: "unreadInquiries",
    footerLabel: "NO INQUIRIES YET",
    footerType: "unavailable",
  },
  {
    id: "artists",
    title: "ARTISTS",
    description: "Artists currently under D-Wave Entertainment Management",
    icon: Mic,
    valueKey: "artists",
    footerLabel: "NO ARTISTS YET",
    footerType: "unavailable",
  },
];

const DASHBOARD_NOTIFICATION_PLACEHOLDERS = [
  {
    id: "sample-media-ingest",
    category: "SYSTEM ACTIVITY",
    title: "Activity feed awaiting integration",
    description:
      "Connect the relevant backend endpoint to display real administrative activity.",
    time: null,
    iconName: "activity",
    isPlaceholder: false,
  },
  {
    id: "sample-contact-inquiries",
    category: "CONTACT INQUIRIES",
    title: "Inquiry notifications unavailable",
    description:
      "Unread message counts and inquiry updates will appear when the contact API is connected.",
    time: null,
    iconName: "mail",
    isPlaceholder: false,
  },
  {
    id: "sample-event-updates",
    category: "EVENT MANAGEMENT",
    title: "Event activity feed pending",
    description:
      "Event creation, updates, and publication activity can be integrated here.",
    time: null,
    iconName: "calendar",
    isPlaceholder: false,
  },
];

export { 
  DASHBOARD_OVERVIEW_STATS,
  DASHBOARD_NOTIFICATION_PLACEHOLDERS,
};

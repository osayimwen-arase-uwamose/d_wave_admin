import {
CalendarDays,
MapPin,
} from "lucide-react";

const formatDate = (value) => {
if (!value) {
return "DATE NOT SET";
}

const date = new Date(value);

if (Number.isNaN(date.getTime())) {
return value;
}

return date.toLocaleDateString(
"en-US",
{
weekday: "short",
month: "short",
day: "numeric",
year: "numeric",
},
);
};

const EventMetaCard = ({
icon: Icon,
label,
value,
detail,
}) => {
return ( <div
   className="
     flex
     min-w-0
     items-start
     gap-3
     rounded-lg
     border
     border-slate-200
     bg-white
     p-4
     shadow-sm
   "
 > <div
     className="
       flex
       h-9
       w-9
       shrink-0
       items-center
       justify-center
       rounded
       bg-slate-100
       text-[#2563EB]
     "
   > <Icon size={18} /> </div>

  <div className="min-w-0">
    <span
      className="
        block
        font-mono
        text-[10px]
        font-bold
        uppercase
        tracking-[0.12em]
        text-slate-500
      "
    >
      {label}
    </span>

    <span
      className="
        mt-1
        block
        truncate
        font-display
        text-sm
        font-semibold
        text-[#0F172A]
      "
    >
      {value}
    </span>

    {detail && (
      <span
        className="
          mt-0.5
          block
          truncate
          font-mono
          text-[10px]
          uppercase
          tracking-[0.06em]
          text-slate-500
        "
      >
        {detail}
      </span>
    )}
  </div>
</div>


);
};

const EventMeta = ({
event,
}) => {
const venue =
event.venue ||
event.location ||
event.venueName ||
"VENUE NOT SET";

const location =
event.address ||
event.city ||
event.venueLocation ||
"";

return ( <div
   className="
     mb-6
     grid
     grid-cols-1
     gap-3
     sm:grid-cols-2
   "
 >
  <EventMetaCard
    icon={CalendarDays}
    label="Scheduled At"
    value={formatDate(
      event.scheduledAt
    )}
    detail={
    event.time ||
    event.startTime ||
    event.scheduledAt ||
    ""
    }
  />

  <EventMetaCard
    icon={MapPin}
    label="Venue Location"
    value={venue}
    detail={location}
  />
</div>

);
};

export default EventMeta;

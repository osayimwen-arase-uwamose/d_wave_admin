import {
FileText,
} from "lucide-react";

const EventOverview = ({
event,
}) => {
return ( <div className="space-y-4"> <section
     className="
       rounded-xl
       border
       border-slate-200
       bg-white
       p-5
       shadow-sm
       sm:p-6
     "
   > <div className="mb-4 flex items-center gap-3"> <div
         className="
           flex
           h-9
           w-9
           items-center
           justify-center
           rounded
           bg-slate-100
           text-[#2563EB]
         "
       > <FileText size={18} /> </div>

      <div>
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
          Event Information
        </span>

        <h2
          className="
            font-display
            text-xl
            font-semibold
            tracking-tight
            text-[#0F172A]
          "
        >
          Description
        </h2>
      </div>
    </div>

    <p
      className="
        font-body
        text-base
        leading-7
        text-slate-600
      "
    >
      {event.description ||
        "No description has been added for this event yet."}
    </p>
  </section>

  {(event.category ||
    event.status) && (
    <section
      className="
        rounded-xl
        border
        border-slate-200
        bg-white
        p-5
        shadow-sm
        sm:p-6
      "
    >
      <div
        className="
          grid
          grid-cols-1
          gap-5
          sm:grid-cols-2
        "
      >
        {event.category && (
          <div>
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
              Category
            </span>

            <span
              className="
                mt-1
                block
                font-display
                text-sm
                font-semibold
                text-[#0F172A]
              "
            >
              {event.category}
            </span>
          </div>
        )}

        {event.status && (
          <div>
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
              Status
            </span>

            <span
              className="
                mt-1
                inline-flex
                rounded-full
                bg-slate-100
                px-2.5
                py-1
                font-mono
                text-[10px]
                font-bold
                uppercase
                tracking-[0.08em]
                text-[#0F172A]
              "
            >
              {event.status}
            </span>
          </div>
        )}
      </div>
    </section>
  )}
</div>
);
};

export default EventOverview;

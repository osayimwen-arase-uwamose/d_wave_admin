import {
useState,
} from "react";

const EventTabs = ({
galleryCount = 0,
overview,
gallery,
}) => {
const [activeTab, setActiveTab] =
useState("overview");

return ( <section> <div
     className="
       mb-6
       flex
       rounded-lg
       border
       border-slate-200
       bg-slate-100
       p-1
     "
   >
<button
type="button"
onClick={() =>
setActiveTab("overview")
}
className={`             flex-1
            rounded-md
            px-3
            py-2
            font-mono
            text-[11px]
            font-bold
            uppercase
            tracking-[0.08em]
            transition-all
            ${
              activeTab === "overview"
                ? "bg-[#0F172A] text-white shadow-sm"
                : "text-slate-500 hover:text-[#0F172A]"
            }
          `}
>
Overview </button>

    <button
      type="button"
      onClick={() =>
        setActiveTab("gallery")
      }
      className={`
        flex-1
        rounded-md
        px-3
        py-2
        font-mono
        text-[11px]
        font-bold
        uppercase
        tracking-[0.08em]
        transition-all
        ${
          activeTab === "gallery"
            ? "bg-[#0F172A] text-white shadow-sm"
            : "text-slate-500 hover:text-[#0F172A]"
        }
      `}
    >
      Gallery
      {galleryCount > 0 && (
        <span className="ml-1.5">
          ({galleryCount})
        </span>
      )}
    </button>
  </div>

  {activeTab === "overview" && overview}

  {activeTab === "gallery" && gallery}
</section>
);
};

export default EventTabs;

import {
useEffect,
useState,
} from "react";

import {
ChevronDown,
} from "lucide-react";

const EventHero = ({
event,
}) => {
const [isScrolled, setIsScrolled] =
useState(false);

useEffect(() => {
  const handleScroll = () => {
  setIsScrolled(window.scrollY > 80);
  };

  handleScroll();

  window.addEventListener(
    "scroll",
    handleScroll,
    { passive: true },
  );

  return () => {
    window.removeEventListener(
      "scroll",
      handleScroll,
    );
  };
}, []);

const image = event.flyerUrl;

const category = event.category; 

return (
<section
className={`relative
        mb-6
        overflow-hidden
        rounded-xl
        border
        border-slate-200
        bg-slate-900
        shadow-sm
        transition-all
        duration-500
        ease-out
        ${
          isScrolled
            ? "h-[220px] sm:h-[260px]"
            : "aspect-[16/8] min-h-[260px] sm:aspect-video sm:min-h-0"
        }
      `}
>
{image ? (
<img
src={image}
alt={event.title}
className="
absolute
inset-0
h-full
w-full
object-cover
transition-transform
duration-700
ease-out
"
/>
) : ( <div
       className="
         absolute
         inset-0
         bg-gradient-to-br
         from-slate-900
         via-slate-800
         to-slate-700
       "
     />
)}

  <div
    className="
      absolute
      inset-0
      bg-gradient-to-t
      from-[#0F172A]/95
      via-[#0F172A]/35
      to-transparent
    "
  />

  <div
    className={`
      absolute
      inset-x-0
      bottom-0
      p-5
      sm:p-6
      transition-all
      duration-500
      ${
        isScrolled
          ? "sm:p-5"
          : "sm:p-8"
      }
    `}
  >
    <div className="max-w-3xl">
      <div
        className="
          mb-2
          inline-flex
          items-center
          rounded
          bg-[#2563EB]
          px-2.5
          py-1
          font-mono
          text-[10px]
          font-bold
          uppercase
          tracking-[0.12em]
          text-white
        "
      >
        {category}
      </div>

      <h1
        className={`
          font-display
          font-bold
          uppercase
          tracking-tight
          text-white
          transition-all
          duration-500
          ${
            isScrolled
              ? "text-2xl sm:text-3xl"
              : "text-3xl sm:text-4xl lg:text-5xl"
          }
        `}
      >
        {event.title}
      </h1>
    </div>
  </div>

  {!isScrolled && (
    <div
      className="
        absolute
        bottom-4
        right-5
        hidden
        items-center
        gap-1
        font-mono
        text-[10px]
        font-bold
        uppercase
        tracking-[0.12em]
        text-white/70
        sm:flex
      "
    >
      <span>Scroll to explore</span>

      <ChevronDown
        size={14}
        className="animate-bounce"
      />
    </div>
  )}
</section>
);
};

export default EventHero;

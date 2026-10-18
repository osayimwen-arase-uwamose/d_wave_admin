import { Link } from "react-router-dom";

export default function Logo() {
  return (
    <Link
      to="/"
      className="
        px-2
        py-1
        border
        border-transparent
        hover:border-grid-line
        hover:bg-surface-container-low
        transition-all
        duration-75
        active:translate-x-[2px]
        active:translate-y-[2px]
        active:shadow-none
        flex
        flex-row
        items-center
      "
    >
      <img src="https://res.cloudinary.com/gbpvhers/image/upload/v1791226266/logo.jpg" alt="d-wave_entertainment_logo" className="w-8 h-8" />
      <span className="font-display text-2xl font-bold text-primary ml-1">
          D-WAVE ENTERTAINMENT
      </span>
    </Link>
  );
}
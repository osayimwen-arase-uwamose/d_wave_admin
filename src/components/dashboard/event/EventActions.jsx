import {
Edit3,
ImagePlus,
Trash2,
} from "lucide-react";

const EventActions = ({
onUpdate,
onDelete,
onAddImage,
}) => {
return ( <div
   className="
     mt-8
     border-t
     border-slate-200
     pt-6
   "
 >
{onAddImage && ( <button
       type="button"
       onClick={onAddImage}
       className="
         mb-3
         flex
         w-full
         items-center
         justify-center
         gap-2
         rounded-lg
         border
         border-slate-300
         bg-white
         px-4
         py-2.5
         font-display
         text-sm
         font-semibold
         text-[#0F172A]
         shadow-sm
         transition
         hover:bg-slate-100
         focus-visible:outline-none
         focus-visible:ring-2
         focus-visible:ring-[#0F172A]
         focus-visible:ring-offset-2
       "
     > <ImagePlus size={18} />

      <span>
        Add Image to Gallery
      </span>
    </button>
  )}

  <div className="flex gap-3">
    {onUpdate && (
      <button
        type="button"
        onClick={onUpdate}
        className="
          flex
          flex-1
          items-center
          justify-center
          gap-2
          rounded-lg
          bg-[#0F172A]
          px-4
          py-2.5
          font-display
          text-sm
          font-semibold
          text-white
          shadow-sm
          transition
          hover:bg-[#0C1324]
          focus-visible:outline-none
          focus-visible:ring-2
          focus-visible:ring-[#0F172A]
          focus-visible:ring-offset-2
        "
      >
        <Edit3 size={18} />

        <span>
          Update Event
        </span>
      </button>
    )}

    {onDelete && (
      <button
        type="button"
        onClick={onDelete}
        className="
          flex
          items-center
          justify-center
          gap-2
          rounded-lg
          border
          border-red-200
          bg-white
          px-4
          py-2.5
          font-display
          text-sm
          font-semibold
          text-[#DC2626]
          transition
          hover:bg-red-50
          focus-visible:outline-none
          focus-visible:ring-2
          focus-visible:ring-red-500
          focus-visible:ring-offset-2
        "
      >
        <Trash2 size={18} />

        <span className="hidden sm:inline">
          Delete Event
        </span>
      </button>
    )}
  </div>
</div>

);
};

export default EventActions;

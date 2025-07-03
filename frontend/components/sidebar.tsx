"use client";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import clsx from 'clsx';

export default function SideBar({ expanded, setExpanded }: { expanded: boolean, setExpanded: (v: boolean) => void }) {
  return (
    <div
      className={clsx(
        'transition-all duration-300 bg-white h-full border-r shadow-md flex flex-col items-center',
        expanded ? 'w-[400px]' : 'w-[70px]'
      )}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="mt-6 ml-auto mr-2 p-2 hover:bg-gray-100 rounded"
      >
        {expanded ? (
          <ChevronLeft className="w-8 h-8" />
        ) : (
          <ChevronRight className="w-8 h-8" />
        )}
      </button>
    </div>
  );
}



// export default function SideBar() {
//     const [expanded, setExpanded] = useState(false);
//   return (
//     <div
//       className={clsx(
//         'transition-all duration-300 bg-white h-full border-r shadow-md flex flex-col items-center',
//         expanded ? 'w-[400px]' : 'w-[70px]'
//       )}
//     >
//       <button
//         onClick={() => setExpanded(!expanded)}
//         className="mt-6 ml-auto mr-2 p-2 hover:bg-gray-100 rounded"
//       >
//         {expanded ? (
//           <ChevronLeft className="w-8 h-8" />
//         ) : (
//           <ChevronRight className="w-8 h-8" />
//         )}
//       </button>
//     </div>
//   );
// }

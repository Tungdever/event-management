import React from "react";

const SliderSpeaker = ({ speakers }) => {
  return (
    <div className="w-full max-w-[540px] sm:max-w-[600px] lg:max-w-[780px] overflow-x-auto my-6 sm:my-8 lg:my-10 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
      <div className="flex gap-2 sm:gap-3 lg:gap-4 w-max">
        {speakers.map((speaker) => (
          <a
            key={speaker.speakerId}
            href="#"
            className="group relative block bg-black w-[140px] sm:w-[160px] lg:w-[180px] h-[200px] sm:h-[240px] lg:h-[260px] flex-shrink-0 rounded-lg overflow-hidden"
          >
            <img
              alt={speaker.speakerName}
              src={`${speaker.speakerImage}`}
              className="absolute inset-0 h-full w-full object-cover opacity-75 transition-opacity group-hover:opacity-50"
            />
            <div className="relative p-2 sm:p-3 lg:p-4">
              <p className="text-[8px] sm:text-[9px] lg:text-[10px] font-medium uppercase tracking-widest text-pink-500">
                {speaker.speakerTitle}
              </p>
              <p className="text-sm sm:text-base lg:text-lg font-bold text-white truncate">
                {speaker.speakerName}
              </p>
              <div className="mt-12 sm:mt-20 lg:mt-24">
                <div className="translate-y-4 transform opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">
                  <p className="text-[10px] sm:text-[11px] lg:text-xs text-white line-clamp-3">
                    {speaker.speakerDesc}
                  </p>
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default SliderSpeaker;
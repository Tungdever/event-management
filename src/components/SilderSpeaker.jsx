import React from "react";

const SliderSpeaker = ({speakers}) => {
  return (
    <div className="w-[780px] overflow-x-auto my-10 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
      <div className="flex gap-4 w-max ">
        {speakers.map((speaker) => (
          <a
            key={speaker.speakerId}
            href="#"
            className="group relative block bg-black w-[180px] h-[260px] flex-shrink-0 rounded-lg overflow-hidden"
          >
            <img
              alt={speaker.speakerName}
              src={`${speaker.speakerImage}`}
              className="absolute inset-0 h-full w-full object-cover opacity-75 transition-opacity group-hover:opacity-50"
            />
            <div className="relative p-2 sm:p-4 lg:p-6">
              <p className="text-[10px] font-medium uppercase tracking-widest text-pink-500">
                {speaker.speakerTitle}
              </p>
              <p className="text-lg font-bold text-white">{speaker.speakerName}</p>
              <div className="mt-16 sm:mt-24 lg:mt-32">
                <div className="translate-y-4 transform opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">
                  <p className="text-xs text-white">
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

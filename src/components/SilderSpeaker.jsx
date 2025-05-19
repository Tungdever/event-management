import React from "react";

const SliderSpeaker = ({ speakers }) => {
  const getDefaultSpeakerImage = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 200;
    canvas.height = 200;
    const ctx = canvas.getContext("2d");

    // Nền gradient sáng (xanh lam)
    const gradient = ctx.createLinearGradient(0, 0, 200, 200);
    gradient.addColorStop(0, "#60A5FA"); // Xanh lam nhạt
    gradient.addColorStop(1, "#3B82F6"); // Xanh lam sáng
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 200, 200);

    // Biểu tượng hình người
    ctx.fillStyle = "#1E3A8A"; // Xanh đậm cho silhouette

    // Đầu (hình tròn)
    ctx.beginPath();
    ctx.arc(100, 60, 30, 0, Math.PI * 2); // Vẽ đầu tại (100, 60), bán kính 30
    ctx.fill();

    // Vai và thân (hình chữ nhật bo góc)
    ctx.beginPath();
    ctx.roundRect(70, 90, 60, 80, 10); // Vẽ thân từ (70, 90), rộng 60, cao 80, góc bo 10
    ctx.fill();

    return canvas.toDataURL("image/png");
  };

  return (
    <div className="w-full max-w-[540px] sm:max-w-[600px] lg:max-w-[780px] overflow-x-auto my-6 sm:my-8 lg:my-10 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
      <div className="flex gap-2 sm:gap-3 lg:gap-4 w-max">
        {speakers.map((speaker) => (
          <a
            key={speaker.speakerId}
            href="#"
            className="group relative block bg-black w-[140px] sm:w-[160px] lg:w-[180px] h-[200px] sm:h-[240px] lg:h-[260px] flex-shrink-0 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
            aria-label={`Xem chi tiết diễn giả ${speaker.speakerName}`}
          >
            <img
              alt={speaker.speakerName}
              src={speaker.speakerImage || getDefaultSpeakerImage()}
              onError={(e) => {
                e.target.src = getDefaultSpeakerImage();
              }}
              className="absolute inset-0 h-full w-full object-cover opacity-75 transition-opacity group-hover:opacity-50"
            />
            <div className="relative p-2 sm:p-3 lg:p-4">
              <p className="text-[8px] sm:text-[9px] lg:text-[10px] font-medium uppercase tracking-widest text-pink-400">
                {speaker.speakerTitle}
              </p>
              <p className="text-sm sm:text-base lg:text-lg font-bold text-white truncate drop-shadow-md">
                {speaker.speakerName}
              </p>
              <div className="mt-12 sm:mt-20 lg:mt-24">
                <div className="translate-y-4 transform opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">
                  <p className="text-[10px] sm:text-[11px] lg:text-xs text-gray-200 line-clamp-3" title={speaker.speakerDesc}>
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
import { useState } from "react";
import Header from "../../components/Header";
import RelatedEvents from "../../components/RelatedEvents";
import "./Detail.css";
import SliderSpeaker from "../../components/SilderSpeaker";
import Footer from "../../components/Footer";

const EventDetail = ({ event }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleTickets = () => setExpanded(!expanded);
  const imageUrl =
    "https://cdn.evbstatic.com/s3-build/fe/build/images/389ece7b7e2dc7ff8d28524bad30d52c-dsrp_desktop.webp";
  return (
    <>
      <Header />

      <div className="relative w-[1200px] h-[500px] mx-auto mt-6 rounded-lg overflow-hidden shadow-lg">
        {/* Background Blur */}
        <div
          className="absolute inset-0 bg-cover bg-center blur-lg scale-110"
          style={{ backgroundImage: `url(${imageUrl})` }}
        ></div>

        {/* */}
        <img
          src={imageUrl}
          alt="Banner"
          className="absolute inset-0 m-auto w-auto h-auto max-w-full max-h-full object-contain"
        />
      </div>
      <div className="px-8 pt-8">
        {/* Event Details */}
        <div className="rounded-lg px-8 pt-4">
          <div className="text-gray-500 mb-2">
            {new Date(event.event_start).toDateString()}
          </div>
          <h1 className="text-3xl font-bold text-blue-900 mb-4">
            {event.event_name}
          </h1>

          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              Date and Time
            </h2>
            <div className="text-gray-700 ml-8">
              <i className="bi bi-calendar-event pr-[10px]"></i>{" "}
              {event.event_start} - {event.event_end}
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-2">Location</h2>
            <div className="ml-8 text-gray-700">
              {" "}
              <i className="bi bi-geo-alt pr-[10px]"></i> {event.event_location}
            </div>
          </div>
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              DescriptionDescription
            </h2>
            <div className="ml-8 text-gray-700 text-justify">
              {event.event_desc}
            </div>
          </div>
          {/* Ticket Information Section */}
          <h2 className="text-xl font-bold mb-8">Thông tin vé</h2>
          <div className="bg-gray-800 text-white rounded-lg shadow-lg w-full ">
            <div className="p-4 border-b border-gray-700 flex justify-between items-center">
              <h2 className="text-lg font-semibold">Thông tin vé</h2>
              <button className="bg-green-500 text-white px-4 py-2 rounded-lg">
                Mua vé ngay
              </button>
            </div>
            <div className="p-4 border-b border-gray-700 flex justify-between items-center">
              <span>20:00 - 22:30, 07 Tháng 03, 2025</span>
              <i className="fas fa-chevron-down"></i>
            </div>
            <div className="p-4 border-b border-gray-700 flex justify-between items-center">
              <span>VIP STANDING</span>
              <span className="text-green-500">5.500.000 đ</span>
            </div>
            <div className="p-4 border-b border-gray-700 flex justify-between items-center">
              <span>CAT 1</span>
              <span className="text-green-500">4.500.000 đ</span>
            </div>
            <div className="p-4 border-b border-gray-700 flex justify-between items-center">
              <span>GEN STANDING</span>
              <span className="text-green-500">3.500.000 đ</span>
            </div>
            <div className="p-4 border-b border-gray-700 flex justify-between items-center">
              <span>CAT 2</span>
              <span className="text-green-500">2.500.000 đ</span>
            </div>
            <div className="p-4 flex justify-between items-center">
              <span>ZONE B STANDING</span>
              <span className="text-green-500">2.000.000 đ</span>
            </div>
          </div>

          <div className="relative max-w-[300px] max-h-[320px] bg-gradient-to-b from-[#c3e6ec] to-[#a7d1d9] rounded-lg p-8 m-3 overflow-hidden font-sans transition-all duration-500 group">
            <p className="text-[#262626] text-xl font-bold mb-2 transition-all duration-500 group-hover:text-white relative z-10">
              Product Name
            </p>
            <p className="text-[#452c2c] text-base font-normal leading-6 transition-all duration-500 group-hover:text-white relative z-10">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quaerat
              veritatis nobis saepe itaque rerum nostrum aliquid obcaecati odio
              officia deleniti.
            </p>
            <div className="absolute w-8 h-8 flex items-center justify-center top-0 right-0 bg-gradient-to-br from-[#6293c8] to-[#384c6c] rounded-tr-lg rounded-bl-[32px] z-10">
              <div className="text-white font-mono">→</div>
            </div>
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-br from-[#364a60] to-[#384c6c] rounded-full transition-transform duration-500 group-hover:scale-[28] z-0"></div>
          </div>
          <h2 className="text-xl font-bold mb-8">Speaker</h2>
          <SliderSpeaker />
          <h2 className="text-xl font-bold mb-8">Schedule</h2>
          <div className="bg-white rounded-lg w-2/3 lg:w-1/2 xl:w-full p-4 shadow my-[20px]">
            <div>
              <span className="text-gray-900 relative inline-block date uppercase font-medium tracking-widest">
                Wednesday 8
              </span>
              <div className="flex mb-2">
                <div className="w-2/12">
                  <span className="text-sm text-gray-600 block">8:00a</span>
                  <span className="text-sm text-gray-600 block">8:15a</span>
                </div>
                <div className="w-1/12">
                  <span className="bg-blue-400 h-2 w-2 rounded-full block mt-2"></span>
                </div>
                <div className="w-9/12">
                  <span className="text-sm font-semibold block">
                    Morning Standup
                  </span>
                  <span className="text-sm">Zoom ID: 1134 11 1134</span>
                </div>
              </div>
              <div className="flex mb-4">
                <div className="w-2/12">
                  <span className="text-sm text-gray-600 block">10:00a</span>
                  <span className="text-sm text-gray-600 block">2:00p</span>
                </div>
                <div className="w-1/12">
                  <span className="bg-red-400 h-2 w-2 rounded-full block mt-2"></span>
                </div>
                <div className="w-9/12">
                  <span className="text-sm font-semibold block">
                    Core Development
                  </span>
                  <span className="text-sm">Joey, Matt, CJ and Vlad</span>
                </div>
              </div>
              <div className="flex mb-4">
                <div className="w-2/12">
                  <span className="text-sm text-gray-600 block">3:00p</span>
                  <span className="text-sm text-gray-600 block">3:30p</span>
                </div>
                <div className="w-1/12">
                  <span className="bg-indigo-600 h-2 w-2 rounded-full block mt-2"></span>
                </div>
                <div className="w-9/12">
                  <span className="text-sm font-semibold block">
                    Interview with Ed Harris
                  </span>
                </div>
              </div>
            </div>
            <div>
              <span className="text-gray-900 relative inline-block date uppercase font-medium tracking-widest">
                Thursday 9
              </span>
              <div className="flex mb-2">
                <div className="w-2/12">
                  <span className="text-sm text-gray-600 block">8:00a</span>
                  <span className="text-sm text-gray-600 block">8:15a</span>
                </div>
                <div className="w-1/12">
                  <span className="bg-blue-400 h-2 w-2 rounded-full block mt-2"></span>
                </div>
                <div className="w-9/12">
                  <span className="text-sm font-semibold block">
                    Morning Standup
                  </span>
                  <span className="text-sm">Zoom ID: 1134 11 1134</span>
                </div>
              </div>
              <div className="flex mb-4">
                <div className="w-2/12">
                  <span className="text-sm text-gray-600 block">6:00p</span>
                  <span className="text-sm text-gray-600 block">7:30p</span>
                </div>
                <div className="w-1/12">
                  <span className="bg-yellow-400 h-2 w-2 rounded-full block mt-2"></span>
                </div>
                <div className="w-9/12">
                  <span className="text-sm font-semibold block">
                    Dinner with Mom
                  </span>
                </div>
              </div>
            </div>
          </div>
          
<section class="relative flex flex-col justify-center bg-slate-50 overflow-hidden">
    <div class="w-full max-w-6xl mx-auto px-4 md:px-6 py-24">
        <div class="flex flex-col justify-center divide-y divide-slate-200 [&>*]:py-16">

            <div class="w-full max-w-3xl mx-auto">
            
               
                <div class="-my-6">

                   
                    <div class="relative pl-8 sm:pl-32 py-6 group">
                        
                        <div class="font-medium text-indigo-500 mb-1 sm:mb-0">The origin</div>
                        
                        <div class="flex flex-col sm:flex-row items-start mb-1 group-last:before:hidden before:absolute before:left-2 sm:before:left-0 before:h-full before:px-px before:bg-slate-300 sm:before:ml-[6.5rem] before:self-start before:-translate-x-1/2 before:translate-y-3 after:absolute after:left-2 sm:after:left-0 after:w-2 after:h-2 after:bg-indigo-600 after:border-4 after:box-content after:border-slate-50 after:rounded-full sm:after:ml-[6.5rem] after:-translate-x-1/2 after:translate-y-1.5">
                            <time class="sm:absolute left-0 translate-y-0.5 inline-flex items-center justify-center text-xs font-semibold uppercase w-20 h-6 mb-3 sm:mb-0 text-emerald-600 bg-emerald-100 rounded-full">May, 2020</time>
                            <div class="text-xl font-bold text-slate-900">Acme was founded in Milan, Italy</div>
                        </div>
                      
                        <div class="text-slate-500">Pretium lectus quam id leo. Urna et pharetra pharetra massa massa. Adipiscing enim eu neque aliquam vestibulum morbi blandit cursus risus.</div>
                    </div>
                    
                  
                    <div class="relative pl-8 sm:pl-32 py-6 group">
                       
                        <div class="font-medium text-indigo-500 mb-1 sm:mb-0">The milestone</div>
                       
                        <div class="flex flex-col sm:flex-row items-start mb-1 group-last:before:hidden before:absolute before:left-2 sm:before:left-0 before:h-full before:px-px before:bg-slate-300 sm:before:ml-[6.5rem] before:self-start before:-translate-x-1/2 before:translate-y-3 after:absolute after:left-2 sm:after:left-0 after:w-2 after:h-2 after:bg-indigo-600 after:border-4 after:box-content after:border-slate-50 after:rounded-full sm:after:ml-[6.5rem] after:-translate-x-1/2 after:translate-y-1.5">
                            <time class="sm:absolute left-0 translate-y-0.5 inline-flex items-center justify-center text-xs font-semibold uppercase w-20 h-6 mb-3 sm:mb-0 text-emerald-600 bg-emerald-100 rounded-full">May, 2021</time>
                            <div class="text-xl font-bold text-slate-900">Reached 5K customers</div>
                        </div>
                      
                        <div class="text-slate-500">Pretium lectus quam id leo. Urna et pharetra pharetra massa massa. Adipiscing enim eu neque aliquam vestibulum morbi blandit cursus risus.</div>
                    </div>
                    
                    
                    <div class="relative pl-8 sm:pl-32 py-6 group">
                        
                        <div class="font-medium text-indigo-500 mb-1 sm:mb-0">The acquisitions</div>
                        
                        <div class="flex flex-col sm:flex-row items-start mb-1 group-last:before:hidden before:absolute before:left-2 sm:before:left-0 before:h-full before:px-px before:bg-slate-300 sm:before:ml-[6.5rem] before:self-start before:-translate-x-1/2 before:translate-y-3 after:absolute after:left-2 sm:after:left-0 after:w-2 after:h-2 after:bg-indigo-600 after:border-4 after:box-content after:border-slate-50 after:rounded-full sm:after:ml-[6.5rem] after:-translate-x-1/2 after:translate-y-1.5">
                            <time class="sm:absolute left-0 translate-y-0.5 inline-flex items-center justify-center text-xs font-semibold uppercase w-20 h-6 mb-3 sm:mb-0 text-emerald-600 bg-emerald-100 rounded-full">May, 2022</time>
                            <div class="text-xl font-bold text-slate-900">Acquired various companies, inluding Technology Inc.</div>
                        </div>
                       
                        <div class="text-slate-500">Pretium lectus quam id leo. Urna et pharetra pharetra massa massa. Adipiscing enim eu neque aliquam vestibulum morbi blandit cursus risus.</div>
                    </div>
                    
                    
                    <div class="relative pl-8 sm:pl-32 py-6 group">
                       
                        <div class="font-medium text-indigo-500 mb-1 sm:mb-0">The IPO</div>
                     
                        <div class="flex flex-col sm:flex-row items-start mb-1 group-last:before:hidden before:absolute before:left-2 sm:before:left-0 before:h-full before:px-px before:bg-slate-300 sm:before:ml-[6.5rem] before:self-start before:-translate-x-1/2 before:translate-y-3 after:absolute after:left-2 sm:after:left-0 after:w-2 after:h-2 after:bg-indigo-600 after:border-4 after:box-content after:border-slate-50 after:rounded-full sm:after:ml-[6.5rem] after:-translate-x-1/2 after:translate-y-1.5">
                            <time class="sm:absolute left-0 translate-y-0.5 inline-flex items-center justify-center text-xs font-semibold uppercase w-20 h-6 mb-3 sm:mb-0 text-emerald-600 bg-emerald-100 rounded-full">May, 2023</time>
                            <div class="text-xl font-bold text-slate-900">Acme went public at the New York Stock Exchange</div>
                        </div>
                       
                        <div class="text-slate-500">Pretium lectus quam id leo. Urna et pharetra pharetra massa massa. Adipiscing enim eu neque aliquam vestibulum morbi blandit cursus risus.</div>
                    </div>

                </div>
               
                
            </div>

        </div>
    </div>
</section>
        </div>
      </div>
      <RelatedEvents />
      <Footer />
    </>
  );
};

export default EventDetail;

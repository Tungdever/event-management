import { useEffect, useState } from "react";

export default function MyBooking() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Giả lập data, sau này bạn fetch API thay thế
    const fetchedOrders = [
      {
        id: 1,
        customerName: "Nguyễn Văn A",
        totalAmount: 500000,
        tickets: [
          { ticketType: "Vé VIP", quantity: 2 },
          { ticketType: "Vé Thường", quantity: 1 }
        ]
      },
      {
        id: 2,
        customerName: "Trần Thị B",
        totalAmount: 300000,
        tickets: [
          { ticketType: "Vé Thường", quantity: 3 }
        ]
      }
    ];
    setOrders(fetchedOrders);
  }, []);

  return (
    <div class="py-14 px-4 md:px-6 2xl:px-20 2xl:container 2xl:mx-auto bg-[#F3F4F6]">
      <div class="flex justify-start item-start space-y-2 flex-col">
        <h1 class="text-3xl lg:text-4xl font-semibold leading-7 lg:leading-9 text-gray-800">#13432</h1>
        <p class="text-base font-medium leading-6 text-gray-600">21st March 2021 at 10:34 PM</p>
      </div>

      <div class="mt-10 flex flex-col xl:flex-row justify-center items-stretch w-full xl:space-x-8 space-y-4 md:space-y-6 xl:space-y-0">
        <div class="flex flex-col justify-start items-start w-full space-y-4 md:space-y-6 xl:space-y-8">

          <div class="flex flex-col justify-start items-start bg-gray-50 px-4 py-4 md:py-6 md:p-6 xl:p-8 w-full">
            <p class="text-lg md:text-xl font-semibold leading-6 xl:leading-5 text-gray-800">Tickets detail</p>


            <div class="mt-4 md:mt-6 flex flex-col md:flex-row justify-start items-start md:items-center md:space-x-6 xl:space-x-8 w-full">
              <div class="pb-4 md:pb-8 w-full md:w-40">
                <img class="w-full hidden md:block" src="https://i.ibb.co/84qQR4p/Rectangle-10.png" alt="dress" />
                <img class="w-full md:hidden" src="https://i.ibb.co/L039qbN/Rectangle-10.png" alt="dress" />
              </div>
              <div class="border-b border-gray-200 md:flex-row flex-col flex justify-between items-start w-full pb-8 space-y-4 md:space-y-0">
                <div class="w-full flex flex-col justify-start items-start space-y-8">
                  <h3 class="text-xl xl:text-2xl font-semibold leading-6 text-gray-800">Premium Quality Dress</h3>
                  <div class="flex justify-start items-start flex-col space-y-2">
                    <p class="text-sm leading-none text-gray-800"><span class="text-gray-300">Style: </span> Italic Minimal Design</p>
                    <p class="text-sm leading-none text-gray-800"><span class="text-gray-300">Size: </span> Small</p>
                    <p class="text-sm leading-none text-gray-800"><span class="text-gray-300">Color: </span> Light Blue</p>
                  </div>
                </div>
                <div class="flex justify-between space-x-8 items-start w-full">
                  <p class="text-base xl:text-lg leading-6">$36.00 <span class="text-red-300 line-through"> $45.00</span></p>
                  <p class="text-base xl:text-lg leading-6 text-gray-800">01</p>
                  <p class="text-base xl:text-lg font-semibold leading-6 text-gray-800">$36.00</p>
                </div>
              </div>
            </div>


            <div class="mt-6 md:mt-0 flex justify-start flex-col md:flex-row items-start md:items-center space-y-4 md:space-x-6 xl:space-x-8 w-full">
              <div class="w-full md:w-40">
                <img class="w-full hidden md:block" src="https://i.ibb.co/s6snNx0/Rectangle-17.png" alt="dress" />
                <img class="w-full md:hidden" src="https://i.ibb.co/BwYWJbJ/Rectangle-10.png" alt="dress" />
              </div>
              <div class="flex justify-between items-start w-full flex-col md:flex-row space-y-4 md:space-y-0">
                <div class="w-full flex flex-col justify-start items-start space-y-8">
                  <h3 class="text-xl  xl:text-2xl font-semibold leading-6 text-gray-800">High Quality Italic Dress</h3>
                  <div class="flex justify-start items-start flex-col space-y-2">
                    <p class="text-sm leading-none text-gray-800"><span class="text-gray-300">Style: </span> Italic Minimal Design</p>
                    <p class="text-sm leading-none text-gray-800"><span class="text-gray-300">Size: </span> Small</p>
                    <p class="text-sm leading-none text-gray-800"><span class="text-gray-300">Color: </span> Light Blue</p>
                  </div>
                </div>
                <div class="flex justify-between space-x-8 items-start w-full">
                  <p class="text-base xl:text-lg leading-6">$20.00 <span class="text-red-300 line-through"> $30.00</span></p>
                  <p class="text-base xl:text-lg leading-6 text-gray-800">01</p>
                  <p class="text-base xl:text-lg font-semibold leading-6 text-gray-800">$20.00</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 w-full xl:w-96 flex justify-between items-center md:items-start px-4 py-6 md:p-6 xl:p-8 flex-col">
          <div class="flex flex-col w-full bg-gray-50 space-y-6">
            <h3 class="text-xl font-semibold leading-5 text-gray-800">Summary</h3>
            <div class="flex justify-center items-center w-full space-y-4 flex-col border-gray-200 border-b pb-4">
              <div class="flex justify-between w-full">
                <p class="text-base leading-4 text-gray-800">Subtotal</p>
                <p class="text-base leading-4 text-gray-600">$56.00</p>
              </div>
              <div class="flex justify-between items-center w-full">
                <p class="text-base leading-4 text-gray-800">Discount <span class="bg-gray-200 p-1 text-xs font-medium leading-3 text-gray-800">STUDENT</span></p>
                <p class="text-base leading-4 text-gray-600">-$28.00 (50%)</p>
              </div>
              <div class="flex justify-between items-center w-full">
                <p class="text-base leading-4 text-gray-800">Shipping</p>
                <p class="text-base leading-4 text-gray-600">$8.00</p>
              </div>
            </div>
            <div class="flex justify-between items-center w-full">
              <p class="text-base font-semibold leading-4 text-gray-800">Total</p>
              <p class="text-base font-semibold leading-4 text-gray-600">$36.00</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

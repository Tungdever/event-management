const MainLayout = () => {

    // Các trang full screen với Header
    const isFullScreenPageWithHeader = [
      "/",
      "/search",
      "/checkout",
      "/myticket",
      "/refund",
      "/eventpage",
      "/createEvent",
      "/all-event",
      "/event-search-by"
    ].includes(location.pathname) || location.pathname.startsWith("/event/");


    return (
      <div className="w-full min-h-screen bg-white">
     
  
        {/* 2. Full Screen Pages with Header */}
        {isFullScreenPageWithHeader && (
          <>
            <Header />
            <div className="pt-16">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/event/:eventId" element={<EventDetail />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/myticket" element={<TicketList tickets={ticketData} />} />
                <Route path="/refund" element={<Refund />} />
                <Route path="/eventpage" element={<EventPage />} />
                <Route path="/createEvent" element={<CRUDEvent />} />
                <Route path="/all-event" element={<EventGrid events={eventsList} onEventClick={handleEventClick} />}/>
                <Route path="/event-search-by/:categoryName" element={<SearchByType  />}/>
              </Routes>
            </div>
          </>
        )}
  
     
  

      </div>
    );
  };
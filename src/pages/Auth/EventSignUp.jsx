import React, { useState, useEffect } from "react";

const ErrorBoundary = ({ children }) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const errorHandler = (error) => {
      console.error("ErrorBoundary caught:", error);
      setHasError(true);
    };
    window.addEventListener("error", errorHandler);
    return () => window.removeEventListener("error", errorHandler);
  }, []);

  if (hasError) {
    return (
      <div className="text-center text-red-500 p-8">
        <h2>Đã xảy ra lỗi.</h2>
        <p>Vui lòng làm mới trang hoặc thử lại sau.</p>
      </div>
    );
  }

  return children;
};

const EventSignUp = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [nextStepToShow, setNextStepToShow] = useState(null);
  const [isExiting, setIsExiting] = useState(false);
  const [transitionKey, setTransitionKey] = useState(0);
  const [direction, setDirection] = useState("forward");
  const [email, setEmail] = useState("");
  const [userData, setUserData] = useState({});
  const [role, setRole] = useState("");
  const [verificationCode, setVerificationCode] = useState('');
  
  useEffect(() => {
    if (isExiting && nextStepToShow !== null) {
      const timer = setTimeout(() => {
        setIsExiting(false);
        setCurrentStep(nextStepToShow);
        setTransitionKey((prev) => prev + 1);
        setNextStepToShow(null);
      }, 400); 
      return () => clearTimeout(timer);
    }
  }, [isExiting, nextStepToShow]);

  const nextStep = () => {
    setDirection("forward");
    setIsExiting(true);
    setNextStepToShow(currentStep + 1);
  };

  const prevStep = () => {
    setDirection("backward");
    setIsExiting(true);
    setNextStepToShow(currentStep - 1);
  };

  const totalSteps = 5;

  // Thanh tiến trình
  const ProgressBar = ({ currentStep }) => {
    const progress = (currentStep / totalSteps) * 100;

    return (
      <div className="w-[450px] max-w-[500px] mx-auto mb-4">
        <div className="bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-gradient-to-r from-orange-500 to-red-600 h-2.5 rounded-full transition-all duration-500 ease-in-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-center text-sm text-gray-600 mt-2">
          Step {currentStep} / {totalSteps}
        </p>
      </div>
    );
  };

  // Icon quay lại
  const BackIcon = ({ onClick }) => (
    <span
      onClick={onClick}
      className="cursor-pointer mr-2 hover:scale-110 transition-transform duration-200"
      aria-label="Quay lại"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 inline"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 19l-7-7 7-7"
        />
      </svg>
    </span>
  );
  const registerUser = async (formData, role) => {
    const payload = {
      name: formData.fullName,
      email: formData.email,
      password: formData.password,
      birthday: formData.birthday,
      gender: formData.gender,
      address: formData.address,
      isOrganize: role === 'organizer' ? true : false,
      organizer: role === 'organizer' ? {
        organizerName: formData.organizerName,
        organizerAddress: formData.address,
        organizerWebsite: formData.organizerWebsite,
        organizerPhone: formData.organizerPhone
      } : {}
    };
  
    try {
      const response = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  };
  // Bước nhập Email
  const EmailStep = ({ onNext, setEmail }) => {
    const [inputEmail, setInputEmail] = useState(email);

    const handleSubmit = async (e) => {
      e.preventDefault();
      

      try {
        const response = await fetch(`http://localhost:8080/api/auth/send-verification-code/${inputEmail}`, {
          method: 'POST',
         
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.code || 'Không thể gửi mã xác minh');
        }

        const data = await response.text();
        setVerificationCode(data);
        setEmail(inputEmail);
        alert(`Mã xác minh đã được gửi tới ${inputEmail}`);
        onNext();
      } catch (error) {
       
      }
    };

    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md mx-auto p-6">
          <ProgressBar currentStep={1} />
          <div className="bg-white rounded-[6px] shadow-2xl overflow-hidden h-[400px] w-[450px]">
            <h1 className="text-xl font-bold text-orange-500  mt-2 px-6 py-2 hover:cursor-pointer">
              Management Event
            </h1>
            <div className="to-red-400 p-6 mb-4">
              <h2 className="text-3xl font-bold">Welcome!</h2>
              <h2 className="text-3xl font-bold">What's your email?</h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-10">
              <input
                type="email"
                value={inputEmail}
                onChange={(e) => setInputEmail(e.target.value)}
                placeholder="Email"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                required
                aria-label="Email"
              />
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-orange-400 to-red-400 text-white p-3 rounded-[6px] hover:scale-105 transition-transform duration-200"
              >
                Continue
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  };

  // Bước xác minh
  const VerificationStep = ({ email, onNext, onPrev }) => {
    const [code, setCode] = useState("");

    const handleSubmit = (e) => {
      e.preventDefault();
  
      if (code.length !== 6) {
        alert('Vui lòng nhập mã 6 chữ số hợp lệ');
        return;
      }

      if (code === verificationCode) {
        onNext();
      } else {
        alert('Mã xác minh không đúng');
      }
    };

    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md mx-auto p-6">
          <ProgressBar currentStep={2} />
          <div className="bg-white rounded-[6px] shadow-2xl overflow-hidden w-[450px]">
            <h1 className="text-xl font-bold text-orange-500  mt-2 px-6 py-2 hover:cursor-pointer">
              Management Event
            </h1>
            <div className="px-6 pt-6 pb-4">
              <BackIcon onClick={onPrev} />
              <h2 className="text-3xl font-bold flex items-center mb-4">
                Check your email for a code
              </h2>
              <span className="text-[13px] text-gray-500">
                Check your inbox and enter the code we have sent you
              </span>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <input
                type="email"
                value={email}
                disabled
                className="w-full p-3 border rounded-lg bg-gray-100 text-gray-900"
                aria-label="Email"
              />
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter code"
                maxLength="6"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                required
                aria-label="Mã Xác Minh"
              />
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-orange-400 to-orange-400 text-white p-3 rounded-lg hover:scale-105 transition-transform duration-200"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  };

  // Bước nhập tên
  const NameStep = ({ onNext, onPrev, setUserData, email }) => {
    const [firstName, setFirstName] = useState(userData.firstName || "");
    const [lastName, setLastName] = useState(userData.lastName || "");

    const handleSubmit = (e) => {
      e.preventDefault();
      setUserData({ firstName, lastName });
      onNext();
    };

    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md mx-auto p-6">
          <ProgressBar currentStep={3} />
          <div className="bg-white rounded-[6px] shadow-2xl overflow-hidden w-[450px] h-[500px]">
            <h1 className="text-xl font-bold text-orange-500  mt-2 px-6 py-2 hover:cursor-pointer">
              Management Event
            </h1>
            <div className="px-6 pt-6 pb-8">
              <h2 className="text-3xl font-bold flex items-center">
                <BackIcon onClick={onPrev} />
                Let's create your account
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="px-10 py-6 space-y-6">
              <input
                type="email"
                value={email}
                disabled
                className="w-full p-3 border rounded-lg bg-gray-100 text-gray-900"
                aria-label="Email"
              />
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First Name"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                required
                aria-label="First Name"
              />
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last Name"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                required
                aria-label="Last Name"
              />
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-red-500 to-red-500 text-white p-3 rounded-lg hover:scale-105 transition-transform duration-200"
              >
                Continue
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  };

  // Bước chọn vai trò
  const RoleStep = ({ onNext, onPrev, setRole }) => {
    const handleRoleSelect = (selectedRole) => {
      setRole(selectedRole);
      onNext();
    };

    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-[800px] mx-auto p-6">
          <ProgressBar currentStep={4} />
          <div className="bg-white rounded-[6px] shadow-2xl overflow-hidden w-[800px]">
            <div className="flex items-center justify-center px-6 py-8">
              <BackIcon onClick={onPrev} />
              <h1 className="text-4xl font-bold flex items-center justify-center mb-4">
                Welcome to Management Event!
              </h1>
            </div>
            <div className="p-6 flex justify-center space-x-4">
              <section className="  flex flex-col md:flex-row justify-center gap-8 max-w-5xl mx-auto">
                <article className="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col items-center p-8 max-w-[320px] mx-auto">
                  <img
                    alt="Illustration of a person with pink hair wearing a dark purple polka dot shirt holding a red ticket"
                    className="w-40 h-40 rounded-full"
                    height="160"
                    loading="lazy"
                    src="https://storage.googleapis.com/a1aa/image/40388b28-ddb8-4b15-d644-2791fd8b4a57.jpg"
                    width="160"
                  />
                  <h2 className="mt-6 font-semibold text-xl text-[#1B0B3B]">
                    Find an experience
                  </h2>
                  <button
                    className="mt-6 px-6 py-2 border border-gray-400 rounded-md text-[#1B0B3B] text-sm font-normal hover:bg-gray-50 transition"
                    type="button"
                    onClick={() => handleRoleSelect("attendee")}
                  >
                    Tell us what you love
                  </button>
                </article>
                <article className="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col items-center p-8 max-w-[320px] mx-auto">
                  <img
                    alt="Illustration of a person with curly black hair wearing a gray polka dot jacket holding a calendar"
                    className="w-40 h-40 rounded-full"
                    height="160"
                    loading="lazy"
                    src="https://storage.googleapis.com/a1aa/image/215f5b3b-6dbd-4d88-670b-c144d5cf1f7e.jpg"
                    width="160"
                  />
                  <h2 className="mt-6 font-semibold text-xl text-[#1B0B3B]">
                    Organize an event
                  </h2>
                  <button
                    className="mt-6 px-6 py-2 border border-gray-400 rounded-md text-[#1B0B3B] text-sm font-normal hover:bg-gray-50 transition"
                    type="button"
                    onClick={() => handleRoleSelect("organizer")}
                  >
                    Plan your best event ever
                  </button>
                </article>
              </section>
            </div>
            <div className="p-6 flex justify-center space-x-4">
              {/* <button
                onClick={() => handleRoleSelect('attendee')}
                className="bg-blue-500 text-white p-4 rounded-lg hover:scale-105 transition-transform duration-200"
              >
                Người Tham Gia
              </button>
              <button
                onClick={() => handleRoleSelect('organizer')}
                className="bg-blue-500 text-white p-4 rounded-lg hover:scale-105 transition-transform duration-200"
              >
                Nhà Tổ Chức
              </button> */}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Form đăng ký người tham gia
  const AttendeeForm = ({ email, userData, onComplete, onPrev }) => {
    const [formData, setFormData] = useState({
      fullName: `${userData.firstName} ${userData.lastName}`,
      email: email,
      password: '',
      gender: '',
      birthday: '',
      address: '',
    });
    const [openSection, setOpenSection] = useState('personal');

    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
    const newErrors = {};
    if (!formData.password) newErrors.password = 'Vui lòng điền mật khẩu';
    if (!formData.gender) newErrors.gender = 'Vui lòng chọn giới tính';
    if (!formData.birthday) newErrors.birthday = 'Vui lòng điền ngày sinh';
    if (!formData.address) newErrors.address = 'Vui lòng điền địa chỉ';

    if (Object.keys(newErrors).length > 0) {
 
      return;
    }

    try {
      await registerUser(formData, 'attendee');
      alert('Đăng ký thành công!');
      onComplete();
    } catch (error) {
      alert('Đăng ký thất bại. Vui lòng thử lại.');
    }
    };

    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-[800px] mx-auto p-6">
          <ProgressBar currentStep={5} />
          <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col w-[800px]">
            <div className=" p-6  rounded-t">
              <h2 className="text-2xl font-bold flex items-center">
                <BackIcon onClick={onPrev} />
                
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
            <div className="mt-4 animate-slide-down">
                    <div className="-mx-3 md:flex mb-4">
                      <div className="md:w-1/2 px-3 md:mb-0">
                        <label
                          className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                          htmlFor="full-name"
                        >
                          Họ Tên
                        </label>
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          disabled
                          className="appearance-none block w-full text-gray-700 border border-gray-400 rounded py-3 px-4 mb-3"
                          id="full-name"
                          aria-label="Họ Tên"
                        />
                      </div>
                      <div className="md:w-1/2 px-3">
                        <label
                          className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                          htmlFor="email"
                        >
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          disabled
                          className="appearance-none block w-full text-gray-700 border border-gray-400 rounded py-3 px-4"
                          id="email"
                          aria-label="Email"
                        />
                      </div>
                    </div>
                    <div className="-mx-3 md:flex mb-4">
                      <div className="md:w-full px-3">
                        <label
                          className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                          htmlFor="password"
                        >
                          Mật Khẩu
                        </label>
                        <input
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="******************"
                          className="appearance-none block w-full text-gray-700 border border-gray-400 rounded py-3 px-4 mb-3"
                          id="password"
                          required
                          aria-label="Mật Khẩu"
                        />
                       
                      </div>
                    </div>
                    <div className="-mx-3 md:flex mb-4">
                      <div className="md:w-1/2 px-3 mb-6 md:mb-0">
                        <label
                          className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                          htmlFor="gender"
                        >
                          Giới Tính
                        </label>
                        <div className="relative">
                          <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            className="block appearance-none w-full border border-gray-400 text-gray-700 py-3 px-4 pr-8 rounded"
                            id="gender"
                            required
                            aria-label="Giới Tính"
                          >
                            <option value="">Chọn Giới Tính</option>
                            <option value="male">Nam</option>
                            <option value="female">Nữ</option>
                            <option value="other">Khác</option>
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg
                              className="h-4 w-4"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                            </svg>
                          </div>
                        </div>
                      </div>
                      <div className="md:w-1/2 px-3">
                        <label
                          className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                          htmlFor="birthday"
                        >
                          Ngày Sinh
                        </label>
                        <input
                          type="date"
                          name="birthday"
                          value={formData.birthday}
                          onChange={handleChange}
                          className="appearance-none block w-full  text-gray-700 border border-gray-400 rounded py-3 px-4"
                          id="birthday"
                          required
                          aria-label="Ngày Sinh"
                        />
                      </div>
                    </div>
                    <div className="-mx-3 md:flex mb-4">
                      <div className="md:w-full px-3">
                        <label
                          className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                          htmlFor="address"
                        >
                          Địa Chỉ
                        </label>
                        <input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          placeholder="Địa Chỉ"
                          className="appearance-none block w-full  text-gray-700 border border-gray-400 rounded py-3 px-4 mb-3"
                          id="address"
                          required
                          aria-label="Địa Chỉ"
                        />
                       
                      </div>
                    </div>
                  </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-red-500 to-red-500 text-white p-3 rounded-lg hover:scale-105 transition-transform duration-200"
              >
                Hoàn Tất Đăng Ký
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  };

  // Form đăng ký nhà tổ chức
  const OrganizerForm = ({ email, userData, onComplete, onPrev }) => {
    const [formData, setFormData] = useState({
      organizerName: '',
      organizerAddress: '',
      organizerWebsite: '',
      organizerPhone: '',
      fullName: `${userData.firstName} ${userData.lastName}`,
      email: email,
      password: '',
      gender: '',
      birthday: '',
      address: '',
    });
    const [openSection, setOpenSection] = useState('personal');

    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      const newErrors = {};
      if (!formData.password) newErrors.password = 'Vui lòng điền mật khẩu';
      if (!formData.gender) newErrors.gender = 'Vui lòng chọn giới tính';
      if (!formData.birthday) newErrors.birthday = 'Vui lòng điền ngày sinh';
      if (!formData.address) newErrors.address = 'Vui lòng điền địa chỉ';
      if (!formData.organizerName) newErrors.organizerName = 'Vui lòng điền tên nhà tổ chức';
      if (!formData.organizerWebsite) newErrors.organizerWebsite = 'Vui lòng điền website';
      if (!formData.organizerPhone) newErrors.organizerPhone = 'Vui lòng điền số điện thoại';

      if (Object.keys(newErrors).length > 0) {
        
        return;
      }

      try {
        await registerUser(formData, 'organizer');
        alert('Đăng ký thành công!');
        onComplete();
      } catch (error) {
        alert('Đăng ký thất bại. Vui lòng thử lại.');
      }
    };

    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-[800px] mx-auto p-6">
          <ProgressBar currentStep={5} />
          <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col w-[800px]">
            <div className=" p-6  rounded-t">
              <h2 className="text-2xl font-bold flex items-center">
                <BackIcon onClick={onPrev} />
                
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <button
                  type="button"
                  onClick={() => setOpenSection(openSection === 'personal' ? '' : 'personal')}
                  className="w-full text-left font-semibold text-gray-700 flex justify-between items-center hover:bg-gray-100 p-2 rounded transition-colors duration-200"
                >
                  Thông Tin Cá Nhân
                  <svg
                    className={`w-5 h-5 transform ${openSection === 'personal' ? 'rotate-180' : ''} transition-transform duration-200`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openSection === 'personal' && (
                  <div className="mt-4 animate-slide-down">
                    <div className="-mx-3 md:flex mb-6">
                      <div className="md:w-1/2 px-3 mb-6 md:mb-0">
                        <label
                          className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                          htmlFor="full-name"
                        >
                          Họ Tên
                        </label>
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          disabled
                          className="appearance-none block w-full  text-gray-700 border border-gray-400 rounded py-3 px-4 mb-3"
                          id="full-name"
                          aria-label="Họ Tên"
                        />
                      </div>
                      <div className="md:w-1/2 px-3">
                        <label
                          className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                          htmlFor="email"
                        >
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          disabled
                          className="appearance-none block w-full  text-gray-700 border border-gray-400 rounded py-3 px-4 mb-3"
                          id="email"
                          aria-label="Email"
                        />
                      </div>
                    </div>
                    <div className="-mx-3 md:flex mb-6">
                      <div className="md:w-full px-3">
                        <label
                          className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                          htmlFor="password"
                        >
                          Mật Khẩu
                        </label>
                        <input
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="******************"
                          className="w-full text-gray-700 border border-gray-400 rounded py-3 px-4 mb-3"
                          id="password"
                          required
                          
                        />
                        <p className="text-gray-600 text-xs italic">
                          Hãy tạo mật khẩu dài và phức tạp theo ý thích
                        </p>
                      </div>
                    </div>
                    <div className="-mx-3 md:flex mb-6">
                      <div className="md:w-1/2 px-3 mb-6 md:mb-0">
                        <label
                          className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                          htmlFor="gender"
                        >
                          Giới Tính
                        </label>
                        <div className="relative">
                          <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            className="appearance-none w-full  border border-gray-400 text-gray-700 py-3 px-4 pr-8 rounded"
                            id="gender"
                            required
                            aria-label="Giới Tính"
                          >
                            <option value="">Chọn Giới Tính</option>
                            <option value="male">Nam</option>
                            <option value="female">Nữ</option>
                            <option value="other">Khác</option>
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg
                              className="h-4 w-4"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                            </svg>
                          </div>
                        </div>
                      </div>
                      <div className="md:w-1/2 px-3">
                        <label
                          className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                          htmlFor="birthday"
                        >
                          Ngày Sinh
                        </label>
                        <input
                          type="date"
                          name="birthday"
                          value={formData.birthday}
                          onChange={handleChange}
                          className="appearance-none block w-full text-gray-700 border border-gray-400 rounded py-3 px-4"
                          id="birthday"
                          required
                          aria-label="Ngày Sinh"
                        />
                      </div>
                    </div>
                    <div className="-mx-3 md:flex mb-6">
                      <div className="md:w-full px-3">
                        <label
                          className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                          htmlFor="address"
                        >
                          Địa Chỉ
                        </label>
                        <input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          placeholder="Địa Chỉ"
                          className="appearance-none block w-full  text-gray-700 border border-gray-400 rounded py-3 px-4 mb-3"
                          id="address"
                          required
                          aria-label="Địa Chỉ"
                        />
                       
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div>
                <button
                  type="button"
                  onClick={() => setOpenSection(openSection === 'organizer' ? '' : 'organizer')}
                  className="w-full text-left font-semibold text-gray-700 flex justify-between items-center hover:bg-gray-100 p-2 rounded transition-colors duration-200"
                >
                  Thông Tin Nhà Tổ Chức
                  <svg
                    className={`w-5 h-5 transform ${openSection === 'organizer' ? 'rotate-180' : ''} transition-transform duration-200`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openSection === 'organizer' && (
                  <div className="mt-4 animate-slide-down">
                    <div className="-mx-3 md:flex mb-6">
                      <div className="md:w-1/2 px-3 mb-6 md:mb-0">
                        <label
                          className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                          htmlFor="organizer-name"
                        >
                          Tên Nhà Tổ Chức
                        </label>
                        <input
                          type="text"
                          name="organizerName"
                          value={formData.organizerName}
                          onChange={handleChange}
                          placeholder="Tên Nhà Tổ Chức"
                          className="appearance-none block w-full  text-gray-700 border border-gray-400 rounded py-3 px-4 mb-3"
                          id="organizer-name"
                          required
                          aria-label="Tên Nhà Tổ Chức"
                        />
                       
                      </div>
                      <div className="md:w-1/2 px-3">
                        <label
                          className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                          htmlFor="organizer-logo"
                        >
                          URL Logo
                        </label>
                        <input
                          type="text"
                          name="organizerAddress"
                          value={formData.organizerAddress}
                          onChange={handleChange}
                          placeholder="URL Logo Nhà Tổ Chức"
                          className="appearance-none block w-full  text-gray-700 border border-gray-400 rounded py-3 px-4"
                          id="organizer-logo"
                          required
                          aria-label="URL Logo Nhà Tổ Chức"
                        />
                      </div>
                    </div>
                    <div className="-mx-3 md:flex mb-6">
                      <div className="md:w-1/2 px-3 mb-6 md:mb-0">
                        <label
                          className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                          htmlFor="organizer-website"
                        >
                          Website
                        </label>
                        <input
                          type="url"
                          name="organizerWebsite"
                          value={formData.organizerWebsite}
                          onChange={handleChange}
                          placeholder="Website Nhà Tổ Chức"
                          className="appearance-none block w-full  text-gray-700 border border-gray-400 rounded py-3 px-4 mb-3"
                          id="organizer-website"
                          required
                          aria-label="Website Nhà Tổ Chức"
                        />
                        
                      </div>
                      <div className="md:w-1/2 px-3">
                        <label
                          className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                          htmlFor="organizer-phone"
                        >
                          Số Điện Thoại
                        </label>
                        <input
                          type="tel"
                          name="organizerPhone"
                          value={formData.organizerPhone}
                          onChange={handleChange}
                          placeholder="Số Điện Thoại Nhà Tổ Chức"
                          className="appearance-none block w-full text-gray-700 border border-gray-400 rounded py-3 px-4"
                          id="organizer-phone"
                          required
                          aria-label="Số Điện Thoại Nhà Tổ Chức"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-red-500 to-red-500 text-white p-3 rounded-lg hover:scale-105 transition-transform duration-200"
              >
                Hoàn Tất Đăng Ký
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  };

  // Trang chủ
  const HomePage = () => (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">
          Chào Mừng Đến Với Nền Tảng Sự Kiện
        </h2>
        <p className="text-center text-gray-900">
          Tài khoản của bạn đã được tạo thành công!
        </p>
      </div>
    </div>
  );

  // Hiển thị bước phù hợp với hiệu ứng trượt
  const renderStep = () => {
    const animationClass = isExiting
      ? direction === "forward"
        ? "animate-slide-out-left"
        : "animate-slide-out-right"
      : direction === "forward"
      ? "animate-slide-in-right"
      : "animate-slide-in-left";
    return (
      <div
        key={transitionKey}
        className={`will-change-transform-opacity ${animationClass}`}
        aria-live="polite"
      >
        {(() => {
          const stepToRender = nextStepToShow || currentStep;
          switch (stepToRender) {
            case 1:
              return <EmailStep onNext={nextStep} setEmail={setEmail} />;
            case 2:
              return (
                <VerificationStep
                  email={email}
                  onNext={nextStep}
                  onPrev={prevStep}
                />
              );
            case 3:
              return (
                <NameStep
                  onNext={nextStep}
                  onPrev={prevStep}
                  setUserData={setUserData}
                  email={email}
                />
              );
            case 4:
              return (
                <RoleStep
                  onNext={nextStep}
                  onPrev={prevStep}
                  setRole={setRole}
                />
              );
            case 5:
              return role === "attendee" ? (
                <AttendeeForm
                  email={email}
                  userData={userData}
                  onComplete={nextStep}
                  onPrev={prevStep}
                />
              ) : (
                <OrganizerForm
                  email={email}
                  userData={userData}
                  onComplete={nextStep}
                  onPrev={prevStep}
                />
              );
            case 6:
              return <HomePage />;
            default:
              return null;
          }
        })()}
      </div>
    );
  };

  return <ErrorBoundary>{renderStep()}</ErrorBoundary>;
};

export default EventSignUp;

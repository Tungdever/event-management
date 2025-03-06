import React, { useState } from "react";

const EditContact = () => {
  const [formData, setFormData] = useState({
    name: "Darlee",
    lastName: "Robertson",
    jobTitle: "Facility Manager",
    companyName: "BrightWave Innovations",
    email: "darlee@example.com",
    phoneNumber: "(163) 2459 315",
    phoneNumber2: "(146) 1249 296",
    fax: "",
    dob: "2024-05-02",
    deals: "Collins",
    reviews: "Lowest",
    owner: "Hendry",
    industry: "Barry Cuda",
    currency: "Dollar",
    language: "English",
    source: "Social Media",
    tags: ["Collab", "Promotion", "Rated", "Davis"],
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
      <h1 className="text-2xl font-semibold mb-6">Edit Contact</h1>
      <div className="border-b border-gray-200 mb-6">
        <ul className="flex space-x-6">
          <li className="pb-2 border-b-2 border-orange-500 text-orange-500">Basic Information</li>
          <li className="pb-2">Address</li>
          <li className="pb-2">Social Profiles</li>
          <li className="pb-2">Access</li>
        </ul>
      </div>
      <div className="mb-6 flex items-center space-x-4">
        <img
          alt="Profile"
          className="w-16 h-16 rounded-full"
          src="https://storage.googleapis.com/a1aa/image/s3KWkwGAyz6j-EVopmtzojLXA2PlnAuVsOKFpp5LjIk.jpg"
        />
        <div>
          <p className="font-semibold">Upload Profile Image</p>
          <p className="text-sm text-gray-500">Image should be below 4 mb</p>
          <div className="mt-2 flex space-x-2">
            <button className="bg-orange-500 text-white px-4 py-2 rounded">Upload</button>
            <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded">Cancel</button>
          </div>
        </div>
      </div>
      <form className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.keys(formData).map((key) => (
            key !== "tags" && (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700">
                  {key.replace(/([A-Z])/g, " $1").trim()} *
                </label>
                {key === "companyName" || key === "deals" || key === "reviews" || key === "owner" || key === "industry" || key === "currency" || key === "language" || key === "source" ? (
                  <select
                    name={key}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    value={formData[key]}
                    onChange={handleChange}
                  >
                    <option>{formData[key]}</option>
                  </select>
                ) : (
                  <input
                    name={key}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    type={key === "dob" ? "date" : "text"}
                    value={formData[key]}
                    onChange={handleChange}
                  />
                )}
              </div>
            )
          ))}
        </div>
        <div className="col-span-1 md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Tags *</label>
          <div className="mt-1 flex flex-wrap items-center space-x-2">
            {formData.tags.map((tag, index) => (
              <span key={index} className="bg-gray-200 text-gray-700 px-2 py-1 rounded">
                {tag}
              </span>
            ))}
            <button className="bg-gray-200 text-gray-700 px-2 py-1 rounded">Add new</button>
          </div>
        </div>
        <div className="flex justify-end space-x-4">
          <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded" type="button">
            Cancel
          </button>
          <button className="bg-orange-500 text-white px-4 py-2 rounded" type="submit">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditContact;

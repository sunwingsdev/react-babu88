export default function BetsoftGamingApi() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-300 to-pink-300 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-md p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Games API Key
        </h2>
        <h3 className="text-xl font-semibold text-green-700 text-center mb-8">
          BetsoftGamingApi
        </h3>

        <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              API Key
            </label>
            <input
              type="text"
              placeholder="Enter API Key"
              className="w-full border rounded px-4 py-2"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Provider IP
            </label>
            <input
              type="text"
              placeholder="Enter Provider IP"
              className="w-full border rounded px-4 py-2"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              License Key
            </label>
            <input
              type="text"
              placeholder="Enter License Key"
              className="w-full border rounded px-4 py-2"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Game file
            </label>
            <input type="file" className="w-full border rounded px-4 py-2" />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Game Provider Key
            </label>
            <input
              type="text"
              placeholder="Enter Game Provider Key"
              className="w-full border rounded px-4 py-2"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Secret Pin
            </label>
            <input
              type="password"
              placeholder="Enter Secret Pin"
              className="w-full border rounded px-4 py-2"
            />
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded"
            >
              Save API
            </button>
          </div>
        </form>
      </div>

      <div className="mt-6 text-right">
        <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded">
          Add+
        </button>
      </div>
    </div>
  );
}

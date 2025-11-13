import { HiArrowSmallUp, HiArrowLongDown } from "react-icons/hi2";
import { PieChart } from "@mui/x-charts/PieChart";
import { useEffect, useState } from "react";
import { publicRequest } from "../requestMethod";

const Home = () => {
  const [usersCount, setUsersCount] = useState(0);
  const [deliveredCount, setDeliveredCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [rejectedCount, setRejectedCount] = useState(0);
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [usersRes, parcelsRes] = await Promise.all([
        publicRequest.get("users"),
        publicRequest.get("parcels"),
      ]);

      const users = usersRes.data || [];
      const parcels = parcelsRes.data || [];

      setUsersCount(Array.isArray(users) ? users.length : 0);

      const pending = parcels.filter((p) => p.status === 0).length;
      const delivered = parcels.filter((p) => p.status === 2).length;
      const rejected = parcels.filter(
        (p) => p.status === 3 || p.status === 4
      ).length;

      setPendingCount(pending);
      setDeliveredCount(delivered);
      setRejectedCount(rejected);

      // Recent users: take the last 3 by createdAt or _id order if available
      let recent = [];
      if (Array.isArray(users) && users.length > 0) {
        // try to sort by createdAt if present
        const sorted = users.slice().sort((a, b) => {
          if (a.createdAt && b.createdAt)
            return new Date(b.createdAt) - new Date(a.createdAt);
          if (a._id && b._id) return String(b._id).localeCompare(String(a._id));
          return 0;
        });
        recent = sorted
          .slice(0, 3)
          .map(
            (u) => u.fullname || u.fullName || u.email || u.username || "User"
          );
      }
      setRecentUsers(recent);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
      setError(err?.response?.data?.message || err.message || String(err));
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // auto-refresh every 60 seconds
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      {error && (
        <div className="bg-red-600 text-white p-2 rounded mb-4">
          Error loading dashboard: {error}
        </div>
      )}
      <div className="flex items-center">
        <div className="flex flex-col text-[#D9D9D9] h-[250px] w-[350px] shadow-lg m-[20px]">
          <div className="flex flex-col items-center justify-center mt-[10%]">
            <h1 className="text-[20px] font-semibold">Users</h1>
            <div className="flex items-center my-[10px]">
              <HiArrowSmallUp className="text-[28px] text-green-500" />
              <HiArrowLongDown className="text-[28px] text-red-500" />
            </div>
            <span className="mt-[20px] text-[18px]">
              {loading ? "..." : usersCount}
            </span>
          </div>
        </div>
        <div className="flex flex-col text-[#D9D9D9] h-[250px] w-[350px] shadow-lg m-[20px]">
          <div className="flex flex-col items-center justify-center mt-[10%]">
            <h1 className="text-[20px] font-semibold">Delivered Parcels</h1>
            <div className="flex items-center my-[10px]">
              <HiArrowSmallUp className="text-[28px] text-green-500" />
              <HiArrowLongDown className="text-[28px] text-red-500" />
            </div>
            <span className="mt-[20px] text-[18px]">
              {loading ? "..." : deliveredCount}
            </span>
          </div>
        </div>
        <div className="flex flex-col text-[#D9D9D9] h-[250px] w-[350px] shadow-lg m-[20px]">
          <div className="flex flex-col items-center justify-center mt-[10%]">
            <h1 className="text-[20px] font-semibold">Pending Parcels</h1>
            <div className="flex items-center my-[10px]">
              <HiArrowSmallUp className="text-[28px] text-green-500" />
              <HiArrowLongDown className="text-[28px] text-red-500" />
            </div>
            <span className="mt-[20px] text-[18px]">
              {loading ? "..." : pendingCount}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-evenly">
        <div className="h-[450px] w-[500px] text-[#fff]">
          <PieChart
            series={[
              {
                data: [
                  { id: 0, value: deliveredCount, label: "Delivered Parcels" },
                  { id: 1, value: pendingCount, label: "Pending Parcels" },
                  { id: 2, value: rejectedCount, label: "Rejected Parcels" },
                ],

                innerRadius: 40,
                outerRadius: 100,
                paddingAngle: 5,
                cornerRadius: 5,
                startAngle: -100,
                endAngle: 180,
                cx: 150,
                cy: 150,
              },
            ]}
          />
        </div>

        <div className="h-[350px] w-[300px] shadow-xl p-[20px]">
          <div className="flex items-center justify-between px-[20px]">
            <h2 className="text-[#fff]">Recent Users</h2>
            <div>
              <button
                onClick={() => {
                  setError(null);
                  fetchData();
                }}
                className="bg-[#1f2937] hover:bg-[#111827] text-[#fff] px-3 py-1 rounded text-sm"
              >
                Refresh
              </button>
            </div>
          </div>

          <ol className="flex font-semibold flex-col justify-end px-[20px] mt-[10px]  text-[#D9D9D9]">
            {recentUsers.length > 0 ? (
              recentUsers.map((u, idx) => (
                <li key={idx}>
                  {idx + 1}. {u}
                </li>
              ))
            ) : (
              <>
                <li>1. —</li>
                <li>2. —</li>
                <li>3. —</li>
              </>
            )}
          </ol>
        </div>
      </div>
    </div>
  );
};

export default Home;

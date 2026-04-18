import SSidebar from "./SuperAdminSideBar";
import '../../styles/admin/HomeAdmin.css';
import { useState } from "react";
import AdminNav from "./SuperAdminNav";
import { Button } from "react-bootstrap";
import Loader from "../Loader";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import {
  useGetUsersListQuery,
  useBlockUserMutation,
  useMakeAdminMutation,
} from "../../store/services/superadmin.service";
import { successMessageToast } from "../common/hooks/common";

const LIMIT = 10;

function SuperAdminAllUsers() {
  const [selectedDate, setSelectedDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [offset, setOffset] = useState(0);
  const navigate = useNavigate();

  const { data: usersData, isLoading } = useGetUsersListQuery({
    limit: LIMIT,
    offset,
    // date: selectedDate,
    // search: searchTerm,
  });
  const [blockUser] = useBlockUserMutation();
  const [makeAdminMutation] = useMakeAdminMutation();

  const users = usersData?.data ?? [];
  const total = usersData?.total ?? 0;
  const currentPage = Math.floor(offset / LIMIT) + 1;
  const totalPages = Math.ceil(total / LIMIT);

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    setOffset(0);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setOffset(0);
  };

  const handlePrev = () => setOffset((prev) => Math.max(prev - LIMIT, 0));
  const handleNext = () => setOffset((prev) => prev + LIMIT);

  const handleMakeAdmin = async (userId, role) => {
    const confirm = window.confirm("Are you sure you want to change the role of this user?");
    if (!confirm) return;
    try {
      await makeAdminMutation({ user_id: userId, role }).unwrap();
      successMessageToast("User role changed successfully");
    } catch (error) {
      console.log(error?.data?.message || "Server error");
    }
  };

  const handleBlockUser = async (userId) => {
    const confirm = window.confirm("Are you sure you want to block/unblock this user?");
    if (!confirm) return;
    try {
      await blockUser(userId).unwrap();
      successMessageToast("User block status updated successfully");
    } catch (error) {
      console.log(error?.data?.message || "Server error");
    }
  };

  const downloadExcel = () => {
    if (users.length === 0) {
      Swal.fire({ icon: "warning", title: "No Users available to export!", confirmButtonColor: "#3085d6" });
      return;
    }
    const data = users.map((user, index) => ({
      "S No": offset + index + 1,
      "User ID": user.user_id,
      "Name": user.name,
      "Phone Number": user.mobile_number ?? "-",
      "Email": user.email ?? "-",
      "Date": dayjs(user.createdAt).format("MMM D, YYYY"),
    }));
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, `elk_users_report_${dayjs().format("YYYY-MM-DD")}.xlsx`);
  };

  return (
    <>
      <SSidebar />
      <AdminNav />
      <div className="homeadmin">
        <div className="filters">
          <div className="fields">
            <div className="label">Select date:</div>
            <div className="input">
              <input
                type="date"
                value={selectedDate}
                onChange={handleDateChange}
                onClick={(e) => e.target.showPicker()}
              />
            </div>
          </div>
          <div className="fields">
            <div className="label">Search:</div>
            <div className="input">
              <input
                type="text"
                placeholder="Search by Name, Phone or Email"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
          </div>
          <div style={{ marginLeft: "20px" }}>
            <h4>Total: {total}</h4>
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <Button variant="success" onClick={downloadExcel}>Download Excel</Button>
            {/* <Button variant="success" onClick={() => navigate("/admin/accounts/create")}>Create User</Button> */}
          </div>
        </div>

        {isLoading ? <Loader /> : (
          <>
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>S No:</th>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Phone</th>
                    <th>Email</th>
                    <th>Profile</th>
                    <th>Logged In</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length > 0 ? (
                    users.map((user, index) => (
                      <tr key={user.user_id}>
                        <td>{offset + index + 1}</td>
                        <td>{user.user_id}</td>
                        <td>{user.name}</td>
                        <td>{user.mobile_number ?? "-"}</td>
                        <td>{user.email ?? "-"}</td>
                        <td>
                          {user.profile
                            ? <img src={user.profile} alt="Profile" height="100" />
                            : "No Image"}
                        </td>
                        <td>{user?.is_logged ? "Yes" : "No"}</td>
                        <td>{dayjs(user.createdAt).format("MMM D, YYYY")}</td>
                        <td>
                          <Button
                            style={{ backgroundColor: "red", color: "white", marginRight: "5px" }}
                            onClick={() => handleBlockUser(user.user_id)}
                          >
                            {user.block_status === false ? "Block" : "UnBlock"}
                          </Button>
                          {user.role !== "superadmin" && user.role !== "admin" ? (
                            <Button variant="primary" onClick={() => handleMakeAdmin(user.user_id, "admin")}>
                              Make Sales
                            </Button>
                          ) : (
                            <Button variant="primary" onClick={() => handleMakeAdmin(user.user_id, "user")}>
                              Change to User
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="9" style={{ textAlign: "center" }}>No users found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="d-flex justify-content-center align-items-center gap-3 mt-3">
                <Button variant="outline-secondary" size="sm" onClick={handlePrev} disabled={offset === 0}>
                  Previous
                </Button>
                <span>Page {currentPage} of {totalPages}</span>
                <Button variant="outline-secondary" size="sm" onClick={handleNext} disabled={currentPage >= totalPages}>
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

export default SuperAdminAllUsers;

import Sidebar from './SideBar'
import '../../styles/admin/HomeAdmin.css'
import { useState } from 'react'
import Loader from '../Loader'
import { useGetSalesUsersListQuery } from '../../store/services/admin.service'
import dayjs from 'dayjs'

const LIMIT = 10

function AdminAllUsers() {
  const [offset, setOffset] = useState(0)

  const { data: userData, isLoading: userDataLoading } =
    useGetSalesUsersListQuery({ limit: LIMIT, offset })

  const users = userData?.data ?? []
  const total = userData?.total ?? 0
  const currentPage = Math.floor(offset / LIMIT) + 1
  const totalPages = Math.ceil(total / LIMIT)

  const handlePrev = () => setOffset((prev) => Math.max(prev - LIMIT, 0))
  const handleNext = () => setOffset((prev) => prev + LIMIT)

  return (
    <>
      <Sidebar />
      <div className="homeadmin">
        <div className="filters">
          <h4>Total: {total}</h4>
        </div>

        {userDataLoading ? (
          <Loader />
        ) : (
          <>
            {/* Desktop Table */}
            <div className="admin-table-container d-none d-md-block">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>S No:</th>
                    <th>Name</th>
                    <th>Profile</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length > 0 ? (
                    users.map((user, index) => (
                      <tr key={user.login_user.id}>
                        <td>{offset + index + 1}</td>
                        <td>{user.login_user.name}</td>
                        <td>
                          {user.login_user.profile ? (
                            <img
                              src={user.login_user.profile}
                              alt="Profile"
                              height="60"
                            />
                          ) : (
                            'No Image'
                          )}
                        </td>

                        <td>
                          {dayjs(user.login_user.createdAt).format(
                            'MMM D, YYYY',
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" style={{ textAlign: 'center' }}>
                        No users found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="d-block d-md-none">
              {users.length > 0 ? (
                users.map((user, index) => (
                  <div key={user.login_user.id} className="user-card">
                    <div className="user-card-row">
                      <div className="user-card-content">
                        <div className="user-card-header">
                          <strong>
                            {offset + index + 1}. {user.login_user.name}
                          </strong>
                        </div>
                        <p><b>Date:</b> {dayjs(user.login_user.createdAt).format("MMM D, YYYY")}</p>
                      </div>
                      {user.login_user.profile && (
                        <div className="user-card-image">
                          <img
                            src={user.login_user.profile}
                            alt="Profile"
                            className="user-profile-img"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p style={{ textAlign: 'center' }}>No users found</p>
              )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="d-flex justify-content-center align-items-center gap-3 mt-3">
                <button
                  className="btn btn-outline-secondary btn-sm"
                  onClick={handlePrev}
                  disabled={offset === 0}
                >
                  Previous
                </button>
                <span>
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  className="btn btn-outline-secondary btn-sm"
                  onClick={handleNext}
                  disabled={currentPage >= totalPages}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  )
}

export default AdminAllUsers

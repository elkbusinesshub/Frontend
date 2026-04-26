import '../../styles/admin/Sidebar.css'
import React, { useState, useEffect, useRef } from 'react'
import {
  MdHome,
  MdList,
  MdArrowDropDown,
  MdArrowRight,
  MdBook,
  MdPhone
} from 'react-icons/md'
import { FaUser } from 'react-icons/fa'
import { Link, useLocation } from 'react-router-dom'
import img from '../../assets/logo.png'

function SuperAdminSidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [openIndex, setOpenIndex] = useState(null)
  const location = useLocation()

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev)
  }

  const closeSidebar = () => {
    setIsSidebarOpen(false)
  }

  useEffect(() => {
    setIsSidebarOpen(false)
  }, [location])

  useEffect(() => {
    if (
      location.pathname === '/admin/accounts' ||
      location.pathname === '/admin/sales-users'
    ) {
      setOpenIndex(2)
    } else if (
      location.pathname === '/admin/notification' ||
      location.pathname === '/admin/notification-view'
    ) {
      setOpenIndex(1)
    } else if (
      location.pathname === '/admin/phone-check'
    ) {
      setOpenIndex(3)
    } else {
      setOpenIndex(null)
    }
  }, [location])

  const handleItemClick = (index) => {
    setOpenIndex(index === openIndex ? null : index)
  }

  return (
    <>
      {/* Overlay */}
      <div
        className={`sidebar-overlay ${isSidebarOpen ? 'show' : ''}`}
        onClick={closeSidebar}
      ></div>

      {/* Mobile Toggle Button */}
      <div className="togglebtn">
        <div className="btn" onClick={toggleSidebar}>
          <MdList size={28} />
        </div>
      </div>

      {/* Sidebar */}
      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="logo">
          <img src={img} alt="logo" />
        </div>

        <div className="links">
          {/* Ads */}
          <Link
            to="/admin"
            className={`listitem ${location.pathname === '/admin' ? 'active' : ''}`}
            onClick={closeSidebar}
          >
            <div className="listitemhead">
              <div className="icon">
                <MdHome />
              </div>
              <div className="title">Ads</div>
            </div>
          </Link>
          {/* Accounts Dropdown */}
          <div className="listitem">
            <div className="listitemhead" onClick={() => handleItemClick(2)}>
              <div className="icon">
                <FaUser />
              </div>
              <div className="title">Accounts</div>
              <div className="arrow">
                {openIndex === 2 ? <MdArrowDropDown /> : <MdArrowRight />}
              </div>
            </div>

            <SubMenu isOpen={openIndex === 2}>
              <Link
                to="/admin/accounts"
                className={`subitem ${
                  location.pathname === '/admin/accounts' ? 'active' : ''
                }`}
                onClick={closeSidebar}
              >
                All Users
              </Link>

              <Link
                to="/admin/sales-users"
                className={`subitem ${
                  location.pathname === '/admin/sales-users' ? 'active' : ''
                }`}
                onClick={closeSidebar}
              >
                Sales Users
              </Link>
            </SubMenu>
          </div>
          {/* Notification Dropdown */}
          <div className="listitem">
            <div className="listitemhead" onClick={() => handleItemClick(1)}>
              <div className="icon">
                <MdBook />
              </div>
              <div className="title">Notification</div>
              <div className="arrow">
                {openIndex === 1 ? <MdArrowDropDown /> : <MdArrowRight />}
              </div>
            </div>

            <SubMenu isOpen={openIndex === 1}>
              <Link
                to="/admin/notification"
                className={`subitem ${
                  location.pathname === '/admin/notification' ? 'active' : ''
                }`}
                onClick={closeSidebar}
              >
                Send Notification
              </Link>

              <Link
                to="/admin/notification-view"
                className={`subitem ${
                  location.pathname === '/admin/notification-view'
                    ? 'active'
                    : ''
                }`}
                onClick={closeSidebar}
              >
                View Notification
              </Link>
            </SubMenu>
          </div>

          <Link
            to="/admin/phone-check"
            className={`listitem ${location.pathname === '/admin/phone-check' ? 'active' : ''}`}
            onClick={closeSidebar}
          >
            <div className="listitemhead">
              <div className="icon">
                <MdPhone />
              </div>
              <div className="title">Notification Check</div>
            </div>
          </Link>
        </div>
      </div>
    </>
  )
}

const SubMenu = ({ children, isOpen }) => {
  const ref = useRef(null)
  const [maxHeight, setMaxHeight] = useState('0px')

  useEffect(() => {
    if (ref.current) {
      setMaxHeight(isOpen ? `${ref.current.scrollHeight}px` : '0px')
    }
  }, [isOpen])

  return (
    <div
      className="children"
      ref={ref}
      style={{
        maxHeight,
        overflow: 'hidden',
        transition: 'max-height 0.3s ease',
      }}
    >
      {children}
    </div>
  )
}

export default SuperAdminSidebar

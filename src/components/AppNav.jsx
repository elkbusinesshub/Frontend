import React, { useState } from "react";
import {
  Navbar,
  Nav,
  Container,
  Button,
  Form,
  Image,
  Dropdown,
} from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { clearUser } from "../store/slices/authSlice";
import ChatIcon from "@mui/icons-material/Chat";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import logo from "../assets/logo3.png";
import "./AppHeader.css";

function AppHeader({ isChat }) {
  const { user, role, token } = useSelector((state) => state.auth);
  console.log(user, role, token)
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  // const token = localStorage.getItem("elk_authorization_token");

  const [expanded, setExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("elk_authorization_token");
    dispatch(clearUser());
    navigate("/home");
    window.location.reload();
  };

  return (
    <Navbar
      expand="lg"
      expanded={expanded}
      className="main-navbar"
      sticky="top"
    //   fixed="top"
    >
      <Container>
        <Navbar.Brand onClick={() => navigate("/home")}>
          <Image src={logo} className="nav-logo" />
        </Navbar.Brand>

        {!isChat && (
          <Form
            className="search-bar"
            onSubmit={(e) => {
              e.preventDefault();
              navigate(`/search/${searchTerm}`);
              setExpanded(false);
            }}
          >
            <Form.Control
              type="search"
              placeholder="Search ads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Form>
        )}

        <Navbar.Toggle onClick={() => setExpanded(!expanded)} />

        <Navbar.Collapse>
          <Nav className="ms-auto nav-items">

            {!isChat && location.pathname !== "/post-ad" && (
              <Button
                className="post-btn"
                onClick={() => {
                  setExpanded(false);
                  !token ? navigate("/login") : navigate("/post-ad");
                }}
              >
                Place Your Ad
              </Button>
            )}

            {token && (
              <>
                <ChatIcon
                  className="nav-icon"
                  onClick={() => {
                    navigate("/chat");
                    setExpanded(false);
                  }}
                />
                <FavoriteBorderIcon
                  className="nav-icon"
                  onClick={() => {
                    navigate("/mywishlist");
                    setExpanded(false);
                  }}
                />
              </>
            )}

            {token ? (
              <Dropdown align="end">
                <Dropdown.Toggle className="account-btn">
                  {user?.name || "My Account"}
                </Dropdown.Toggle>

                <Dropdown.Menu className="account-menu">
                  <Dropdown.Item onClick={() => navigate("/profile")}>
                    Profile
                  </Dropdown.Item>

                  {role === "admin" && (
                    <Dropdown.Item onClick={() => navigate("/sales")}>
                      Sales
                    </Dropdown.Item>
                  )}

                  {role === "superadmin" && (
                    <Dropdown.Item onClick={() => navigate("/admin")}>
                      Admin
                    </Dropdown.Item>
                  )}

                  <Dropdown.Divider />
                  <Dropdown.Item onClick={handleLogout}>
                    Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <Button
                className="login-btn"
                onClick={() => {
                  navigate("/login");
                  setExpanded(false);
                }}
              >
                Login
              </Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AppHeader;
import { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { ThreeDotsVertical, ArrowLeft } from "react-bootstrap-icons";
import socket from "../utils/socket";
import { useSelector } from 'react-redux';
import Loader from "./Loader";
import logonew from '../assets/footlogo.png';
import { Image } from "react-bootstrap";
import ChatAudioPlayer from "./AudioPlayer";
import bgimg from '../assets/bg_chat.jpg';
import { useLocation } from 'react-router-dom';
import dayjs from 'dayjs'; // <-- FIX: Added this import

const ChatScreen = () => {
  const location = useLocation();
  const userId = location.state?.userId;
  const otherUserName = location.state?.userName;
  const adId = location.state?.adId;
  const adName = location.state?.adName;
  const { user, token, isAuthenticated } = useSelector((state) => state.auth);

  const [chatRooms, setChatRooms] = useState([]);
  const [selectedOtherUser, setSelectedOtherUser] = useState(userId);
  const [selectedOtherUserName, setSelectedOtherUserName] = useState(otherUserName);

  const [chatMessages, setChatMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // --- (useEffect hooks for resize, scroll, socket connection, message fetching, new message handling remain the same) ---
   useEffect(() => { // Detect mobile view on resize
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const chatEndRef = useRef(null); // Ref to scroll to bottom

  useEffect(() => { // Scroll to bottom on new message
    if (chatEndRef.current) chatEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  useEffect(() => { // Socket registration and room fetching
    if (!isAuthenticated || !user) return;
    const socketInstance = socket;
    setLoading(true);
    socketInstance.emit("register", user.user_id);
    socketInstance.emit("getChatRooms", user.user_id);
    socketInstance.on("chatRooms", (rooms) => setChatRooms(rooms));
    setLoading(false);
    return () => socketInstance.disconnect();
  }, [user?.user_id, isAuthenticated, user]);

  useEffect(() => { // Fetch historical messages via API
    const fetchChatMessages = async () => {
      if (!user?.user_id || !selectedOtherUser) return;
      try {
        setLoading(true);
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/get_chat?authUserId=${user.user_id}&otherUserId=${selectedOtherUser}`, { method: 'GET', headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } });
        const result = await response.json();
        setChatMessages(response.ok ? result.data.chatMessages : []);
      } catch (err) { console.error("Error fetching chat messages:", err); setChatMessages([]); }
      finally { setLoading(false); }
    };
    fetchChatMessages();
  }, [selectedOtherUser, user?.user_id, token]);

  useEffect(() => { // Listen for new messages via socket
    if (!isAuthenticated || !user) return;
    const socketInstance = socket;
    const handleNewMessage = (newMsg) => {
      if ( selectedOtherUser && (newMsg.sender_id === selectedOtherUser || newMsg.reciever_id === selectedOtherUser) && (newMsg.sender_id === user.user_id || newMsg.reciever_id === user.user_id) ) {
        setChatMessages((prev) => [...prev, newMsg]);
      }
    };
    socketInstance.on("newMessage", handleNewMessage);
    return () => socketInstance.off("newMessage", handleNewMessage);
  }, [selectedOtherUser, user?.user_id, isAuthenticated, user]);
  // --- --- ---

  const sendMessage = () => {
    if (input.trim() && selectedOtherUser && user) {
      const socketInstance = socket;
      const messageData = {
        authUserId: user.user_id, userId: selectedOtherUser, message: input.trim(),
        type: 'text', file: null, fileType: '', file_name: '',
        ad_id: adId, ad_name: adName, status: 'send',
      };
      try {
        socketInstance.emit("sendMessage", messageData);
        setInput("");
      } catch (e) { console.error("Socket emit failed:", e); }
    }
  };

  const handleChatRoomClick = (chat) => {
    setSelectedOtherUser(chat.otherUser.user_id);
    setSelectedOtherUserName(chat.otherUser.name)
  };

  const handleBack = () => {
    setSelectedOtherUser(null);
    setSelectedOtherUserName(null);
  };

  if (!isAuthenticated || !user) {
    return <Loader />;
  }

  return (
    <>
      <div className={`container pt-3`} style={{ maxWidth: "1000px" }}> {/* Added pt-3 */}
        <div className={`row ${isMobile ? '' : 'border rounded'} shadow-sm`} style={{ height: "700px", backgroundColor: '#4FBBB4' }}>
          {/* Chat Room List */}
          {(isMobile ? !selectedOtherUser : true) && (
              <div className={`${isMobile ? 'col-12' : 'col-md-4 border-end'} p-3`} style={{ overflowY: "auto" }}>
                <h5 className="border-bottom" style={{ color: 'white', fontWeight: 'bold' }}>Chats</h5>
                <ul className="list-group list-unstyled">
                  {chatRooms.map((chat) => (
                    <li key={chat.id} className="d-flex align-items-center p-2 border-bottom" style={{ cursor: 'pointer' }} onClick={() => handleChatRoomClick(chat)}>
                      <img src={chat.otherUser.profile ?? 'https://static.vecteezy.com/system/resources/previews/036/280/651/non_2x/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-illustration-vector.jpg'} alt={chat.otherUser.name} className="rounded-circle me-2" width="40" height="40" />
                      <div>
                        <strong style={{ color: 'white' }}>{chat.otherUser.name}</strong>
                        <p className="small text-muted mb-0" style={{ color: '#FFFFFF' }}>{chat.otherUser.description}</p>
                      </div>
                    </li>
                  ))}
              </ul>
            </div>
          )}
          {/* Chat Messages Area */}
          <div className={`col-md-8 d-flex flex-column ${!selectedOtherUser ? 'd-none d-md-flex' : 'd-flex'}`}
            style={{
              backgroundColor: selectedOtherUser ? '#4FBBB4' : 'grey',
              backgroundImage: `url(${bgimg})`,
              backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center',
            }}
          >
            {/* Placeholder */}
            {!selectedOtherUser ? (
              <div className="d-flex align-items-center justify-content-center flex-grow-1" style={{ height: '100%' }}>
                <Image src={logonew} thumbnail alt="Company Logo" style={{ width: '400px', height: '250px', backgroundColor: 'transparent', border:'none' }} />
              </div>
            ) : (
              // Chat Header and Messages
              <>
                {/* Chat Header */}
                <div className="d-flex align-items-center justify-content-between border-bottom pb-2 pt-3 mb-2">
                  <div className="d-flex align-items-center">
                    <button className="btn btn-link d-md-none text-white me-2" onClick={handleBack}> <ArrowLeft size={24} /> </button>
                    <img src={'https://static.vecteezy.com/system/resources/previews/036/280/651/non_2x/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-illustration-vector.jpg'} alt="User" className="rounded-circle me-2" width="40" height="40" />
                    <div> <strong style={{ color: 'white', fontWeight: 'bold' }}>{selectedOtherUserName}</strong> </div>
                  </div>
                  <ThreeDotsVertical size={20} className="cursor-pointer text-white" />
                </div>

                {/* Message Display Area */}
                <div className="flex-grow-1 overflow-auto mb-2" style={{ maxHeight: "calc(700px - 140px)" }}>
                  {loading ? <Loader/> : chatMessages.map((msg) => {
                    const isSentByUser = msg.sender_id === user.user_id;
                    return (
                      <div key={msg.id || msg.timestamp} className={`d-flex mb-2 ${isSentByUser ? 'justify-content-end' : 'justify-content-start'}`}>
                        <div className="p-2 rounded shadow-sm" style={{ backgroundColor: isSentByUser ? '#FFDA3F' : 'white', maxWidth: '70%', wordBreak: 'break-word' }}>
                          {msg.ad_id && msg.ad_name && ( <div className="rounded mb-1 small p-1" style={{ backgroundColor: isSentByUser ? '#4FBBB4' : '#E0E0E0', color: isSentByUser ? 'white' : 'black' }}> Regarding: {msg.ad_name} </div> )}
                          {msg.type === 'audio' ? ( <ChatAudioPlayer audioUrl={msg.file_url} /> ) : ( <div>{msg.message}</div> )}
                           <div className="text-muted small mt-1" style={{fontSize: '0.7rem', textAlign: isSentByUser ? 'right' : 'left'}}>
                               {/* Use dayjs here */}
                               {dayjs(msg.timestamp).format('h:mm A')}
                           </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={chatEndRef}></div>
                </div>

                {/* Message Input Area */}
                <div className="input-group mt-auto mb-2" style={{ height: "50px" }}>
                  <input type="text" className="form-control" placeholder="Type a message..." value={input} onChange={(e) => setInput(e.target.value)} onKeyUp={(e) => e.key === "Enter" && sendMessage()} />
                  <button className="btn" style={{ backgroundColor: '#FFDA3F', color: "white" }} onClick={sendMessage}>Send</button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <div className={isMobile ? '' : "p-2"}></div>
    </>
  );
};

export default ChatScreen;
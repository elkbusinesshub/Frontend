import { useState, useEffect, useRef } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import AppHeader from './AppHeader'
import { ThreeDotsVertical, ArrowLeft } from 'react-bootstrap-icons'
import socket from '../utils/socket'
import { useSelector } from 'react-redux'
import Loader from './Loader'
import ChatAudioPlayer from './AudioPlayer'
import bgimg from '../assets/bg_chat.jpg'
import { useLocation } from 'react-router-dom'
import { useGetChatListQuery } from '../store/services/chat.service'
import { skipToken } from '@reduxjs/toolkit/query'

const ChatScreen = () => {
  // const {data: chatList, isLoading: chatListLoading} = useGetChatListQuery();
  const location = useLocation()
  const userId = location.state?.userId
  const otherUserName = location.state?.userName
  const otherUserImage = location.state?.profile
  const message = location.state?.message
  const adId = location.state?.adId
  const adName = location.state?.adName
  const { user, token, isAuthenticated } = useSelector((state) => state.auth)

  const [chatRooms, setChatRooms] = useState([])
  const [selectedOtherUser, setSelectedOtherUser] = useState(userId)
  const [selectedOtherUserName, setSelectedOtherUserName] =
    useState(otherUserName)
  const [selectedOtherUserImage, setSelectedOtherUserImage] =
    useState(otherUserImage)

  const [chatMessages, setChatMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [input, setInput] = useState(message)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  const chatEndRef = useRef(null)

  useEffect(() => {
    socket.on('connect', () => {
      console.log('✅ Connected to socket:', socket.id)
    })
    socket.on('disconnect', () => {
      console.log('❌ Disconnected from socket')
    })
    return () => {
      socket.off('connect')
      socket.off('disconnect')
    }
  }, [])

  useEffect(() => {
    if (!isAuthenticated || !user) return

    setLoading(true)
    socket.emit('register', user.user_id)
    socket.emit('getChatRooms', user.user_id)

    const handleChatRooms = (rooms) => setChatRooms(rooms)
    socket.on('chatRooms', handleChatRooms)

    setLoading(false)

    return () => {
      socket.off('chatRooms', handleChatRooms)
    }
  }, [user?.user_id, isAuthenticated])

  useEffect(() => {
    if (!isAuthenticated || !user) return

    setLoading(true)

    socket.emit('register', user.user_id, () => {
      // ✅ only fetch rooms after register is acknowledged
      socket.emit('getChatRooms', user.user_id)
    })

    const handleChatRooms = (rooms) => {
      setChatRooms(rooms)
      setLoading(false) // ✅ move loading false here
    }

    socket.on('chatRooms', handleChatRooms)

    // ✅ also re-fetch rooms when socket reconnects
    socket.on('connect', () => {
      socket.emit('register', user.user_id, () => {
        socket.emit('getChatRooms', user.user_id)
      })
    })

    return () => {
      socket.off('chatRooms', handleChatRooms)
      socket.off('connect')
    }
  }, [user?.user_id, isAuthenticated])

  const {
    data: messagesData,
    isLoading: messagesLoading,
    refetch,
  } = useGetChatListQuery(
    selectedOtherUser
      ? { authUserId: user.user_id, otherUserId: selectedOtherUser }
      : skipToken,
  )

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messagesData?.chatMessages])


  useEffect(() => {
  if (!selectedOtherUser) return;

  const handleNewMessage = () => {
    refetch(); // ✅ refetch whenever any new message comes in
  };

  socket.on("newMessage", handleNewMessage);

  return () => {
    socket.off("newMessage", handleNewMessage);
  };
}, [selectedOtherUser, refetch]);

  const sendMessage = () => {
    if (input.trim() && selectedOtherUser) {
      const messageData = {
        authUserId: user.user_id,
        userId: selectedOtherUser,
        message: input.trim(),
        type: 'text',
        file: null,
        fileType: '',
        file_name: '',
        ad_id: adId,
        ad_name: adName,
        status: 'send',
      }

      setInput('')

      try {
        socket.emit('sendMessage', messageData)
        setTimeout(() => refetch(), 500) // ✅ give server time to save
      } catch (e) {
        console.error('Socket emit failed:', e)
      }
    }
  }

  const handleChatRoomClick = (chat) => {
    setSelectedOtherUser(chat.otherUser.user_id)
    setSelectedOtherUserName(chat.otherUser.name)
    setSelectedOtherUserImage(chat.otherUser.profile)
  }

  const handleBack = () => {
    setSelectedOtherUser(null)
    setSelectedOtherUserName(null)
  }

  if (!isAuthenticated || !user) {
    return <Loader />
  }

  return (
    <>
      <AppHeader isChat={true} />
      {loading ? (
        <Loader />
      ) : (
        <div className={`container`} style={{ maxWidth: '1000px' }}>
          <div
            className={`row ${isMobile ? '' : 'border rounded'} shadow-sm`}
            style={{ height: '700px', backgroundColor: '#4FBBB4' }}
          >
            {(isMobile ? !selectedOtherUser : true) && (
              <div
                className={`${isMobile ? 'col-12' : 'col-md-4 border-end'} p-3`}
                style={{ overflowY: 'auto', maxHeight: '100%', height: '100%' }}
              >
                <h5
                  className="border-bottom"
                  style={{ color: 'white', fontWeight: 'bold' }}
                >
                  Chats
                </h5>
                <ul className="list-group list-unstyled">
                  {chatRooms.map((chat) => (
                    <li
                      key={chat.id}
                      className="d-flex align-items-center p-2 border-bottom"
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleChatRoomClick(chat)}
                    >
                      <img
                        src={
                          chat.otherUser.profile ??
                          'https://static.vecteezy.com/system/resources/previews/036/280/651/non_2x/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-illustration-vector.jpg'
                        }
                        alt={chat.otherUser.name}
                        className="rounded-circle me-2"
                        width="40"
                        height="40"
                      />
                      <div>
                        <strong style={{ color: 'white' }}>
                          {chat.otherUser.name}
                        </strong>
                        {/* <p className="small text-muted mb-0" style={{ color: '#FFFFFF' }}>{chat.otherUser.description}</p> */}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div
              className={`col-md-8 d-flex flex-column ${
                !selectedOtherUser ? 'd-none d-md-flex' : 'd-flex'
              }`}
              style={{
                backgroundColor: selectedOtherUser ? '#4FBBB4' : 'grey',
                backgroundImage: `url(${bgimg})`,
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
              }}
            >
              {!selectedOtherUser ? (
                <div
                  className="d-flex align-items-center justify-content-center flex-grow-1"
                  style={{ height: '100%' }}
                >
                  {/* <Image src={logonew} thumbnail alt="Company Logo" style={{ width: '400px', height: '250px', backgroundColor: 'transparent' }} /> */}
                </div>
              ) : (
                <>
                  <div className="d-flex align-items-center justify-content-between border-bottom pb-2 pt-3 mb-2">
                    <div className="d-flex align-items-center">
                      <button
                        className="btn btn-link d-md-none text-white me-2"
                        onClick={handleBack}
                      >
                        <ArrowLeft size={24} />
                      </button>
                      <img
                        src={
                          selectedOtherUserImage ??
                          'https://static.vecteezy.com/system/resources/previews/036/280/651/non_2x/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-illustration-vector.jpg'
                        }
                        alt="User"
                        className="rounded-circle me-2"
                        width="40"
                        height="40"
                      />
                      <div>
                        <strong style={{ color: 'white', fontWeight: 'bold' }}>
                          {selectedOtherUserName}
                        </strong>
                      </div>
                    </div>
                    <ThreeDotsVertical
                      size={20}
                      style={{ color: 'white', cursor: 'pointer' }}
                    />
                  </div>

                  <div
                    className="flex-grow-1 overflow-auto mb-2"
                    style={{ maxHeight: '530px' }}
                  >
                    {messagesData?.chatMessages?.map((msg) => {
                      const isSentByUser = msg.sender_id === user.user_id
                      return (
                        <div
                          key={msg.id}
                          className={`d-flex mb-2 p-2 rounded`}
                          style={{ flexDirection: 'column' }}
                        >
                          <div
                            className="d-flex p-2 rounded"
                            style={{
                              backgroundColor: isSentByUser
                                ? '#FFDA3F'
                                : 'white',
                              maxWidth: '70%',
                              flexDirection: 'column',
                              alignSelf: isSentByUser
                                ? 'flex-end'
                                : 'flex-start',
                            }}
                          >
                            {msg.ad_id && (
                              <div
                                className="rounded mb-1"
                                style={{
                                  backgroundColor: isSentByUser
                                    ? '#4FBBB4'
                                    : '#FFDA3F',
                                  color: 'white',
                                  padding: '2px 6px',
                                }}
                              >
                                {msg.ad_id}
                              </div>
                            )}
                            {msg.type === 'audio' ? (
                              <ChatAudioPlayer audioUrl={msg.file_url} />
                            ) : (
                              <div
                                className={`rounded mb-1 ${
                                  isSentByUser ? 'text-white' : 'bg-light'
                                }`}
                                style={{
                                  display: 'flex',
                                  alignItems: 'flex-end',
                                }}
                              >
                                {msg.message}
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                    <div ref={chatEndRef}></div>
                  </div>

                  <div className="input-group" style={{ height: '50px' }}>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Type a message..."
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyUp={(e) => e.key === 'Enter' && sendMessage()}
                    />
                    <button
                      className="btn"
                      style={{ backgroundColor: '#FFDA3F', color: 'white' }}
                      onClick={sendMessage}
                    >
                      Send
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
      <div className={isMobile ? '' : 'p-2'}></div>
    </>
  )
}

export default ChatScreen

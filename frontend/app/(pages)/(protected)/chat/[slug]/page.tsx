"use client"

import { useMainContext } from '@/app/_context/MainContext'
import React, { useEffect } from 'react'

const ChatDialog = () => {
  const context = useMainContext();
  

  useEffect(() => {
    if (!context.selectedChat) return;

    context.socket.emit("/join-chat", context.selectedChat);
  }, [context.selectedChat]);

  useEffect(() => {
    return () => {
      context.setSelectedChat(null);
      context.socket.emit("/disconnect-chat", context.selectedChat);
    }
  }, []);

  return (
    <div>ChatDialog</div>
  )
}

export default ChatDialog
'use client'

import React, { useEffect, useState } from 'react'
import * as dd from 'dingtalk-jsapi'
import ChatWithHistoryWrap from '@/app/components/base/chat/chat-with-history'

const Chat = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  useEffect(() => {
    // fetch('/agent/dingtalk/test')
    //   .then((data) => {
    //     setIsLoggedIn(true)
    //   }).catch((err) => {
    //     alert("获取用户信息失败：" + JSON.stringify(err));
    //   })

    const queryParams = new URLSearchParams(document.location.search);
    const corpId = queryParams.get('corpId')
    if (dd.env.platform !== 'notInDingTalk' && corpId) {
      dd.ready(() => {
        dd.runtime.permission.requestAuthCode({
          corpId
        }).then((result) => {
          // alert(result.code)
          getUserInfo(result.code)
        }).catch((err) => {
          alert("获取授权码失败：" + JSON.stringify(err));
        })
      })
    } else {
      console.log('请在钉钉客户端中打开')
      setIsLoggedIn(true)
    }
  }, [])

  function getUserInfo(code: string) {
    fetch('/agent/dingtalk/get-user-info?code=' + code)
      .then((res) => res.json())
      .then((data) => {
        console.log(JSON.stringify(data))
        // alert(JSON.stringify(data));
        window.localStorage.setItem('_practical_ai_user', data.result.userid)
        if (data.errcode === 0) {
          setIsLoggedIn(true)
        }
      }).catch((err) => {
        alert("获取用户信息失败：" + JSON.stringify(err));
      })
  }

  return (
    <>
      {
        isLoggedIn && <ChatWithHistoryWrap />
      }
    </>
  )
}

export default React.memo(Chat)

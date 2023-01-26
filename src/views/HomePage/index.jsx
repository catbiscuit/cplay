import React, { useState } from 'react'
import { connect } from 'react-redux'

import Coverwrap from './Coverwrap'
import Glasscover from './Glasscover'
import PlayProgressbar from '@/components/PlayProgressbar'
import Lyricsedit from './Lyricsedit'
import UploadBox from './UploadBox'

import player from '@/store/player'
import lyrics from '@/store/lyrics'
import upload from '@/store/upload'

import { secondsToFormat } from '@/utils/time_parser'
import style from './home.module.scss'

function HomePage(props) {
  let {
    /* state */
    picUrl,
    sameUrled,
    currentTime,
    duration,
    buffered,
    uploaded,
    uploadedState,
    /* dispatch */
    setTargetTime,
    uploadBoxShow,
    uploadSameUrl,
  } = props
  const [isDrag, setIsDrag] = useState(false)
  const [current, setCurrent] = useState(0)

  return (
    <>
      <div>home</div>
      <div className={style.home_page_body}>
        <div className={style.home_page_contain}>
          {/* <!-- 唱片滚动及事件绑定 --> */}
          <Coverwrap cv_url={picUrl}></Coverwrap>
          {/* <!--歌词编辑区--> */}
          {uploadedState !== 0 && (
            <Lyricsedit uploadedState={uploadedState}></Lyricsedit>
          )}
        </div>
        <PlayProgressbar
          current={secondsToFormat(isDrag ? current : currentTime, 0)}
          duration={secondsToFormat(duration, 0)}
          curPercent={currentTime / duration}
          prePercent={buffered}
          setCurrentPercent={(percent, isD) => {
            if (isDrag !== isD) {
              setIsDrag(isD)
            }
            setTargetTime(percent * duration)
          }}
          setCurrentTime={(percent, isD) => {
            if (isDrag !== isD) {
              setIsDrag(isD)
            }
            setCurrent(percent * duration)
          }}
        ></PlayProgressbar>
        <Glasscover
          gc_url={picUrl}
          sameUrled={sameUrled}
          uploadSameUrl={(bool) => {
            uploadSameUrl(bool)
          }}
        ></Glasscover>
        {uploaded && (
          <UploadBox
            closeUploadBox={(bool) => {
              uploadBoxShow(bool)
            }}
          ></UploadBox>
        )}
      </div>
    </>
  )
}

const mapStateToProps = (state) => {
  return {
    buffered: state.player.buffered,
    duration: state.player.duration,
    currentTime: state.player.currentTime,
    uploaded: state.lyricsEdit.uploaded,
    uploadedState: state.uploadFiles.uploadedState,
    picUrl: state.uploadFiles.picUrl,
    sameUrled: state.uploadFiles.sameUrled,
  }
}

const mapDispathToProps = {
  setTargetTime: player.actions.setTargetTime,
  uploadBoxShow: lyrics.actions.uploadBoxShow,
  uploadSameUrl: upload.actions.uploadSameUrl,
}

export default connect(mapStateToProps, mapDispathToProps)(HomePage)

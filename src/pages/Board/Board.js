import { Route, Routes } from 'react-router-dom';
import style from "./Board.module.css";
import SideBar from './SideBar/SideBar';
import "react-quill/dist/quill.snow.css";
import { useState } from "react";

import FreeBoardList from './BoardContentsList/js/FreeBoardList';
import FavoriteBoardList from './BoardContentsList/js/FavoriteBoardList';
import RoomBoardList from './BoardContentsList/js/RoomBoardList';
import RoomBoardWrite from './Write/js/WriteBoard/RoomBoardWrite';
import FreeBoardWrite from './Write/js/WriteBoard/FreeBoardWrite';
import FreeBoardContents from './BoardContents/js/FreeBoardContents';
import RoomBoardContents from './BoardContents/js/RoomBoardContents';
const Board = () => {
    const [contentsSeq, setContentsSeq] = useState(0);

    return (
        <div className={style.boardContainer}>
             <div className={style.sideBar}>
                <SideBar></SideBar>
             </div>
            <div>
                <Routes>
                    <Route path="/" element={<FreeBoardList setContentsSeq={setContentsSeq}/>}></Route>
                    <Route path="/toFreeBoardList" element={<FreeBoardList setContentsSeq={setContentsSeq}/>} ></Route>
                    <Route path="/toFavoriteBoardList" element={<FavoriteBoardList setContentsSeq={setContentsSeq}/>}  ></Route>
                    <Route path="/toRoomBoardList" element={<RoomBoardList setContentsSeq={setContentsSeq}/>}  ></Route>
                    <Route path="/toRoomBoardWrite" element={<RoomBoardWrite/>}></Route>
                    <Route path="/toFreeBoardWrite" element={<FreeBoardWrite/>}></Route>
                    <Route path="/toFreeBoardContents/*" element={<FreeBoardContents contentsSeq={contentsSeq}/>} ></Route>
                    <Route path="/toRoomBoardContents/*" element={<RoomBoardContents/>}></Route>
                </Routes>
            </div>
        </div >
    );
}

export default Board;
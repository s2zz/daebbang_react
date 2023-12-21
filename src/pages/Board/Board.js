import { Route, Routes } from 'react-router-dom';
import style from "./Board.module.css";
import "react-quill/dist/quill.snow.css";

import FreeBoardList from './BoardContentsList/js/FreeBoardList';
import FavoriteBoardList from './BoardContentsList/js/FavoriteBoardList';
import RoomBoardList from './BoardContentsList/js/RoomBoardList';
import RoomBoardWrite from './Write/js/WriteBoard/RoomBoardWrite';
import FreeBoardWrite from './Write/js/WriteBoard/FreeBoardWrite';
import FreeBoardContents from './BoardContents/js/FreeBoardContents';
import RoomBoardContents from './BoardContents/js/RoomBoardContents';
import EditFreeBoardContents from './EditBoardContents/js/EditFreeBoardContents';
import EditRoomBoardContents from './EditBoardContents/js/EditRoomBoardContents';
const Board = ({ loginId, admin }) => {

    return (
        <div className={style.boardContainer}>
            <Routes>
                <Route path="/" element={<FreeBoardList loginId={loginId}/>}></Route>
                <Route path="/toFreeBoardList" element={<FreeBoardList loginId={loginId}/>} ></Route>
                <Route path="/toFavoriteBoardList" element={<FavoriteBoardList />}  ></Route>
                <Route path="/toRoomBoardList" element={<RoomBoardList loginId={loginId}/>}  ></Route>
                <Route path="/toRoomBoardWrite" element={<RoomBoardWrite loginId={loginId}/>}></Route>
                <Route path="/toFreeBoardWrite" element={<FreeBoardWrite loginId={loginId}/>}></Route>
                <Route path="/toFreeBoardContents/*" element={<FreeBoardContents loginId={loginId} admin={admin} />} ></Route>
                <Route path="/toRoomBoardContents/*" element={<RoomBoardContents loginId={loginId} admin={admin} />}></Route>
                <Route path="/toEditFreeBoardContents/*" element={<EditFreeBoardContents loginId={loginId}/>}></Route>
                <Route path="/toEditRoomBoardContents/*" element={<EditRoomBoardContents loginId={loginId}/>}></Route>
            </Routes>
        </div >
    );
}

export default Board;
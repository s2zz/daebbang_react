import { Route, Routes } from 'react-router-dom';
import style from "./Board.module.css";
import SideBar from './SideBar/SideBar';
import "react-quill/dist/quill.snow.css";
import RoomBoardWrite from './Write/WriteBoard/RoomBoardWrite';
import FreeBoardWrite from './Write/WriteBoard/FreeBoardWrite';
import BoardContents from './BoardContents/BoardContents';
import FreeBoardList from './BoardContentsList/js/FreeBoardList';
import FavoriteBoardList from './BoardContentsList/js/FavoriteBoardList';
import RoomBoardList from './BoardContentsList/js/RoomBoardList';
const Board = () => {
    return (
        <div className={style.boardContainer}>
             <div className={style.sideBar}>
                <SideBar></SideBar>
             </div>
            <div>
                <Routes>
                    <Route path="/" element={<FreeBoardList />}></Route>
                    <Route path="/toFreeBoardList" element={<FreeBoardList />}></Route>
                    <Route path="/toFavoriteBoardList" element={<FavoriteBoardList />}></Route>
                    <Route path="/toRoomBoardList" element={<RoomBoardList />}></Route>
                    <Route path="/toRoomBoardWrite" element={<RoomBoardWrite/>}></Route>
                    <Route path="/toFreeBoardWrite" element={<FreeBoardWrite/>}></Route>
                    <Route path="/toBoardContents/*" element={<BoardContents/>}></Route>
                </Routes>
            </div>
        </div >
    );
}

export default Board;
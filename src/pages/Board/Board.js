import { Route, Routes } from 'react-router-dom';
import style from "./Board.module.css";
import FreeBoardList from './FreeBoard/FreeBoardList/FreeBoardList';
import SideBar from './SideBar/SideBar';
import RoomBoardList from './RoomBoard/RoomBoardList';
import WriteBoard from './Write/WriteBoard/WriteBoard';
import "react-quill/dist/quill.snow.css";
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
                    <Route path="/toRoomBoardList" element={<RoomBoardList />}></Route>
                    <Route path="/toWriteBoard" element={<WriteBoard/>}></Route>
                </Routes>
            </div>
        </div >
    );
}

export default Board;
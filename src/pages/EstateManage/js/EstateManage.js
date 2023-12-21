import { Route, Routes } from 'react-router-dom';
import EstateBoard from '../EstateBoard/js/EstateBoard';
import EstateInsert from '../EstateInsert/js/EstateInsert';
import EstateUpdate from '../EstateUpdate/js/EstateUpdate';
import ReviewApproval from '../ReviewApproval/js/ReviewApproval';
import EstateInfo from '../EstateInfo/js/EstateInfo';
import style from '../css/EstateManage.module.css';
import SideBar from './SideBar';

const EstateManage = () => {
    return (
        <div className={style.container}>
            <div className={style.sideBar}>
                <SideBar></SideBar>
            </div>
            <div className={style.mainContent}>
                <Routes>
                    <Route path="/" element={<EstateBoard />}></Route>
                    <Route path="/estateInsert" element={<EstateInsert />}></Route>
                    <Route path="/estateUpdate/:estateId" element={<EstateUpdate />}></Route>
                    <Route path="/reviewApproval" element={<ReviewApproval />}></Route>
                    <Route path="/estateInfo/:estateId" element={<EstateInfo />}></Route>
                </Routes>
            </div>
        </div >
    );
}

export default EstateManage;
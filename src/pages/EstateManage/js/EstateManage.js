import { Route, Routes } from 'react-router-dom';
import EstateInsert from '../EstateInsert/js/EstateInsert';
import EstateUpdate from '../EstateUpdate/js/EstateUpdate';
import EstateBoard from '../EstateBoard/js/EstateBoard';

const EstateManage = () => {
    return (
        <div>
            <div>
                <Routes>
                    <Route path="/" element={<EstateBoard />}></Route>
                    <Route path="/estateInsert" element={<EstateInsert />}></Route>
                    <Route path="/estateUpdate/:estateId" element={<EstateUpdate />}></Route>
                </Routes>
            </div>
        </div >
    );
}

export default EstateManage;
import { Route, Routes } from 'react-router-dom';
import EstateInsert from '../EstateInsert/js/EstateInsert'
import EstateBoard from '../EstateBoard/js/EstateBoard';

const EstateManage = () => {
    return (
        <div>
            <div>
                <Routes>
                    <Route path="/" element={<EstateBoard />}></Route>
                    <Route path="/estateInsert" element={<EstateInsert />}></Route>
                </Routes>
            </div>
        </div >
    );
}

export default EstateManage;
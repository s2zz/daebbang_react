import { Route, Routes } from 'react-router-dom';
import EstateInsert from '../EstateInsert/js/EstateInsert1'
import EstateInsert2 from '../EstateInsert/js/EstateInsert2'
import EstateInsert3 from '../EstateInsert/js/EstateInsert3'
import EstateBoard from '../EstateBoard/js/EstateBoard';




const EstateManage = () => {
    return (
        <div>
            <div>
                <Routes>
                    <Route path="/" element={<EstateBoard />}></Route>
                    <Route path="/estateInsert" element={<EstateInsert />}></Route>
                    <Route path="/estateInsert2" element={<EstateInsert2 />}></Route>
                    <Route path="/estateInsert3" element={<EstateInsert3 />}></Route>
                </Routes>
            </div>
        </div >
    );
}

export default EstateManage;
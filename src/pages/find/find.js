import { Route, Routes } from 'react-router-dom';
import FindId from './FindId';
import FindEnrollmentId from './FindenrollmentId';
import FindPw from './FindPw';
import FindEnrollmentPw from './FindenrollmentPw';
const Find = ({ loginId, admin }) => {

    return (
        <div>
            <Routes>
                <Route path="/findId" element={<FindId />}></Route>
                <Route path="/findenrollmentId" element={<FindEnrollmentId />} ></Route>
                <Route path="/findPw" element={<FindPw />}  ></Route>
                <Route path="/findenrollmentPw" element={<FindEnrollmentPw/>}  ></Route>
            </Routes>
        </div >
    );
}

export default Find;
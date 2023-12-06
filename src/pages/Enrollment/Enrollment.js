import { Route, Routes } from "react-router-dom";
import HomeEnrollment from "./HomeEnrollment";
import Entry from "./Entry";

const Enrollment = () => {
    return (
        <>
            <Routes>
                <Route path="/" element={<HomeEnrollment/>}/>
                <Route path="/entry" element={<Entry />}></Route>
            </Routes>
        </>
    );
}

export default Enrollment;
import 'bootstrap/dist/css/bootstrap.min.css';
import signupImage from './assets/signup.png';
import successImage from './assets/success.png';
import style from "./Enrollment.module.css"
import { Link } from 'react-router-dom';
import Footer from "../commons/Footer";

const Entry = () => {
  return (
    <div className={style.container}>
      <div className={style.imgbag} style={{padding:"50px"}}>
        <img style={{width:'50%'}} className={style.img} src={signupImage} alt="이미지 설명" />
      </div>
      <div>
        <img style={{width:'100%'}} src={successImage} alt="이미지 설명" />
      </div>
      <div style={{display:'flex', justifyContent:'center',marginTop:'20px'}}>
        <Link to={`/`}>&raquo; 홈으로 돌아가기</Link>
      </div>
      <div>
      <Footer/>
      </div>
    </div>
  );
}

export default Entry;

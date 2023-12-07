import style from "./Main.module.css"
import homeimg from "../Enrollment/assets/homeimg.jpg";
const Main = () => {
    return (
        <div className={style.container}>
            <div className={style.imgbox}>
                <img className={style.homeimg} src={homeimg} alt="..." />
                <div className={style.overlay_text}>어떤 방을 찾으세요?</div>
            </div>
            <div className={style.middlebox}>
                <div className={style.middle_up}>

                </div>
                <div className={style.middle_down}>
                    
                </div>
            </div>
            <div className={style.footerbox}>
                dsadsa
            </div>

        </div>
    );
}
export default Main;
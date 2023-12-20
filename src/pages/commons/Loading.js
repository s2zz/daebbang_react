import style from "./Loading.module.css"
const Loading = () => {
    return (
        <div className={style.container}>
            <div className={style.spinner}>
                <div className={style.bounce1}></div>
                <div className={style.bounce2}></div>
                <div className={style.bounce3}></div>
            </div>
        </div>

    );
}
export default Loading;

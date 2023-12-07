import style from './DelContents.module.css';

const DelContents = () => {
    return (
        <div className={style.container}>
            <div className={style.text}>
                정말 삭제하시겠습니까?
            </div>
            <hr/>
                <div className={style.btns}>
                    <button id="delContentsBtn">삭제</button>
                    <button id="cancelBtn">취소</button>
                </div>
        </div>
    );
}

export default DelContents;
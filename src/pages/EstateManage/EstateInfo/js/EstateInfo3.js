import style from '../css/EstateInfo.module.css';

function EstateInsert3({ realEstate }) {
  return (
    <>
      <div className={style.titleDiv}>
        <h1 className={style.title}>사진</h1>
      </div>
      <table className={style.estateTable}>
        <tr>
          <th>일반 사진</th>
        </tr>
      </table>
      <div className={style.imagePreviews}>
        {realEstate.images.length > 0 ? (
          realEstate.images.map((preview, index) => (
            <img key={index} src={`..\\..\\uploads\\estateImages\\${preview.sysName}`} alt={`Preview ${index}`} className={style.imagePreview} />
          ))
        ) : (
          <p></p>
        )}
      </div>

      <div className={style.titleDiv}>
        <h1 className={style.title} >상세 설명</h1>
      </div>
      <table className={style.estateTable}>
        <tr>
          <th>제목</th>
          <td>
            <input type="text" className={style.inputTitle} placeholder="제목을 입력해주세요." name="title" value={realEstate.title} readOnly></input>
          </td>
        </tr>
        <tr>
          <th>상세설명</th>
          <td>
            <textarea placeholder="설명을 입력해주세요." className={style.inputContents} name="contents" readOnly>{realEstate.contents}</textarea>
          </td>
        </tr>
        <tr>
          <th>메모</th>
          <td>
            <textarea placeholder="메모는 본인에게만 보입니다." className={style.inputContents} name="memo" readOnly>{realEstate.memo}</textarea>
          </td>
        </tr>
      </table>
    </>
  );
}

export default EstateInsert3;
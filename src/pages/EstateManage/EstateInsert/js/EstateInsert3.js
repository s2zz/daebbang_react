import { useState } from "react";
import style from '../css/EstateInsert.module.css';

function EstateInsert3({ realEstate, setRealEstate, estateImages, setEstateImages}) {
  // 이미지 미리보기
  const [imagePreviews, setImagePreviews] = useState([]);

  const handleImageChange = (e) => {
    const files = e.target.files;

    if (files.length > 0) {
      setEstateImages([...estateImages, ...files]);

      const previews = [];
      for (const file of files) {
        // 파일리더 API
        const reader = new FileReader();
        reader.onload = (e) => {
          previews.push(e.target.result);

          if (previews.length === files.length) {
            setImagePreviews(previews);
          }
        }
        reader.readAsDataURL(file);
      }
    } else {
      setEstateImages([]);
      setImagePreviews([]);
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRealEstate(prev => ({ ...prev, [name]: value }));
  }

  return (
    <div className="container">
      <h1 className={style.title}>사진 등록</h1>
      <div>사진은 3장 이상 10장 이하 등록 가능합니다.</div>
      <table border={1}>
        <tr>
          <th>일반 사진<span>*</span></th>
          <td>
            <input type="file" multiple={true} accept="image/gif, image/jpeg, image/png" onChange={handleImageChange} />
          </td>
        </tr>
      </table>
      <div className="imagePreviews">
        {imagePreviews.length > 0 ? (
          imagePreviews.map((preview, index) => (
            <img key={index} src={preview} alt={`Preview ${index}`} className={style.imagePreview} />
          ))
        ) : (
          <p>No images selected</p>
        )}
      </div>
      <h1 className={style.title} >상세 설명</h1>
      <table border={1}>
        <tr>
          <th>제목<span>*</span></th>
          <td>
            <input type="text" placeholder="제목을 입력해주세요." name="title" onChange={handleChange}></input>
          </td>
        </tr>
        <tr>
          <th>상세설명<span>*</span></th>
          <td>
            <textarea placeholder="설명을 입력해주세요." name="contents" onChange={handleChange}></textarea>
          </td>
        </tr>
        <tr>
          <th>메모</th>
          <td>
            <textarea placeholder="메모는 본인에게만 보입니다." name="memo" onChange={handleChange}></textarea>
          </td>
        </tr>
      </table>
    </div>
  );
}

export default EstateInsert3;

import DaumPostcode from "react-daum-postcode";
import style from '../css/Post.module.css';

const Post = (props) => {

    const complete = (data) => {
        let fullAddress = data.address;
        let extraAddress = '';

        if (data.addressType === 'R') {
            if (data.bname !== '') {
                extraAddress += data.bname;
            }
            if (data.buildingName !== '') {
                extraAddress += (extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName);
            }
            fullAddress += (extraAddress !== '' ? ` (${extraAddress})` : '');
        }
        console.log(data);
        console.log(data.sigungu);
        console.log(data.bname1);
        console.log(data.bname2);

        props.setcompany({
            ...props.company,
            zipcode: data.zonecode,
            address1: fullAddress,
            address2: data.sigungu + data.bname1 + " " + data.bname2
        })

        console.log(props.company);
    }

    return (
        <div>
            <DaumPostcode
                className={style.postmodal}
                autoClose
                onComplete={complete} />
        </div>
    );
};

export default Post;
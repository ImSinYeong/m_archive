import { useState, useRef } from 'react';
import { Button } from '../../../../components/Common';
import QuestionDetail from './questionDetail';
import styles from './faqListModal.module.scss';
import { getFAQsMe } from '../../../../api/FAQ';
import { useMount } from 'react-use';

//NOTE: "문의하기 모달" 과 "문의내역 모달" 2개는 구분을해서 만드는게 좋다.
//NOTE: scss파일은 js파일 하나 당 1개 => 유지보수가 쉬워짐
const FAQListModal = ({ onClose }) => {
  //NOTE: questions => faqs
  // const [clicks, setClicks] = useState([]);
  const [faqs, setFAQs] = useState([
    /*{
      title: '제목1',
      status: '답변 완료',
      content: '질문내용',
      answer: '제목1에 대한 답변입니다.',
      isExpanded: false,
    },
    {
      title: '제목2',
      status: '미답변',
      content: '질문내용',
      answer: '',
      isExpanded: false,
    },
    {
      title: '제목3',
      status: '답변 완료',
      content: '질문내용',
      answer: '제목3에 대한 답변입니다.',
      isExpanded: false,
    },*/
  ]);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(null);

  // const tbodyRef = useRef(null);

  // const handleQuestionClick = (index) => {
  //   const copyClicks = [...clicks];
  //   copyClicks[index] = !copyClicks[index];
  //   setClicks([
  //    ...copyClicks,
  //   ])
  // };

  const handleQuestionClick = (index) => {
    if (selectedQuestionIndex === index) {
      // 이미 선택한 질문을 다시 클릭한 경우
      setSelectedQuestionIndex(null);
    } else {
      setSelectedQuestionIndex(index);
    }
  };

  // const handleSubmit = async (event) => {
  //   event.preventDefault();
  //   //NOTE: submitted 상태 관리보다는 alert 띄우고 확인 누르면 모달이 꺼지도록
  //   // setIsSubmitted(true);
  // };
  const onGetMyFAQs = async () => {
    const response = await getFAQsMe(1, 20);
    if (response.status === 200) {
      const items = [...response.data.data];
      setFAQs(items);
      // const clickedList = new Array(items.length).fill(false);
      // setClicks(clickedList);
      //console.log(clicks);
    } else {
      console.log('나의 FAQs 불러오기실패');
    }
  };
  useMount(() => {
    onGetMyFAQs();
    console.log(faqs);
  });
  return (
    <section>
      <h2 className={styles.faqListTitle}>문의 내역</h2>
      <table>
        <thead>
          <tr>
            <th>번호</th>
            <th>제목</th>
            <th>상태</th>
          </tr>
        </thead>
        <tbody className={styles.faqTableBody}>
          {faqs?.map((question, index) => (
            <>
              <tr
                key={index}
                onClick={() => handleQuestionClick(index)}
                className={styles.questionRow}
              >
                <td>{index + 1}</td>
                <td>{question.title}</td>
                <td>{question.status}</td>
              </tr>
              {selectedQuestionIndex === index && (
                <tr key={`answer-${index}`}>
                  <td colSpan="1">
                    <tr className={styles.faqAnswer}>답변</tr>
                  </td>
                  <td className={styles.Answer} colSpan="3">
                    <QuestionDetail question={question} />
                  </td>
                </tr>
              )}
            </>
          ))}
        </tbody>
      </table>
      {/** 
       * 
       * faqs.map(
        (question, index) =>
            question.isExpanded && (
              <tr key={index}>
                <td colSpan="3">
                  <QuestionDetail question={question} />
                </td>
              </tr>
            
          ),
      )
      */}
      {faqs
        .filter((item) => item.isExpanded === true)
        .map((question, index) => {
          return (
            <tr key={index}>
              <td colSpan="3">
                <QuestionDetail question={question} />
              </td>
            </tr>
          );
        })}
    </section>
  );
};

export default FAQListModal;

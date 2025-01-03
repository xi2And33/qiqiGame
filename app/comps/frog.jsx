'use client';
import Image from 'next/image';
import { useState, useEffect, useRef, Suspense, useLayoutEffect } from 'react';
import FrogTypeChecker from './FrogTypeChecker';
import StarWrap from './star';
// Basic styles for the modal
const modalStyles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    position: 'relative',
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    textAlign: 'center',
  },
  close: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    fontSize: '24px',
    fontWeight: 'bold',
    cursor: 'pointer',
    color: 'black',
  },
};

export default function Frog() {
  const isMounted = useRef(false);
  let timer1 = null;
  let opts = ['+', '-', '×', '÷', '÷', '÷'];
  let optsReals = ['+', '-', '*', '/', '/', '/'];
  const [isOpen, setIsOpen] = useState(false);
  const [frogType, setFrogType] = useState(null);
  const handleFrogTypeChange = (type) => {
    setFrogType(type);
  };
  const openModal = () => {
    setIsOpen(true);
  };
  const closeModal = () => setIsOpen(false);

  let splitNum = 25;
  const colorVariants = {
    normal: 'border-black',
    green: 'border-green-600 text-green-600  border-4 ',
    red: 'border-red-600 text-red-600 border-4',
  };
  const [starNum, setStarNum] = useState([]);

  const [imageSrc, setImageSrc] = useState('');
  const frog = useRef(null);
  const starRef = useRef(null);
  const inputRef = useRef(null);
  const [perStepMove, setperStepMove] = useState(0);
  const [arr1, setarr1] = useState([]);
  const [arr2, setarr2] = useState([]);
  const [myCorrectNum, setmyCorrectNum] = useState(0);
  const [currentDate, setcurrentDate] = useState('');

  const [ans1MaxVal, setans1MaxVal] = useState(50);
  const [ans2MaxVal, setans2MaxVal] = useState(20);
  const [ans1Step, setans1Step] = useState(1);
  const [ans2Step, setans2Step] = useState(1);

  const [opt, setopt] = useState('');
  const [ans1, setans1] = useState('');
  const [ans2, setans2] = useState('');
  const [realRes, setrealRes] = useState('');
  const [isAnswerRight, setisAnswerRight] = useState(false);
  const [myRes, setmyRes] = useState('');
  const [isDisableAgain, setisDisableAgain] = useState(false);
  const [correctStatus, setcorrectStatus] = useState('normal');

  function prepareVal(toVal = 100, step = 1) {
    let arr = [];
    if (toVal <= 2) {
      return [2];
    }
    for (let i = 2; i <= toVal; i = i + step) {
      arr.push(parseFloat(i.toFixed(2)));
    }
    return arr;
  }

  function goAgain(a_arr1, a_arr2) {
    let t_arr1 = a_arr1 || arr1;
    let t_arr2 = a_arr2 || arr2;

    if (isDisableAgain) {
      return;
    }

    setisAnswerRight(false);
    setmyRes('');
    resetArr(t_arr1, t_arr2);
  }

  function resetArr(t_arr1, t_arr2) {
    setisDisableAgain(true);
    inputRef.current.focus();
    inputRef.current.setSelectionRange(4, 4);

    if (get_val_lc('ans1Before')) {
      setans1(get_val_lc('ans1Before'));
      setans2(get_val_lc('ans2Before'));
      setopt(get_val_lc('optBefore'));
      setrealRes(get_val_lc('finalResBefore'));
      setcorrectStatus('normal');
      return;
    }

    let indexopt = parseInt(Math.random() * opts.length);
    let opt = opts[indexopt];
    let optReal = optsReals[indexopt];
    let index1 = parseInt(Math.random() * t_arr1.length);

    setans1(t_arr1[index1]);
    setopt(opt);

    if (opt == '-') {
      t_arr2 = prepareVal(t_arr1[index1], ans2Step);
      setarr2(t_arr2);
    }

    let index2 = parseInt(Math.random() * t_arr2.length);
    setans2(t_arr2[index2]);

    let finalRes = eval(
      `${t_arr1[index1]}${optReal}${t_arr2[index2]}`
    ).toString();
    if (finalRes.includes('.')) {
      finalRes = Number(finalRes).toFixed(2);
    }
    setrealRes(finalRes);
    setcorrectStatus('normal');

    console.log(`${t_arr1[index1]}${opt}${t_arr2[index2]}=`, finalRes);

    set_val_lc('ans1Before', t_arr1[index1]);
    set_val_lc('ans2Before', t_arr2[index2]);
    set_val_lc('optBefore', opt);
    set_val_lc('finalResBefore', finalRes);
  }

  function check() {
    if (isAnswerRight) {
      return;
    }
    if (myCorrectNum == 100) {
      return;
    }
    setcorrectStatus(judgeEqual(realRes, myRes) ? 'green' : 'red');
    if (judgeEqual(realRes, myRes)) {
      remove_val_lc([
        'ans1Before',
        'ans2Before',
        'optBefore',
        'finalResBefore',
      ]);
      setisAnswerRight(true);

      setisDisableAgain(myCorrectNum + 1 == 100);
      localStorage.setItem('correntNum', myCorrectNum + 1);
      setmyCorrectNum(myCorrectNum + 1);

      if (myCorrectNum + 1 == 100) {
        let starN = localStorage.getItem('starNum') || 0;
        localStorage.setItem('starNum', parseInt(starN) + 1);
        setStarNum(new Array(parseInt(starN) + 1).fill(1));
      }

      console.log(
        'parseInt(myCorrectNum / splitNum)',
        parseInt(myCorrectNum / splitNum)
      );
    }
  }

  function judgeEqual(realRes, myRes) {
    if (realRes == myRes) {
      return true;
    } else {
      return eval(realRes) == eval(myRes);
    }
  }

  function getValFromLocalstorage(name, func, defultNum) {
    let num = localStorage.getItem(name) || defultNum;
    func(parseFloat(num));
    localStorage.setItem(name, num);
  }

  function set_val_lc(name, num) {
    localStorage.setItem(name, num);
  }
  function get_val_lc(name, num) {
    return localStorage.getItem(name) || '';
  }
  function remove_val_lc(name) {
    if (Array.isArray(name)) {
      name.map((n) => {
        localStorage.removeItem(n);
      });
    } else {
      localStorage.removeItem(name);
    }
  }

  useEffect(() => {
    if (!isMounted.value) {
      isMounted.value = true;
    }
    getValFromLocalstorage('correntNum', setmyCorrectNum, 0);

    getValFromLocalstorage('ans1MaxVal', setans1MaxVal, 50);
    getValFromLocalstorage('ans2MaxVal', setans2MaxVal, 20);
    getValFromLocalstorage('ans1Step', setans1Step, 1);
    getValFromLocalstorage('ans2Step', setans2Step, 1);

    setperStepMove((document.body.clientWidth * 3) / 400);

    let starN = localStorage.getItem('starNum') || 0;
    setStarNum(new Array(parseInt(starN)).fill(1));
    return () => {};
  }, []);

  useEffect(() => {
    if (isMounted.value) {
      let objectDate = new Date();
      let day = objectDate.getDate();
      let month = objectDate.getMonth();
      let year = objectDate.getFullYear();

      setcurrentDate(`${year}-${month + 1}-${day}`);

      let arr1 = prepareVal(ans1MaxVal, ans1Step);
      let arr2 = prepareVal(ans2MaxVal, ans2Step);

      setarr1(arr1);
      setarr2(arr2);

      resetArr(arr1, arr2);
    }

    return () => {};
  }, [ans1Step, ans2Step]);

  useEffect(() => {
    if (frogType === '1') {
      const i = parseInt(Math.random() * 220) % 22;
      setImageSrc(`/qiqiGame/images/kid/${i}.gif`);
    } else {
      setImageSrc(
        `/qiqiGame/images/normalFrog/${parseInt(myCorrectNum / 25)}.jpg`
      );
    }
    frog.current.style.transform = `translateX(${
      perStepMove * myCorrectNum - 50
    }px)`;
  }, [frogType, myCorrectNum]);

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center select-none">
      <StarWrap starNum={starNum} />
      <Suspense fallback={<div>Loading...</div>}>
        <FrogTypeChecker onFrogTypeChange={handleFrogTypeChange} />
      </Suspense>
      <div
        className="text-xl text-teal-200 mb-10"
        onClick={() => {
          let pass = confirm('确认重置吗？');
          if (pass) {
            localStorage.setItem('correntNum', 0);
            location.reload();
          }
        }}
      >
        {currentDate}
      </div>
      <div className="w-3/4 h-[130px] ">
        <div ref={frog} className=" absolute  transition-all w-[100px]">
          <Image
            src={imageSrc}
            alt="qiqi logo"
            width={100}
            height={100}
            className="rounded-full  translate-y-[20%] cursor-pointer"
            onClick={openModal}
            priority
          />
          <div className=" absolute left-[40px] top-[-20px] text-xl font-bold text-green-600">
            {myCorrectNum}
          </div>
        </div>
        <div className="w-full h-[50px] mt-[50px] border rounded-full">
          <div
            className="ml-[4px] h-[44px] mt-[2px] bg-green-600 rounded-full"
            style={{ width: `${perStepMove * myCorrectNum}px` }}
          ></div>
        </div>
      </div>
      <div className="w-3/4 h-4/5  flex flex-col">
        <div className="flex justify-around mt-10 text-4xl">
          <div className="w-[200px] h-28  flex items-center justify-center">
            {ans1}
          </div>
          <div className="w-[100px] h-28  flex items-center justify-center">
            {opt}
          </div>
          <div className="w-[200px] h-28  flex items-center justify-center">
            {ans2}
          </div>
          <div className="h-28 flex items-center text-5xl">=</div>
          <div
            className={`w-[200px] h-28 border border-cyan-200 rounded-lg flex flex-col justify-center items-center ${colorVariants[correctStatus]}`}
          >
            <input
              type="text"
              className="w-[160px] h-[50px] border-none outline-0 bg-black text-white caret-white"
              value={myRes}
              ref={inputRef}
              disabled={myCorrectNum == 100}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  if (isAnswerRight) {
                    goAgain();
                  } else {
                    check();
                  }
                }
              }}
              onChange={(e) => {
                setmyRes(e.target.value);
              }}
            />
            <div className="text-sm ">{opt == '÷' && '(结果保留两位小数)'}</div>
          </div>
        </div>
        <div className="flex text-xl flex-col justify-center items-end mr-[30px]">
          <div
            className={` w-[130px] h-[50px] flex justify-center items-center my-5  text-green-50  rounded  ${
              isAnswerRight || myCorrectNum == 100
                ? 'bg-slate-900 hover:text-xl cursor-not-allowed'
                : 'cursor-pointer bg-orange-500'
            }`}
            onClick={check}
          >
            对答案
          </div>
          <div
            className={` w-[130px] h-[50px] flex justify-center items-center   text-green-50 hover:text-2xl rounded  ${
              isDisableAgain
                ? 'bg-slate-900 hover:text-xl cursor-not-allowed'
                : 'cursor-pointer bg-orange-500'
            }`}
            onClick={() => {
              goAgain();
            }}
          >
            再来一题
          </div>
          <div className="text-6xl w-full text-cyan-600 flex justify-center">
            {myCorrectNum == 100 ? '你赢了！！！！！' : ''}
          </div>
        </div>
      </div>
      {/* Modal for Larger Image */}
      {isOpen && (
        <div style={modalStyles.overlay}>
          <div style={modalStyles.modal}>
            <span style={modalStyles.close} onClick={closeModal}>
              &times;
            </span>
            <Image src={imageSrc} width={400} height={400} />
          </div>
        </div>
      )}
    </div>
  );
}

'use client';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';

export default function Home() {
  let opts = ['+', '-', '×', '÷'];
  let optsReals = ['+', '-', '*', '/'];

  let ans1MaxVal = 100;
  let ans2MaxVal = 100;
  let ans1Step = 2;
  let ans2Step = 1;
  let splitNum = 25;
  const colorVariants = {
    normal: 'border-black',
    green: 'border-green-600 text-green-600  border-4 ',
    red: 'border-red-600 text-red-600 border-4',
  };
  const frog = useRef(null);
  const inputRef = useRef(null);
  const [perStepMove, setperStepMove] = useState(0);
  const [imgRoad, setImgRoad] = useState(0);
  const [arr1, setarr1] = useState([]);
  const [arr2, setarr2] = useState([]);
  const [myCorrectNum, setmyCorrectNum] = useState(0);
  const [currentDate, setcurrentDate] = useState('');

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

    inputRef.current.focus();
    setisAnswerRight(false);
    setisDisableAgain(true);
    setmyRes('');
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
      finalRes = Number(finalRes).toFixed(1);
    }
    setrealRes(finalRes);
    setcorrectStatus('normal');

    console.log(`${t_arr1[index1]}${opt}${t_arr2[index2]}=`, finalRes);
  }

  function check() {
    if (isAnswerRight) {
      return;
    }
    setcorrectStatus(realRes == myRes ? 'green' : 'red');
    if (realRes == myRes) {
      setisAnswerRight(true);
      if (myCorrectNum == 100) {
        return;
      }
      localStorage.setItem('correntNum', myCorrectNum + 1);
      setmyCorrectNum(myCorrectNum + 1);
      setisDisableAgain(myCorrectNum + 1 == 100);
      console.log(
        'parseInt(myCorrectNum / splitNum)',
        parseInt(myCorrectNum / splitNum)
      );
    }
  }
  function moveFrog() {
    setImgRoad(parseInt(myCorrectNum / splitNum));

    frog.current.style.transform = `translateX(${
      perStepMove * myCorrectNum - 50
    }px)`;
  }

  useEffect(() => {
    let correntNum = localStorage.getItem('correntNum') || 0;
    correntNum = parseInt(correntNum);
    setmyCorrectNum(correntNum);

    let arr1 = prepareVal(ans1MaxVal, ans1Step);
    let arr2 = prepareVal(ans2MaxVal, ans2Step);
    setarr1(arr1);
    setarr2(arr2);
    goAgain(arr1, arr2);
    setperStepMove((document.body.clientWidth * 3) / 400);
    return () => {};
  }, []);

  useEffect(() => {
    let objectDate = new Date();
    let day = objectDate.getDate();
    let month = objectDate.getMonth();
    let year = objectDate.getFullYear();

    setcurrentDate(`${year}-${month + 1}-${day}`);
    return () => {};
  }, []);

  useEffect(() => {
    moveFrog();

    return () => {};
  }, [myCorrectNum]);

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center select-none">
      <div
        className="text-xl text-black mb-10"
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
            src={`images/${imgRoad}.jpg`}
            alt="qiqi logo"
            width={100}
            height={100}
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
            className={`w-[200px] h-28 border flex justify-center items-center ${colorVariants[correctStatus]}`}
          >
            <input
              type="text"
              className="w-[160px] h-[50px] border-none outline-0"
              value={myRes}
              ref={inputRef}
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
          </div>
        </div>
        <div className="flex text-xl flex-col justify-center items-end mr-[30px]">
          <div
            className={` w-[130px] h-[50px] flex justify-center items-center my-5  text-green-50  rounded bg-black ${
              isAnswerRight
                ? 'bg-slate-500 hover:text-xl cursor-not-allowed'
                : 'cursor-pointer'
            }`}
            onClick={check}
          >
            对答案
          </div>
          <div
            className={` w-[130px] h-[50px] flex justify-center items-center   text-green-50 hover:text-2xl rounded bg-black ${
              isDisableAgain
                ? 'bg-slate-500 hover:text-xl cursor-not-allowed'
                : 'cursor-pointer'
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
    </div>
  );
}
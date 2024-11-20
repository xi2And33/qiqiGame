export default function StarWrap({ starNum }) {
  return (
    <div className="w-[170px]  fixed left-0 top-3 border-red-100 border">
      <div className=" w-full text-center">祺祺闯过的关</div>
      <div className="flex flex-wrap items-start justify-center ">
        {starNum.map((_, i) => (
          <div className=" relative " key={i}>
            <img
              src={`/qiqiGame/images/star.png`}
              alt="qiqi logo"
              style={{ width: 40, height: 40 }}
              className="rounded-full "
              priority
            />
            <div className=" text-center font-bold translate-y-[-10px]">
              {i + 1}
            </div>
          </div>
        ))}
      </div>
    </div>
  ); // This component only triggers the effect and renders nothing
}

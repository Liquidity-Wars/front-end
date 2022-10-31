import styles from "../styles/Home.module.css";

export default function MapPage() {
  return (
    <div classname="flex justify-center items-center">
      <div className="flex m-auto justify-center bg-cover w-[800px] h-[800px] bg-[url('/assets/images/map_background.png')] bg-center">
        <div classname="absolute w-[350px] h-[200px] border-2 border-grey-300 hover:border-yellow-300 hover:border-4 translate-x-[-200px] translate-y-[80px] bg-black z-20"></div>
      </div>
    </div>
  );
}

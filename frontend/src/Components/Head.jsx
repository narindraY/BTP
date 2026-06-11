import logo from "../assets/logo.png"
function Head() {
    return (
        <div className="w-full h-18 bg-[var(--primary)] flex items-center ">
            <img src={logo} className="w-20 h-20" />
            <p className="text-white text-2xl italic">Structura</p>
        </div>
    );
}

export default Head;
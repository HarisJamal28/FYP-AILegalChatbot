import { Link } from "react-router-dom";

const Home = () =>{
    return ( 
        <div className="bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 text-white py-10 sm:text-xl">
            <div className="container mx-auto px-4 text-center justify-center mt-12 mb-6">
                <div className="inline-block">
                    <p className=" bg-yellow-600 text-black text-base md:text-lg py-2 px-4 rounded-full mb-6 inline-block animate-colorCycle font-serif">Your Virtual therapist!</p>
                </div>
                {/* <div className="m-10"> */}
                    <h1 className="my-10 mx-auto text-center text-black text-5xl sm:text-6xl md:text-7xl lg:text-7xl font-serif">Your Mental Health Companion, Anytime, Anywhere</h1>
                    <p className="mt-10 text-center text-black text-lg md:text-2xl ">Talk, share, and get support with our AI-powered chatbot designed to guide you through life&apos;s challenges. Release your stress and anxiety with our expertly crafted conversations.</p>
                    <p className="mb-14 text-center text-black text-lg md:text-2xl">Feel free to share your Feelings!!</p>
                    <Link to="/chatbot" className="bg-slate-900 text-white font-semibold py-5 px-7 rounded-full shadow-lg hover:bg-slate-700 transition duration-300">
                        Chat Now
                    </Link>
                {/* </div> */}
            </div>
        </div>
    );
};

export default Home;

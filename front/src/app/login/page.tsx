export default function login() {
    return (
        <div className="flex justify-center items-center h-screen">
            <form className="border-1 p-4 w-[40%] flex flex-col gap-4">
                <input type="text" placeholder="username" required className="border-1 rounded py-2 p-2"></input>
                <input type="email" placeholder="email" required className="border-1 rounded py-2 p-2"></input>
                <input type= "password" placeholder="password" required className="border-1 rounded py-2 p-2"></input>
                <input type="submit" value="Login" className="border-1 rounded py-3 "></input>
            </form>
        </div>
    )
}
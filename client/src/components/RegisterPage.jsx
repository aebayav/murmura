import { useState } from "react"
import { FaArrowLeft } from "react-icons/fa"

const RegisterPage = ({handleRegister}) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [email,setEmail] = useState('')
    const [birthDate, setBirthDate] = useState('')
    const [error, setError] = useState('')

    const onSubmit = async (event) => {
        event.preventDefault();
        setError("");
        try {
            await handleRegister({
                username,
                password,
                email,
                birth_date: birthDate
            });
        }
        catch(error) {
            setError(error.message || "Registration failed. Please try again.")
        }
    };

    return(<>
        <div className="min-h-screen flex items-center justify-center bg-background-primary px-4 py-8">
            <form className="flex flex-col gap-3 sm:gap-4 w-full max-w-md px-4 py-6 sm:px-8 sm:py-10 bg-surface-primary rounded-2xl shadow-2xl" onSubmit={onSubmit}>
                {error && 
                    <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 sm:px-4 sm:py-3 rounded text-sm sm:text-base">
                        {error}
                    </div>
                }
                <label className="mb-2 sm:mb-4 pl-1 block text-sm sm:text-base text-text-primary">
                    Username
                    <input placeholder="Username" className="mt-2 w-full px-3 py-2 sm:px-4 sm:py-3 text-base sm:text-lg rounded-lg border border-border-primary bg-background-secondary text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary" value={username} type="text" onChange={(event) => {setUsername(event.target.value)}}/>
                </label>
                <label className="mb-2 sm:mb-4 pl-1 block text-sm sm:text-base text-text-primary">
                    Password
                    <input placeholder="Password" className="mt-2 w-full px-3 py-2 sm:px-4 sm:py-3 text-base sm:text-lg rounded-lg border border-border-primary bg-background-secondary text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary" value={password} type="password" onChange={(event) => {setPassword(event.target.value)}}/>
                </label>
                <label className="mb-2 sm:mb-4 pl-1 block text-sm sm:text-base text-text-primary">
                    E-mail
                    <input placeholder="E-mail" className="mt-2 w-full px-3 py-2 sm:px-4 sm:py-3 text-base sm:text-lg rounded-lg border border-border-primary bg-background-secondary text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary" value= {email} type="email" onChange={(event) => {setEmail(event.target.value)}}/>
                </label>
                <label className="mb-2 sm:mb-4 pl-1 block text-sm sm:text-base text-text-primary">
                    Birth Date
                    <input placeholder="Birth Date" className="mt-2 w-full px-3 py-2 sm:px-4 sm:py-3 text-base sm:text-lg rounded-lg border border-border-primary bg-background-secondary text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary" value={birthDate} type="date" onChange={(event) => {setBirthDate(event.target.value)}}/>
                </label>
                <input className="w-full px-4 py-2.5 sm:py-3 text-base sm:text-lg font-semibold cursor-pointer transition-all duration-200 bg-accent-primary text-background-primary border-2 border-accent-secondary rounded-xl hover:bg-accent-tertiary hover:text-text-primary" type="submit" value={"Register"}/>
            </form>
        </div>
        <button onClick={() => window.location.href = '/'} className="absolute top-4 right-4 sm:top-8 sm:right-12 p-2 hover:bg-surface-secondary rounded-full transition-colors">
            <FaArrowLeft className='w-5 h-5 sm:w-8 sm:h-8 text-text-primary cursor-pointer transition-transform duration-150 ease-in-out hover:scale-110'/>
        </button>
        </>
    )
}

export default RegisterPage
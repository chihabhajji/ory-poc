import { Session } from "@ory/client"
import axios from "axios"
import { useState, useEffect } from "react"

function Message({url}): JSX.Element {
    const {messages, error, isLoading} = useMessageFetcher(url);
    if(isLoading){
        <div>Loading...</div>
    }
    if(error){
        <div>Failed to fetch!</div>
    }

    return <>
        { messages?.map((message, index) => <p key={index}>{message}</p>)}
    </>
}

let fetchCounter = 0;
function useMessageFetcher(url: string) {
    const [messages, setMessages] = useState<[string]>()
    const [error, setError] = useState<string | undefined>(undefined)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        setIsLoading(true)
        axios.get(url, { withCredentials: true })
        .then(({ data }) => setMessages(data.messages))
        .catch(({ response }) => setError(response.data))
        .finally(()=> setIsLoading(false))
        fetchCounter++;
        console.log(fetchCounter)
    }, [url])

    return {messages, error, isLoading}
}

export default Message;
import './App.css'
import { useContext, useEffect, useState } from 'react'
import { SessionContext } from '../utils/hooks/sessionHook';
import { frontEndOryApi } from '../utils/ory/oryClient';
import { LoginFlow, UiText } from '@ory/client';
import { useParams } from 'react-router-dom';
function Login() {
    const context = useContext(SessionContext);
    const [action, setAction] = useState<LoginFlow | undefined>()
    const [errors, setErrors] = useState<UiText[] | undefined>()
    const params = useParams()
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        if (context?.session) {
            window.location.replace(params.return_to ?? '/');
        }
        frontEndOryApi.createBrowserLoginFlow({ returnTo: 'http://127.0.0.1:3000/' })
            .then(({ data: flow }) => setAction(flow))
            .catch((error) => console.error(error))
            .finally(() => setLoading(false))
    }, [])

    if (loading) return <h1>One sec...</h1>
    if (!action) return <h1>Something went wrong when contacting the Ory client 🤷‍♀️</h1>

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        setLoading(true)
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const data = Object.fromEntries(formData.entries())
        frontEndOryApi.updateLoginFlow({
            flow: action?.id!, updateLoginFlowBody: {
                method: 'password',
                identifier: data.identifier.toString(),
                password: data.password.toString(),
                csrf_token: data.csrf_token.toString(),
            }
        }).then(({ data: flow }) => {
            context?.setSession(flow.session)
            window.location.replace(params.return_to ?? '/')
        }).catch((data) => {
            frontEndOryApi.getLoginFlow({ id: action!.id }).then(({ data: flow }) => {
                setErrors(flow.ui.messages)
                                                console.log(flow)
            })

        }).finally(() => setLoading(false))
    }

    return (
        <>
            {
                (action?.ui.messages) ? action?.ui.messages.map((message) => {
                    return <div>{message.text}</div>
                }) : <></>
            }
            <form onSubmit={handleSubmit}>
                {
                    action?.ui.nodes.map((node, i) => {
                        return <div key={i}>
                            <label htmlFor={node.meta.id} itemType={node.meta.type}>{node.meta.text}</label>
                            <input type={node.attributes.type}
                                autoComplete={node.attributes.autocomplete}
                                name={node.attributes.name}
                                defaultValue={node.attributes.value}
                                disabled={node.attributes.disabled}
                                required={node.attributes.required}
                                id={node.meta.id}
                                key={i} />
                        </div>
                    })
                }
            </form>
            {
                errors?.map((error) => {
                    return <div key={error.id}>{error.text} </div>
                })
            }
        </>
    )
}


export default Login

// onDownloadProgress: (progressEvent) => {
//     console.log(progressEvent)
// }

//             {
//     (action?.ui.messages) ? action?.ui.messages.map((message) => {
//         return <div>{message.text}</div>
//     }) : <></>
// }
// <form action={action?.ui.action} method={action?.ui.method} encType='application/x-www-form-urlencoded'>
//     {
//         action?.ui.nodes.map((node, i) => {
//             return <div key={i}>
//                 <label htmlFor={node.meta.id}>{node.meta.text} aa</label>
//                 <input type={node.attributes.type}
//                     name={node.attributes.name}
//                     defaultValue={node.attributes.value}
//                     disabled={node.attributes.disabled}
//                     required={node.attributes.required}
//                     id={node.meta.id}
//                     key={i} />
//             </div>
//         })
//     }
// </form>
import { Component } from 'react'
import { Route, redirect } from 'react-router-dom'
import { useSession } from '../utils/hooks/sessionHook';
export default function ProtectedRoute({ component, props }: { component: Component, props: any }) {
    const { context, isLoading } = useSession();

    if(context == null) return redirect('/login?return_to=' + window.location.href);

    return (
        <Route
            {...props}
            render={(props: any) => (
                <Component {...props} /> 
            )}
        />
    )
}

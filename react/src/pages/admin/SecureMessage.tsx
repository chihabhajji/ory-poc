import React, {useContext} from 'react';
import {SessionContext} from "../../utils/hooks/sessionHook";

export default function SecureMessage() {
    const session  = useContext(SessionContext)
    console.log(session)
    return (
        <div></div>
    );
}

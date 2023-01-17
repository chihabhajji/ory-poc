import React, {useContext} from 'react';
import {SessionContext} from "../../utils/hooks/sessionHook";
import Message from '../../components/Message';

export default function SecureMessage() {
    const session  = useContext(SessionContext)

    return (
        <Message url='http://127.0.0.1:4455/api/2/admin/hello' />
    );
}

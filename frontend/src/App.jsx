import React, { useState } from 'react';
import { CognitoUserPool, AuthenticationDetails, CognitoUser } from 'amazon-cognito-identity-js';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const poolData = {
    UserPoolId: 'us-east-1_4Rgib1wIK',
    ClientId: '24a5q70v6ns1tsqv3trttuv63g'
};
const userPool = new CognitoUserPool(poolData);

function App() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [token, setToken] = useState(null);
    const [data, setData] = useState('');

    const onSubmit = (event) => {
        event.preventDefault();
        
        const authenticationDetails = new AuthenticationDetails({
            Username: email,
            Password: password,
        });

        const userData = {
            Username: email,
            Pool: userPool,
        };
        const cognitoUser = new CognitoUser(userData);

        cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess: (result) => {
                const accessToken = result.getIdToken().getJwtToken();
                setToken(accessToken);
            },
            onFailure: (err) => {
                alert(err.message || JSON.stringify(err));
            },
        });
    };

    const fetchPedidos = async () => {
        try {
            const response = await axios.get('http://34.203.212.217:8080/api/pedidos', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setData(response.data);
        } catch (error) {
            setData("Error: " + error.response?.status);
        }
    };

    return (
        <div className="container mt-5">
            <h2>Pedidos360 - Frontend React</h2>
            {!token ? (
                <form onSubmit={onSubmit} className="mt-4">
                    <div className="mb-3">
                        <label>Email</label>
                        <input className="form-control" value={email} onChange={e => setEmail(e.target.value)} />
                    </div>
                    <div className="mb-3">
                        <label>Password</label>
                        <input className="form-control" type="password" value={password} onChange={e => setPassword(e.target.value)} />
                    </div>
                    <button type="submit" className="btn btn-primary">Iniciar Sesión</button>
                </form>
            ) : (
                <div className="mt-4">
                    <div className="alert alert-success">Sesión iniciada con AWS Cognito.</div>
                    <button onClick={fetchPedidos} className="btn btn-success">Obtener Pedidos (Protegido)</button>
                    {data && <div className="mt-3 p-3 bg-light border">{data}</div>}
                </div>
            )}
        </div>
    );
}

export default App;
